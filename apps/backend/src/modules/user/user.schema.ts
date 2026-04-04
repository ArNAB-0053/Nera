import { z } from "zod";
import { EmailSchema, UsernameSchema } from "@nera/schemas";
import type { PublicUser } from "@nera/db";

export const EmailParamsSchema = z.object({
  email: EmailSchema,
});

export const UsernameParamsSchema = z.object({
  username: UsernameSchema,
});

export interface IUserRepository {
    findById(id: string): Promise<PublicUser | null>;
    findByEmail(email: string): Promise<PublicUser | null>;
    findByUsername(username: string): Promise<PublicUser | null>;
    findByIdentifier(identifier: string): Promise<PublicUser | null>;
}