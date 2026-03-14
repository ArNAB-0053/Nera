import type { FastifyInstance } from "fastify";
import { login, refresh, register } from "./auth.controller.js";

export const AUTH_PREFIX = "/auth";

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", register)
    app.post("/login", login)
    app.post("/refresh", refresh)
}
