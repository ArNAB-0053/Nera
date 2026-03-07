import Fastify, { type FastifyError, type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import { registerModules } from "./modules/index.js";
import jwtPlugin from "./plugins/jwt.plugin.js";

const app = Fastify({
  logger: true
});

app.register(cors)
app.register(helmet)
app.register(jwtPlugin) 

app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  request.log.error(error);

  reply.code(error.statusCode || 500).send({
    success: false,
    message: error.message
  });
}); 

app.get("/health", async () => {
  return { status: "Nera backend running" };
});

app.register(registerModules)

export default app;