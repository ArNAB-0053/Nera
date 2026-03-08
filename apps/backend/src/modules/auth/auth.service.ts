import { userRepository } from "../user/user.repository.js";
import { BadRequestError } from "@nera/http";
import { hashPassword } from "@/helpers/crypto.js";
import { authRepository } from "./auth.repository.js";
import type { CreateUserData } from "./auth.schema.js";
import type { PublicUser } from "@nera/db";

export const authService = {
    async register(input: CreateUserData) {
        const exists = await userRepository.findByEmail(input.email)

        if(exists) throw new BadRequestError()

        const passwordHash = await hashPassword(input.passwordHash)
        const user: PublicUser = await authRepository.createUser({
            email: input.email,
            username: input?.username,
            passwordHash,
        })

        return user;
    }
}