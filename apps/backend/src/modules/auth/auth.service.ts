import { userRepository } from "../user/user.repository.js";
import { BadRequestError, MESSAGES, UnauthorizedError } from "@nera/http";
import { hashValue, verifyHash } from "@/helpers/crypto.js";
import { authRepository } from "./auth.repository.js";
import type { CreateUserData } from "./auth.schema.js";
import type { JwtPayload, PublicUser, SessionMeta } from "@nera/db";
import crypto from "crypto"
import speakeasy from "speakeasy";
import { env } from "@/config/env.js";

export const authService = {
    async register(input: CreateUserData, meta: SessionMeta) {
        const exists = await userRepository.findByEmail(input.email)

        if(exists) throw new BadRequestError(MESSAGES.error.EMAIL_EXISTS)

        const passwordHash = await hashValue(input.passwordHash)
        const user: PublicUser = await authRepository.createUser({
            email: input.email,
            username: input?.username,
            passwordHash,
            recoveryKeyHash: input.recoveryKeyHash,
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

    async login(identifier: string, password: string, otp: string | undefined, meta: SessionMeta) {
        const user = await authRepository.findAuthUserByIdentifier(identifier)

        if(!user) throw new BadRequestError(MESSAGES.error.EMAIL_NOT_EXISTS);

        const isValid = await verifyHash(password, user.passwordHash)

        if(!isValid) throw new BadRequestError(MESSAGES.error.PASSWORD_NOT_MATCH);

        if (user.twoFactorEnabled) {
            if (!otp) {
                throw new UnauthorizedError(MESSAGES.error.TWO_FACTOR_REQUIRED);
            }

            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret ?? "",
                encoding: "base32",
                token: otp,
                window: 1,
            });

            if (!verified) {
                throw new UnauthorizedError(MESSAGES.error.INVALID_TWO_FACTOR_CODE);
            }
        }

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
    },

    async createTwoFactorSetup(userId: string, password: string) {
        const user = await authRepository.findAuthUserById(userId);

        if (!user) {
            throw new UnauthorizedError(MESSAGES.error.USER_NOT_FOUND);
        }

        const isValid = await verifyHash(password, user.passwordHash);

        if (!isValid) {
            throw new BadRequestError(MESSAGES.error.PASSWORD_NOT_MATCH);
        }

        const secret = speakeasy.generateSecret({
            issuer: env.TOTP_ISSUER,
            name: user.email,
            length: 32,
        });

        return {
            secret: secret.base32,
            otpauthUrl: secret.otpauth_url ?? "",
        };
    },

    async enableTwoFactor(userId: string, secret: string, token: string) {
        const user = await authRepository.findAuthUserById(userId);

        if (!user) {
            throw new UnauthorizedError(MESSAGES.error.USER_NOT_FOUND);
        }

        const verified = speakeasy.totp.verify({
            secret,
            encoding: "base32",
            token,
            window: 1,
        });

        if (!verified) {
            throw new BadRequestError(MESSAGES.error.INVALID_TWO_FACTOR_CODE);
        }

        await authRepository.updateTwoFactor(userId, {
            enabled: true,
            secret,
        });
    },

    async disableTwoFactor(userId: string, password: string, token: string) {
        const user = await authRepository.findAuthUserById(userId);

        if (!user) {
            throw new UnauthorizedError(MESSAGES.error.USER_NOT_FOUND);
        }

        const isValid = await verifyHash(password, user.passwordHash);

        if (!isValid) {
            throw new BadRequestError(MESSAGES.error.PASSWORD_NOT_MATCH);
        }

        const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret ?? "",
            encoding: "base32",
            token,
            window: 1,
        });

        if (!verified) {
            throw new BadRequestError(MESSAGES.error.INVALID_TWO_FACTOR_CODE);
        }

        await authRepository.updateTwoFactor(userId, {
            enabled: false,
            secret: null,
        });
    },

    async resetPasswordWithRecoveryKey(identifier: string, recoveryKey: string, newPassword: string) {
        const user = await authRepository.findAuthUserByIdentifier(identifier);

        if (!user || !user.recoveryKeyHash) {
            throw new UnauthorizedError(MESSAGES.error.RECOVERY_KEY_INVALID);
        }

        const validRecoveryKey = await verifyHash(recoveryKey, user.recoveryKeyHash);

        if (!validRecoveryKey) {
            throw new UnauthorizedError(MESSAGES.error.RECOVERY_KEY_INVALID);
        }

        const passwordHash = await hashValue(newPassword);
        await authRepository.updatePasswordByRecoveryKey(user.id, passwordHash);
    }
}
