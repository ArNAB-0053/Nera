import type { PublicUser } from "@nera/db"
import { userRepository } from "./user.repository.js"
import { NotFoundError } from "@nera/http";

export const userService = {
    serializeUser(user: Awaited<ReturnType<typeof userRepository.findById>>): PublicUser | null {
        if (!user) {
            return null;
        }

        return {
            ...user,
            totalStorageUsed: 0,
        };
    },

    async findById(id: string): Promise<PublicUser>  {
        const user = await userRepository.findById(id)
        if (!user) throw new NotFoundError();
        const storage = await userRepository.findStorageUsageById(id);
        return {
            ...this.serializeUser(user)!,
            totalStorageUsed: Number(storage?.totalStorageUsed ?? 0n),
        }
    },

    async findByEmail(email: string): Promise<PublicUser>  {
        const user = await userRepository.findByEmail(email)
        if (!user) throw new NotFoundError();
        const storage = await userRepository.findStorageUsageById(user.id);
        return {
            ...this.serializeUser(user)!,
            totalStorageUsed: Number(storage?.totalStorageUsed ?? 0n),
        }
    },

    async findByUsername(username: string): Promise<PublicUser>  {
        const user = await userRepository.findByUsername(username)
        if (!user) throw new NotFoundError();
        const storage = await userRepository.findStorageUsageById(user.id);
        return {
            ...this.serializeUser(user)!,
            totalStorageUsed: Number(storage?.totalStorageUsed ?? 0n),
        }
    }
}
