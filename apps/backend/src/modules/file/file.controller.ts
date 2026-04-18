import { BadRequestError, MESSAGES } from "@nera/http";
import type { FastifyReply, FastifyRequest } from "fastify";
import { listFilesQuerySchema, uploadSchema } from "./file.schema.js";
import { fileServices } from "./file.service.js";

function parseMultipartFieldValue(
    field: FastifyRequest["body"] | Record<string, unknown> | undefined,
    key: string
) {
    const value = (field as Record<string, { value?: unknown } | undefined> | undefined)?.[key];

    if (!value || typeof value !== "object" || !("value" in value)) {
        return undefined;
    }

    return (value as { value?: unknown }).value;
}

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.user.id
        const data = await request.file()

        if (!data) throw new BadRequestError(MESSAGES.error.FILE_NEEDED)

        const { file, filename } = data;

        const chunks: Buffer[] = [];
        for await (const chunk of file) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        const MAX_SIZE = 10 * 1024 * 1024;

        if (buffer.length > MAX_SIZE) {
            throw new BadRequestError(MESSAGES.error.FILE_LARGE);
        }

        const rawFolderId = parseMultipartFieldValue(data.fields, "folderId");
        const rawIv = parseMultipartFieldValue(data.fields, "iv");
        const rawAuthTag = parseMultipartFieldValue(data.fields, "authTag");
        const rawSalt = parseMultipartFieldValue(data.fields, "salt");
        const rawMimeType = parseMultipartFieldValue(data.fields, "mimeType");

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "application/pdf",
        ];

        if (typeof rawMimeType !== "string" || !allowedTypes.includes(rawMimeType)) {
            throw new BadRequestError(MESSAGES.error.INVALID_FILE_TYPE);
        }

        const parsed = uploadSchema.parse({
            folderId: typeof rawFolderId === "string" && rawFolderId.trim().length > 0
                ? rawFolderId.trim()
                : null,
            iv: rawIv,
            authTag: rawAuthTag,
            salt: rawSalt,
            mimeType: rawMimeType,
        });

        const result = await fileServices.uploadFile({
            userId,
            folderId: parsed.folderId,
            iv: parsed.iv,
            authTag: parsed.authTag,
            salt: parsed.salt,
            mimeType: parsed.mimeType,
            file: {
                arrayBuffer: async () => buffer,
                name: filename,
                size: buffer.length,
                type: "application/octet-stream",
            },
        });

        return reply.ok(result, MESSAGES.success.FILE_UPLOADED);
    } catch (err: any) {
        return reply.status(400).send({
            success: false,
            message: err.message || "Upload failed",
        });
    }
}

export async function listFiles(request: FastifyRequest, reply: FastifyReply) {
    const query = listFilesQuerySchema.parse({
        folderId: typeof request.query === "object" && request.query && "folderId" in request.query
            ? ((request.query as Record<string, unknown>).folderId || null)
            : null,
        sortBy: typeof request.query === "object" && request.query && "sortBy" in request.query
            ? (request.query as Record<string, unknown>).sortBy
            : undefined,
        order: typeof request.query === "object" && request.query && "order" in request.query
            ? (request.query as Record<string, unknown>).order
            : undefined,
        search: typeof request.query === "object" && request.query && "search" in request.query
            ? (request.query as Record<string, unknown>).search
            : undefined,
        type: typeof request.query === "object" && request.query && "type" in request.query
            ? (request.query as Record<string, unknown>).type
            : undefined,
    });

    const files = await fileServices.listFiles(request.user.id, query);
    return reply.ok(files, MESSAGES.success.FILE_LIST_FETCHED);
}

export async function downloadFile(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const result = await fileServices.downloadFile(request.user.id, id);
    return reply.ok(result, MESSAGES.success.FILE_FETCHED);
}

export async function deleteFile(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const result = await fileServices.deleteFile(request.user.id, id);
    return reply.ok(result, MESSAGES.success.FILE_DELETED);
}
