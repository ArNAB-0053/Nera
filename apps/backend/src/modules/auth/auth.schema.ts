import z from "zod";
import type { DbPublicUser, RefreshToken, RefreshTokenInputType } from "@nera/db";

export interface CreateUserData {
  email: string;
  passwordHash: string;
  username?: string | undefined;
  recoveryKeyHash?: string | undefined;
};

export type AuthUser = {
    id: string;
    email: string;
    username: string | null;
    passwordHash: string;
    recoveryKeyHash: string | null;
    twoFactorEnabled: boolean;
    twoFactorSecret: string | null;
}

export const twoFactorSetupSchema = z.object({
  password: z.string().min(1, "Password is required"),
});

export const twoFactorEnableSchema = z.object({
  token: z.string().trim().length(6, "OTP must be 6 digits"),
  secret: z.string().min(1, "Two-factor secret is required"),
});

export const twoFactorDisableSchema = z.object({
  password: z.string().min(1, "Password is required"),
  token: z.string().trim().length(6, "OTP must be 6 digits"),
});

export const passwordResetSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  recoveryKey: z.string().min(1, "Recovery key is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});

export interface IAutoRepository {
    createUser(data: CreateUserData): Promise<DbPublicUser>;
    findAuthUserByIdentifier(identifier: string): Promise<AuthUser | null>;
    createRefreshToken(data: RefreshTokenInputType): Promise<RefreshToken>;
    findRefreshTokensByUser(userId: string): Promise<RefreshToken[]>;
    refreshToken(id: string): Promise<RefreshToken>;
    findAuthUserById(userId: string): Promise<AuthUser | null>;
    updateTwoFactor(userId: string, input: { enabled: boolean; secret: string | null }): Promise<void>;
    updatePasswordByRecoveryKey(userId: string, passwordHash: string): Promise<void>;
}
