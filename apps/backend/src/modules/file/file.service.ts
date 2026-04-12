import { decryptFile, encryptFile } from "@/services/crypto.service.js";
import type { IUploadType, ListFilesQueryType } from "./file.schema.js";
import { randomUUID } from "crypto";
import { deleteObject, getObject, uploadObject } from "@/services/storage.service.js";
import { fileRepository as repo } from "./file.repository.js";
import type { CreateFileData, PrismaFile } from "@nera/db";
import { BadRequestError, MESSAGES, NotFoundError } from "@nera/http";
import { folderRepository } from "../folder/folder.repository.js";
import { userRepository } from "../user/user.repository.js";

const MAX_USER_STORAGE_BYTES = 2n * 1024n * 1024n * 1024n;

export const fileServices = {
    async assertFolderAccess(userId: string, folderId?: string | null) {
        if (!folderId) {
            return null;
        }

        const folder = await folderRepository.findByIdForUser(folderId, userId);

        if (!folder) {
            throw new NotFoundError(MESSAGES.error.FOLDER_NOT_FOUND);
        }

        return folder;
    },

    // -----------------------------------------
    //                   UPLOAD
    // -----------------------------------------
    async uploadFile({ userId, folderId, file }: IUploadType) {
        await this.assertFolderAccess(userId, folderId);
        const fileSize = BigInt(file.size);
        const userStorage = await userRepository.findStorageUsageById(userId);

        if (!userStorage) {
            throw new NotFoundError(MESSAGES.error.USER_NOT_FOUND);
        }

        if (userStorage.totalStorageUsed + fileSize > MAX_USER_STORAGE_BYTES) {
            throw new BadRequestError(MESSAGES.error.STORAGE_LIMIT_EXCEEDED);
        }

        const buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()))

        const { encrypted, iv, tag } = encryptFile(buffer)
        const storageFolder = folderId ?? "root"

        // storage path
        const path = `${userId}/${storageFolder}/${randomUUID()}`

        try {
            await uploadObject(path, encrypted, file.type)

            const payload: CreateFileData = {
                userId,
                folderId: folderId ?? null,
                name: file.name,
                size: fileSize,
                storagePath: path,
                mimeType: file.type,
                isEncrypted: true,
                encryptionIv: iv.toString("hex"),
                encryptionTag: tag.toString("hex"),
            }

            const saved = await repo.createFileWithStorageUpdate({
                userId,
                fileSize,
                data: payload,
            })
            return {
                ...saved,
                size: Number(saved.size),
            } satisfies Omit<PrismaFile, "size"> & { size: number };
        } catch (err) {
            // fallback: if somehow DB fails remove from storage as well
            await deleteObject(path);
            throw err;
        }
    },

    async listFiles(
        userId: string,
        { folderId, sortBy, order }: ListFilesQueryType
    ) {
        await this.assertFolderAccess(userId, folderId ?? null);

        const files = await repo.findFilesByFolder({
            userId,
            folderId: folderId ?? null,
            sortBy,
            order,
        });

        return files.map((file) => ({
            ...file,
            size: Number(file.size),
        })) satisfies Array<Omit<PrismaFile, "size"> & { size: number }>;
    },

    // -----------------------------------------
    //                 DOWNLOAD
    // -----------------------------------------
    async downloadFile(userId: string, fileId: string) {
        const file = await repo.findFileById(fileId, userId)

        if (!file) throw new NotFoundError(MESSAGES.error.FILE_NOT_FOUND)

        const stream = await getObject(file.storagePath);

        const chunks: Buffer[] = [];

        for await (const chunk of stream) {
            chunks.push(chunk)
        }

        const encryptedBuffer = Buffer.concat(chunks)

        const decrypted = decryptFile(
            encryptedBuffer,
            Buffer.from(file.encryptionIv!, "hex"),
            Buffer.from(file.encryptionTag!, "hex")
        )

        return {
            buffer: decrypted,
            mimeType: file.mimeType,
            name: file.name,
        };
    },

    async deleteFile(userId: string, fileId: string) {
        const file = await repo.findFileById(fileId, userId)

        if (!file) throw new NotFoundError(MESSAGES.error.FILE_NOT_FOUND)

        await deleteObject(file.storagePath);
        await repo.softDeleteFileWithStorageUpdate({
            userId,
            fileId: file.id,
            fileSize: file.size,
        });

        return {
            id: file.id,
        };
    }
}
