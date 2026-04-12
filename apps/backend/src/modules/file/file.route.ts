import type { FastifyInstance } from "fastify";
import { uploadFile, downloadFile, listFiles, deleteFile } from "./file.controller.js";

export const FILE_PREFIX = "/file";

export async function fileRoutes(app: FastifyInstance) {
    app.get("/", { preHandler: [app.authenticate], }, listFiles);
    app.post("/upload", { preHandler: [app.authenticate], }, uploadFile);
    app.get("/:id", { preHandler: [app.authenticate], }, downloadFile);
    app.delete("/:id", { preHandler: [app.authenticate], }, deleteFile);
}
