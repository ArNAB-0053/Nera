import Fastify from "fastify";
import cors from "@fastify/cors"
import helmet from "@fastify/helmet"
import jwt from "@fastify/jwt"
import { registerModules } from "./modules/index.js";

const app = Fastify({
  logger: true
});

app.register(cors)
app.register(helmet)

app.get("/health", async () => {
  return { status: "Nera backend running" };
});

app.register(registerModules)

export default app;