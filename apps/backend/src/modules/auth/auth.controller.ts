import { LoginSchema, RegisterSchema } from "@nera/schemas";
import type { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service.js";
import { ACCESS_COOKIE_OPTIONS, clearAuthCookie, jwtSign, setAuthCookie, setCookies } from "@/helpers/auth-cookie.js";
import { hashValue } from "@/helpers/crypto.js";
import { authRepository } from "./auth.repository.js";
import { COOKIE_TITLE } from "@/helpers/base.helper.js";
import { MESSAGES, UnauthorizedError } from "@nera/http";

export async function register(request:FastifyRequest, reply: FastifyReply) {
    const data = RegisterSchema.parse(request.body);
    const res = await authService.register({
        ...data,
        passwordHash: data?.password
    });
    return reply.created(res, MESSAGES.success.USER_REGISTERED)
}

export async function login(request:FastifyRequest, reply: FastifyReply) {
    const data = LoginSchema.parse(request.body);
    const {user, refreshToken} = await authService.login(data.identifier, data.password);

    const accessToken = await reply.jwtSign({
        id: user.id,
        email: user.email,
        username: user?.username as string
    })

    const refreshHash = await hashValue(refreshToken)

    // creating refreshToken
    await authRepository.createRefreshToken({
        userId: user.id,
        tokenHash: refreshHash,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"] as string,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
    })

    setAuthCookie(reply, accessToken, refreshToken);
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
