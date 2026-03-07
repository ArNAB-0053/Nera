import { env } from "@/config/env.js";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin"
import {UnauthorizedError} from "@nera/http"

export default fp(async function (fastify) {
    fastify.register(fastifyJwt, {
        secret: env.JWT_SECRET
    })

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify()
        } catch {
            throw new UnauthorizedError()
        }
    })
});