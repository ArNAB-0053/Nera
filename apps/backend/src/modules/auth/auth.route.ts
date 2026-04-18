import type { FastifyInstance } from "fastify";
import {
    disableTwoFactor,
    enableTwoFactor,
    login,
    logout,
    refresh,
    register,
    resetPasswordWithRecoveryKey,
    setupTwoFactor,
} from "./auth.controller.js";

export const AUTH_PREFIX = "/auth";

export async function authRoutes(app: FastifyInstance) {
    app.post("/register", register)
    app.post("/login", login)
    app.post("/refresh", refresh)
    app.post("/logout", logout)
    app.post("/2fa/setup", { preHandler: [app.authenticate] }, setupTwoFactor)
    app.post("/2fa/enable", { preHandler: [app.authenticate] }, enableTwoFactor)
    app.post("/2fa/disable", { preHandler: [app.authenticate] }, disableTwoFactor)
    app.post("/recovery/reset-password", resetPasswordWithRecoveryKey)
}
