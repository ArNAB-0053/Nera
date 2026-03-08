import { z } from "zod";
import { EmailSchema, UsernameSchema } from "@nera/schemas";

export const EmailParamsSchema = z.object({
  email: EmailSchema,
});

export const UsernameParamsSchema = z.object({
  username: UsernameSchema,
});