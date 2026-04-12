import { prisma } from "@/prisma/prisma.js";
import type { IFileRepository } from "./file.schema.js";
import type { CreateFileData } from "@nera/db";
import { BadRequestError, MESSAGES } from "@nera/http";

const MAX_USER_STORAGE_BYTES = 2n * 1024n * 1024n * 1024n;

const PUBLIC_FILE_SELECT = {
  id: true,
  userId: true,
  folderId: true,
  name: true,
  description: true,
  size: true,
  storagePath: true,
  mimeType: true,
  isEncrypted: true,
  encryptionIv: true,
  encryptionTag: true,
  isDeleted: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const fileRepository: IFileRepository = {
  createFile(data: CreateFileData) {
    return prisma.file.create({
      data,
      select: PUBLIC_FILE_SELECT,
    });
  },

  createFileWithStorageUpdate({ userId, fileSize, data }) {
    return prisma.$transaction(async (tx) => {
      const maxAllowedStorage = MAX_USER_STORAGE_BYTES - fileSize;
      const updatedUsers = await tx.$executeRaw`
        UPDATE "users"
        SET "totalStorageUsed" = "totalStorageUsed" + ${fileSize}
        WHERE "id" = ${userId}
          AND "totalStorageUsed" <= ${maxAllowedStorage}
      `;

      if (updatedUsers === 0) {
        throw new BadRequestError(MESSAGES.error.STORAGE_LIMIT_EXCEEDED);
      }

      return tx.file.create({
        data,
        select: PUBLIC_FILE_SELECT,
      });
    });
  },

  softDeleteFileWithStorageUpdate({ userId, fileId, fileSize }) {
    return prisma.$transaction(async (tx) => {
      await tx.file.update({
        where: { id: fileId },
        data: {
          isDeleted: true,
          deletedAt: new Date(),
        },
      });

      await tx.$executeRaw`
        UPDATE "users"
        SET "totalStorageUsed" = GREATEST("totalStorageUsed" - ${fileSize}, 0)
        WHERE "id" = ${userId}
      `;
    });
  },

  findFileById(id: string, userId: string) {
    return prisma.file.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
      select: PUBLIC_FILE_SELECT,
    });
  },

  findFilesByFolder({ userId, folderId, sortBy, order }) {
    return prisma.file.findMany({
      where: {
        userId,
        folderId: folderId ?? null,
        isDeleted: false,
      },
      orderBy: {
        [sortBy]: order,
      },
      select: PUBLIC_FILE_SELECT,
    });
  },
}
