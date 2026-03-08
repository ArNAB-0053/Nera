import type { FastifyInstance } from "fastify";
import { findByEmail, findByUsername, getMe } from "./user.controller.js";

export const USER_PREFIX = "/user";

export async function userRoutes(app: FastifyInstance) {
    app.get("/me", { preHandler: [app.authenticate] }, getMe);
    app.get("/:username", findByUsername);
}
