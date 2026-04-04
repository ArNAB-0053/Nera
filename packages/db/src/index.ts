export { PrismaClient } from "./generated/prisma/index.js";
export type { User, RefreshToken, File, Folder } from "./generated/prisma/index.js";

import type { File as PrismaFile, Folder, User } from "./generated/prisma/index.js";
import type {RefreshToken} from "./generated/prisma/index.js";
import { PrismaClient } from "./generated/prisma/index.js";
import type { Prisma } from "./generated/prisma/index.js";

export type PrismaInstance = InstanceType<typeof PrismaClient>;
export const prisma: PrismaInstance = new PrismaClient();
export type { File as PrismaFile } from "./generated/prisma/index.js";

// User
export type PublicUser = Omit<User, "passwordHash">;
export type JwtPayload = Pick<User, "id" | "email" | "username">;
export type AuthResponse = {
  user: PublicUser;
  accessToken: string;
};

// Auth
export type RefreshTokenInputType = Omit<RefreshToken, "id" | 'createdAt' | 'revoked'>;

// File
export type CreateFileData = Prisma.FileUncheckedCreateInput;
export type PublicFile = PrismaFile;

// Folder
export type CreateFolderData = Prisma.FolderCreateInput;
export type PublicFolder = Folder;