import { prisma } from "@/prisma/prisma.js";
import type { CreateUserData, IAutoRepository } from "./auth.schema.js";
import type { RefreshTokenInputType } from "@nera/db";

export const authRepository: IAutoRepository = {
    createUser(data: CreateUserData) {
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                ...(data.recoveryKeyHash !== undefined && { recoveryKeyHash: data.recoveryKeyHash }),
                ...(data.username !== undefined && { username: data.username }),
            },
            select: {
                id: true,
                email: true,
                username: true,
                isVerified: true,
                twoFactorEnabled: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    },

    findAuthUserByIdentifier(identifier: string) {
        const isEmail = identifier.includes("@")

        return prisma.user.findUnique({
            where: isEmail
                ? { email: identifier }
                : { username: identifier },
            select: {
                id: true,
                email: true,
                username: true,
                passwordHash: true,
                recoveryKeyHash: true,
                twoFactorEnabled: true,
                twoFactorSecret: true,
            }
        })
    },

    findAuthUserById(userId: string) {
        return prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                username: true,
                passwordHash: true,
                recoveryKeyHash: true,
                twoFactorEnabled: true,
                twoFactorSecret: true,
            },
        });
    },

    createRefreshToken(data: RefreshTokenInputType) {
        return prisma.refreshToken.create({
            data
        })
    },

    findRefreshTokensByUser(userId: string) {
        return prisma.refreshToken.findMany({
            where: {
                userId,
                revoked: false
            }
        })
    },

    refreshToken(id: string) {
        return prisma.refreshToken.update({
            where: {id},
            data: {revoked: true}
        })
    },

    updateTwoFactor(userId: string, input: { enabled: boolean; secret: string | null }) {
        return prisma.user.update({
            where: { id: userId },
            data: {
                twoFactorEnabled: input.enabled,
                twoFactorSecret: input.secret,
            },
        }).then(() => undefined);
    },

    updatePasswordByRecoveryKey(userId: string, passwordHash: string) {
        return prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        }).then(() => undefined);
    },
}
