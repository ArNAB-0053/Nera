import { LoginSchema, RegisterSchema } from "@nera/schemas";
import type { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service.js";
import { ACCESS_COOKIE_OPTIONS, clearAuthCookie, jwtSign, setAuthCookie, setCookies } from "@/helpers/auth-cookie.js";
import { COOKIE_TITLE } from "@/helpers/base.helper.js";
import { MESSAGES, UnauthorizedError } from "@nera/http";
import {
    passwordResetSchema,
    twoFactorDisableSchema,
    twoFactorEnableSchema,
    twoFactorSetupSchema,
} from "./auth.schema.js";
import { hashValue } from "@/helpers/crypto.js";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const data = RegisterSchema.parse(request.body)

    const { user, refreshToken } = await authService.register(
        {
            ...data,
            passwordHash: data.password,
            recoveryKeyHash: await hashValue(data.recoveryKey),
        },
        {
            ip: request.ip,
            userAgent: request.headers["user-agent"] as string
        }
    )

    const accessToken = await reply.jwtSign(user)
    setAuthCookie(reply, accessToken, refreshToken)

    return reply.created(user, MESSAGES.success.USER_REGISTERED)
}

export async function login(request: FastifyRequest, reply: FastifyReply) {
    const data = LoginSchema.parse(request.body)

    const { user, refreshToken } = await authService.login(
        data.identifier,
        data.password,
        data.otp,
        {
            ip: request.ip,
            userAgent: request.headers["user-agent"] as string
        }
    )

    const accessToken = await reply.jwtSign(user)
    setAuthCookie(reply, accessToken, refreshToken)

    return reply.ok(user, MESSAGES.success.LOGIN_SUCCESS)
}

// acees token generator
export async function refresh(request:FastifyRequest, reply: FastifyReply) {
    const refreshToken = request.cookies[COOKIE_TITLE.REFRESH_TOKEN]

    if(!refreshToken) throw new UnauthorizedError()

    const payload = request.user as {id: string}
    const session = await authService.refresh(refreshToken, payload.id)

    const access_token = await jwtSign(reply, {id: session.userId})
    setCookies(
        reply,
        COOKIE_TITLE.ACCESS_TOKEN, 
        ACCESS_COOKIE_OPTIONS, 
        access_token
    )

    reply.ok({message: "Access Token Updated"})
    
}

export async function logout(_request: FastifyRequest, reply: FastifyReply) {
    clearAuthCookie(reply)
    return reply.ok({ message: "Logged out" }, "Logged out successfully")
}

export async function setupTwoFactor(request: FastifyRequest, reply: FastifyReply) {
    const data = twoFactorSetupSchema.parse(request.body);
    const result = await authService.createTwoFactorSetup(request.user.id, data.password);
    return reply.ok(result, MESSAGES.success.TWO_FACTOR_SETUP_READY);
}

export async function enableTwoFactor(request: FastifyRequest, reply: FastifyReply) {
    const data = twoFactorEnableSchema.parse(request.body);
    await authService.enableTwoFactor(request.user.id, data.secret, data.token);
    return reply.ok({ enabled: true }, MESSAGES.success.TWO_FACTOR_ENABLED);
}

export async function disableTwoFactor(request: FastifyRequest, reply: FastifyReply) {
    const data = twoFactorDisableSchema.parse(request.body);
    await authService.disableTwoFactor(request.user.id, data.password, data.token);
    return reply.ok({ enabled: false }, MESSAGES.success.TWO_FACTOR_DISABLED);
}

export async function resetPasswordWithRecoveryKey(request: FastifyRequest, reply: FastifyReply) {
    const data = passwordResetSchema.parse(request.body);
    await authService.resetPasswordWithRecoveryKey(data.identifier, data.recoveryKey, data.newPassword);
    return reply.ok({ reset: true }, MESSAGES.success.PASSWORD_RESET);
}
