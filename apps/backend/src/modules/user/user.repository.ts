import { prisma } from "@/prisma/prisma.js"
import type { IUserRepository } from "./user.schema.js";

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  username: true,
  isVerified: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const userRepository : IUserRepository = {
    findById(id: string) {
        return prisma.user.findUnique({
            where: {id},
            select: PUBLIC_USER_SELECT,
        })
    },

    findByEmail(email: string) {
        return prisma.user.findUnique({
            where: {email},
            select: PUBLIC_USER_SELECT,
        })
    },

    findByUsername(username: string) {
        return prisma.user.findUnique({
            where: { username },
            select: PUBLIC_USER_SELECT,
        })
    }, 

    findByIdentifier(identifier: string) {
        const isEmail = identifier.includes("@")

        return prisma.user.findUnique({
            where: isEmail ? {email: identifier} : {username: identifier},
            select: PUBLIC_USER_SELECT,
        })
    }
}