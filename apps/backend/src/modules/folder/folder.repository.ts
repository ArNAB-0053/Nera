import { prisma } from "@/prisma/prisma.js";
import type { CreateFolderData } from "@nera/db";
import type { IFolderRepository } from "./folder.schema.js";

const PUBLIC_FOLDER_SELECT = {
  id: true,
  userId: true,
  name: true,
  parentId: true,
  isRoot: true,
  size: true,
  isDeleted: true,
  deletedAt: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const folderRepository: IFolderRepository = {
  createFolder(data: CreateFolderData) {
    return prisma.folder.create({
      data,
      select: PUBLIC_FOLDER_SELECT,
    });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.folder.findFirst({
      where: {
        id,
        userId,
        isDeleted: false,
      },
      select: PUBLIC_FOLDER_SELECT,
    });
  },

  findChildrenByParent(userId: string, parentId?: string | null) {
    return prisma.folder.findMany({
      where: {
        userId,
        parentId: parentId ?? null,
        isDeleted: false,
      },
      orderBy: {
        name: "asc",
      },
      select: PUBLIC_FOLDER_SELECT,
    });
  },
};
