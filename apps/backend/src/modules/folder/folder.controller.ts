import { MESSAGES } from "@nera/http";
import type { FastifyReply, FastifyRequest } from "fastify";
import { createFolderSchema, folderQuerySchema } from "./folder.schema.js";
import { folderService } from "./folder.service.js";

export async function getFolderView(request: FastifyRequest, reply: FastifyReply) {
    const query = folderQuerySchema.parse({
        folderId: typeof request.query === "object" && request.query && "folderId" in request.query
            ? ((request.query as Record<string, unknown>).folderId || null)
            : null,
    });

    const result = await folderService.getFolderView(request.user.id, query.folderId ?? null);
    return reply.ok(result, MESSAGES.success.FOLDER_VIEW_FETCHED);
}

export async function createFolder(request: FastifyRequest, reply: FastifyReply) {
    const body = createFolderSchema.parse(request.body);
    const result = await folderService.createFolder(request.user.id, {
        name: body.name,
        parentId: body.parentId ?? null,
    });

    return reply.created(result, MESSAGES.success.FOLDER_CREATED);
}
