import {z} from "zod"
import { EmailSchema, PasswordSchema, UsernameSchema } from "../user/schema.js";

export const RegisterSchema = z.object({
  email: EmailSchema,
  username: UsernameSchema.optional(),
  password: PasswordSchema,
  recoveryKey: z.string().min(16, "Recovery key is required"),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
