import { env } from "@/config/env.js";
import { COOKIE_TITLE } from "@/helpers/base.helper.js";
import fastifyJwt from "@fastify/jwt";
import type { FastifyReply, FastifyRequest } from "fastify";
import fp from "fastify-plugin"
import {UnauthorizedError} from "@nera/http"
import { userRepository } from "@/modules/user/user.repository.js";

export default fp(async function (fastify) {
    fastify.register(fastifyJwt, {
        secret: env.JWT_SECRET,
        cookie: {
            cookieName: COOKIE_TITLE.ACCESS_TOKEN,
            signed: false,
        }
    })

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify()
            const user = await userRepository.findById(request.user.id);

            if (!user) {
                throw new UnauthorizedError();
            }
        } catch {
            throw new UnauthorizedError()
        }
    })
});
