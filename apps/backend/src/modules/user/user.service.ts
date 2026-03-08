import type { PublicUser } from "@nera/db"
import { userRepository } from "./user.repository.js"
import { NotFoundError } from "@nera/http";

export const userService = {
    async findById(id: string): Promise<PublicUser>  {
        const user = await userRepository.findById(id)
        if (!user) throw new NotFoundError();
        return user
    },

    async findByEmail(email: string): Promise<PublicUser>  {
        const user = await userRepository.findByEmail(email)
        if (!user) throw new NotFoundError();
        return user
    },

    async findByUsername(username: string): Promise<PublicUser>  {
        const user = await userRepository.findByUsername(username)
        if (!user) throw new NotFoundError();
        return user
    }
}