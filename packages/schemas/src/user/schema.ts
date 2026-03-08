import { z } from "zod";

export const EmailSchema = z.email({
  message: "Invalid email address"
});

export const UsernameSchema = z
  .string()
  .min(3)
  .max(30)
  .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers and _");

export const PasswordSchema = z.string().superRefine((password, ctx) => {
  if (password.length < 6) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must be at least 6 characters"
    });
  }

  if (!/[a-z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain a lowercase letter"
    });
  }

  if (!/[A-Z]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain an uppercase letter"
    });
  }

  if (!/[0-9]/.test(password)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Password must contain a number"
    });
  }
});