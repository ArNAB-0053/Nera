import { BadRequestError, MESSAGES } from "@nera/http";
import type { FastifyReply, FastifyRequest } from "fastify";
import { uploadSchema } from "./file.schema.js";
import { fileServices } from "./file.service.js";

export async function uploadFile(request: FastifyRequest, reply: FastifyReply) {
    try {
        const userId = request.user.id
        const data = await request.file()

        if (!data) throw new BadRequestError(MESSAGES.error.FILE_NEEDED)

        const { file, filename, mimetype } = data;

        const chunks: Buffer[] = [];
        for await (const chunk of file) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        const { folderId } = uploadSchema.parse(data.fields);

        const MAX_SIZE = 10 * 1024 * 1024;

        if (buffer.length > MAX_SIZE) {
            throw new BadRequestError(MESSAGES.error.FILE_LARGE);
        }

        const allowedTypes = [
            "image/png",
            "image/jpeg",
            "application/pdf",
        ];

        if (!allowedTypes.includes(mimetype)) {
            throw new BadRequestError(MESSAGES.error.INVALID_FILE_TYPE);
        }

        const result = await fileServices.uploadFile({
            userId,
            folderId,
            file: {
                arrayBuffer: async () => buffer,
                name: filename,
                size: buffer.length,
                type: mimetype,
            },
        });

        return reply.send(result);
    } catch (err: any) {
        return reply.status(400).send({
            error: err.message || "Upload failed",
        });
    }
}

export async function downloadFile(request: FastifyRequest, reply: FastifyReply) {
    const { id } = request.params as { id: string };

    const result = await fileServices.downloadFile(id);

    reply
        .header("Content-Type", result.mimeType || "application/octet-stream")
        .header(
            "Content-Disposition",
            `attachment; filename="${result.name}"`
        )
        .send(result.buffer);
}