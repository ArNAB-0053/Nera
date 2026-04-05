import type { FastifyInstance } from "fastify";
import { createFolder, getFolderView } from "./folder.controller.js";

export const FOLDER_PREFIX = "/folder";

export async function folderRoutes(app: FastifyInstance) {
    app.get("/", { preHandler: [app.authenticate], }, getFolderView);
    app.post("/", { preHandler: [app.authenticate], }, createFolder);
}
