import type { FastifyInstance } from "fastify";
import { register } from "./auth.controller.js";

export const AUTH_PREFIX = "/auth";

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", register)
}
