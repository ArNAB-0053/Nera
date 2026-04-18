import { z } from "zod";
import { EmailSchema, UsernameSchema } from "@nera/schemas";
import type { DbPublicUser } from "@nera/db";

export const EmailParamsSchema = z.object({
  email: EmailSchema,
});

export const UsernameParamsSchema = z.object({
  username: UsernameSchema,
});

export interface IUserRepository {
    findById(id: string): Promise<DbPublicUser | null>;
    findByEmail(email: string): Promise<DbPublicUser | null>;
    findByUsername(username: string): Promise<DbPublicUser | null>;
    findByIdentifier(identifier: string): Promise<DbPublicUser | null>;
    findStorageUsageById(id: string): Promise<{ totalStorageUsed: bigint } | null>;
}
