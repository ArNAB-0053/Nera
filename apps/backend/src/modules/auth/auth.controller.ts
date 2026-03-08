import { RegisterSchema } from "@nera/schemas";
import type { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "./auth.service.js";

export async function register(request:FastifyRequest, reply: FastifyReply) {
    const data = RegisterSchema.parse(request.body);
    const res = await authService.register({
        ...data,
        passwordHash: data?.password
    });
    return reply.created(res)
}