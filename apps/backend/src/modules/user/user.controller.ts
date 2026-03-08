import type { FastifyReply, FastifyRequest } from "fastify";
import { EmailParamsSchema, UsernameParamsSchema } from "./user.schema.js";
import { userService } from "./user.service.js";

export async function findByEmail(request:FastifyRequest, reply: FastifyReply) {
    const {email} = EmailParamsSchema.parse(request.params)
    const user = await userService.findByEmail(email);
    reply.ok(user)
}

export async function findByUsername(request:FastifyRequest, reply: FastifyReply) {
    const {username} = UsernameParamsSchema.parse(request.params)
    const user = await userService.findByUsername(username);
    reply.ok(user)
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  const user = await userService.findById(request.user.id);
  reply.ok(user);
}