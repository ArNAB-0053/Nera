import type { CreateFolderData, PrismaFolder } from "@nera/db";
import z from "zod";

export const folderQuerySchema = z.object({
    folderId: z.uuid().nullable().optional(),
});

export const createFolderSchema = z.object({
    name: z.string().trim().min(1).max(120),
    parentId: z.uuid().nullable().optional(),
});

export type FolderQueryType = z.infer<typeof folderQuerySchema>;
export type CreateFolderBody = z.infer<typeof createFolderSchema>;

export type FolderBreadcrumb = {
    id: string | null;
    name: string;
};

export interface IFolderRepository {
    createFolder(data: CreateFolderData): Promise<PrismaFolder>;
    findByIdForUser(id: string, userId: string): Promise<PrismaFolder | null>;
    findChildrenByParent(userId: string, parentId?: string | null): Promise<PrismaFolder[]>;
}
