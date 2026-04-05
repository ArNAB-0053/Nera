import { prisma } from "@/prisma/prisma.js";
import type { IFileRepository } from "./file.schema.js";
import type { CreateFileData } from "@nera/db";

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
