import { prisma } from "@/prisma/prisma.js";
import type { CreateUserData } from "./auth.schema.js";

export const authRepository = {
    createUser(data: CreateUserData) {
        return prisma.user.create({
            data: {
                email: data.email,
                passwordHash: data.passwordHash,
                ...(data.username !== undefined && { username: data.username }),
            }
        });
    }

    // getUser
}