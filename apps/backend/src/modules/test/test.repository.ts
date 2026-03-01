import { prisma } from "@/prisma/prisma.js"

export const createTestRepo = async (name: string) => {
    return prisma.test.create({
        data: {name}
    })
}

export const getTestRepos = async () => {
    return prisma.test.findMany({
        orderBy: {createdAt: 'desc'}
    })
}