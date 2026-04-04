import type { FastifyInstance } from "fastify";
import { uploadFile, downloadFile } from "./file.controller.js";

export const FILE_PREFIX = "/file";

export async function fileRoutes(app: FastifyInstance) {
    app.post("/upload", { preHandler: [app.authenticate], }, uploadFile);
    app.get("/:id", { preHandler: [app.authenticate], }, downloadFile);
}