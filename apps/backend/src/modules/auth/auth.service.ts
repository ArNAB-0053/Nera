import { userRepository } from "../user/user.repository.js";
import { BadRequestError, MESSAGES, UnauthorizedError } from "@nera/http";
import { hashValue, verifyHash } from "@/helpers/crypto.js";
import { authRepository } from "./auth.repository.js";
import type { CreateUserData } from "./auth.schema.js";
import type { JwtPayload, PublicUser, SessionMeta } from "@nera/db";
import crypto from "crypto"

export const authService = {
    async register(input: CreateUserData, meta: SessionMeta) {
        const exists = await userRepository.findByEmail(input.email)

        if(exists) throw new BadRequestError(MESSAGES.error.EMAIL_EXISTS)

        const passwordHash = await hashValue(input.passwordHash)
        const user: PublicUser = await authRepository.createUser({
            email: input.email,
            username: input?.username,
            passwordHash,
        }).then((createdUser) => ({
            ...createdUser,
            totalStorageUsed: 0,
        }))

        return this.createSession(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            meta
        )
    },

    async login(identifier: string, password: string, meta: SessionMeta) {
        const user = await authRepository.findAuthUserByIdentifier(identifier)

        if(!user) throw new BadRequestError(MESSAGES.error.EMAIL_NOT_EXISTS);

        const isValid = await verifyHash(password, user.passwordHash)

        if(!isValid) throw new BadRequestError(MESSAGES.error.PASSWORD_NOT_MATCH);
        return this.createSession(
            {
                id: user.id,
                email: user.email,
                username: user.username
            },
            meta
        )

    },

    async refresh(refreshToken: string, userId: string) {
        const sessions = await authRepository.findRefreshTokensByUser(userId);

        for (const session of sessions) {
            const isValid = await verifyHash(refreshToken, session.tokenHash)

            if(!isValid) continue;

            if (session.revoked || session.expiresAt < new Date()) {
                throw new UnauthorizedError()
            }

            return {
                userId
            }
        }

        throw new UnauthorizedError()
    },

    async createSession(user: JwtPayload, meta:SessionMeta) {
        const refreshToken = crypto.randomBytes(64).toString("hex")

        const tokenHash = await hashValue(refreshToken)

        await authRepository.createRefreshToken({
            userId: user.id,
            tokenHash,
            ipAddress: meta.ip ?? null,
            userAgent: meta.userAgent ?? null,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30)
        })

        return { user, refreshToken }
    }
}
