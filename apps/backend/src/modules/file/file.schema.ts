import type { CreateFileData, PrismaFile } from "@nera/db";
import z from "zod";

export const uploadSchema = z.object({
    folderId: z.uuid().nullable().optional()
})

export const listFilesQuerySchema = z.object({
    folderId: z.uuid().nullable().optional(),
    search: z.string().optional(),
    type: z.string().optional(),
    sortBy: z.enum(["name", "createdAt", "updatedAt", "size"]).optional().default("updatedAt"),
    order: z.enum(["asc", "desc"]).optional().default("desc"),
});

export type UploadSchemaType = z.infer<typeof uploadSchema>;
export type ListFilesQueryType = z.infer<typeof listFilesQuerySchema>;

export interface IFileInput {
    name: string;
    size: number;
    type: string;
    arrayBuffer(): Promise<Buffer | ArrayBuffer>;  // accept both
}

export interface IUploadType {
    userId: string,
    folderId?: UploadSchemaType['folderId']
    file: IFileInput
}

export interface IFileRepository {
    createFile(data: CreateFileData): Promise<PrismaFile>;
    createFileWithStorageUpdate(input: {
        userId: string;
        fileSize: bigint;
        data: CreateFileData;
    }): Promise<PrismaFile>;
    softDeleteFileWithStorageUpdate(input: {
        userId: string;
        fileId: string;
        fileSize: bigint;
    }): Promise<void>;
    findFileById(id: string, userId: string): Promise<PrismaFile | null>;
    findFilesByFolder(input: {
        userId: string;
        folderId?: string | null;
        search?: string;
        type?: string;
        sortBy: ListFilesQueryType["sortBy"];
        order: ListFilesQueryType["order"];
    }): Promise<PrismaFile[]>;
}
