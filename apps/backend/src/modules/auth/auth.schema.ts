import type { DbPublicUser, RefreshToken, RefreshTokenInputType, User } from "@nera/db";

export interface CreateUserData {
  email: string;
  passwordHash: string;
  username?: string | undefined;
};

export type AuthUser = {
    id: string;
    email: string;
    username: string | null;
    passwordHash: string;
}

export interface IAutoRepository {
    createUser(data: CreateUserData): Promise<DbPublicUser>;
    findAuthUserByIdentifier(identifier: string): Promise<AuthUser | null>;
    createRefreshToken(data: RefreshTokenInputType): Promise<RefreshToken>;
    findRefreshTokensByUser(userId: string): Promise<RefreshToken[]>;
    refreshToken(id: string): Promise<RefreshToken>;
}
