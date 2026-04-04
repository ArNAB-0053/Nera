import { decryptFile, encryptFile } from "@/services/crypto.service.js";
import type { IUploadType } from "./file.schema.js";
import { randomUUID } from "crypto";
import { deleteObject, getObject, uploadObject } from "@/services/storage.service.js";
import { fileRepository as repo } from "./file.repository.js";
import type { CreateFileData } from "@nera/db";
import { NotFoundError } from "@nera/http";

export const fileServices = {
    // -----------------------------------------
    //                   UPLOAD
    // -----------------------------------------
    async uploadFile({ userId, folderId, file }: IUploadType) {
        const buffer = Buffer.from(new Uint8Array(await file.arrayBuffer()))

        const { encrypted, iv, tag } = encryptFile(buffer)

        // storage path
        const path = `${userId}/${folderId}/${randomUUID()}`

        try {
            await uploadObject(path, encrypted, file.type)

            const payload: CreateFileData = {
                userId,
                folderId,
                name: file.name,
                size: BigInt(file.size),
                storagePath: path,
                mimeType: file.type,
                isEncrypted: true,
                encryptionIv: iv.toString("hex"),
                encryptionTag: tag.toString("hex"),
            }

            const saved = await repo.createFile(payload)
            return saved;
        } catch (err) {
            // fallback: if somehow DB fails remove from storage as well
            await deleteObject(path);
            throw err;
        }
    },

    // -----------------------------------------
    //                 DOWNLOAD
    // -----------------------------------------
    async downloadFile(fileId: string) {
        const file = await repo.findFileById(fileId)

        if (!file) throw new NotFoundError()

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
    }
}