import type { CreateFileData, PrismaFile } from "@nera/db";
import z from "zod";

export const uploadSchema = z.object({
    folderId: z.uuid()
})

export type UploadSchemaType = z.infer<typeof uploadSchema>;

export interface IFileInput {
    name: string;
    size: number;
    type: string;
    arrayBuffer(): Promise<Buffer | ArrayBuffer>;  // accept both
}

export interface IUploadType {
    userId: string,
    folderId: UploadSchemaType['folderId']
    file: IFileInput
}

export interface IFileRepository {
    createFile(data: CreateFileData): Promise<PrismaFile>;
    findFileById(id: string): Promise<PrismaFile | null>;
}