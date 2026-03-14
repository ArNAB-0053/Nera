export type { User, RefreshToken, File, Folder } from "./generated/prisma/index.js";

import type { User } from "./generated/prisma/index.js";
import type {RefreshToken} from "./generated/prisma/index.js";

export type PublicUser = Omit<User, "passwordHash">;
export type JwtPayload = Pick<User, "id" | "email" | "username">;
export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
};
export type RefreshTokenInputType = Omit<RefreshToken, "id" | 'createdAt' | 'revoked'>;