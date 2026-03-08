import type { FastifyInstance } from "fastify";
import { TEST_PREFIX, testRoutes } from "./test/test.route.js";
import { AUTH_PREFIX, authRoutes } from "./auth/auth.route.js";
import { USER_PREFIX, userRoutes } from "./user/user.route.js";

export async function registerModules(app: FastifyInstance) {
  app.register(async function (api) {
    api.register(testRoutes, { prefix: TEST_PREFIX })
    api.register(authRoutes, { prefix: AUTH_PREFIX })
    api.register(userRoutes, { prefix: USER_PREFIX })
  }, { prefix: "/api" })
}