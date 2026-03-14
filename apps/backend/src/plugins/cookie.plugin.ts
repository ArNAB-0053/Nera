import fastifyCookie from "@fastify/cookie"
import fp from "fastify-plugin"

export default fp(async function (fastify) {
  await fastify.register(fastifyCookie)
})