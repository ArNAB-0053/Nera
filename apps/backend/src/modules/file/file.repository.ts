import { prisma } from "@/prisma/prisma.js";
import type { IFileRepository } from "./file.schema.js";
import type { CreateFileData } from "@nera/db";

export const fileRepository: IFileRepository = {
  createFile(data: CreateFileData) {
    return prisma.file.create({ data });
  },

  findFileById(id: string) {
    return prisma.file.findUnique({ where: { id } });
  }
}