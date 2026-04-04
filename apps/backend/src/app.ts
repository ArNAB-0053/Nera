import Fastify, { type FastifyError, type FastifyReply, type FastifyRequest } from "fastify";
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import { registerModules } from "./modules/index.js";
import jwtPlugin from "./plugins/jwt.plugin.js";
import replyPlugin from "./plugins/reply.plugin.js";
import cookiePlugin from "./plugins/cookie.plugin.js";
import { AppError } from "@nera/http";
import { env } from "./config/env.js";
import multipart from "@fastify/multipart";

const app = Fastify({
  logger: true
});

app.register(cookiePlugin)
app.register(cors, {
  origin: env.APP_URL,
  credentials: true,
})
app.register(multipart);
app.register(helmet)
app.register(jwtPlugin) 
app.register(replyPlugin);

app.setErrorHandler((error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message
    });
  }

  request.log.error(error);

  return reply.status(500).send({
    success: false,
    message: "Internal Server Error"
  });
}); 

app.get("/health", async () => {
  return { status: "Nera backend running" };
});

app.register(registerModules)

export default app;