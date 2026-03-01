import type { FastifyInstance } from "fastify";
import { TEST_PREFIX, testRoutes } from "./test/test.route.js";

export async function registerModules(app:FastifyInstance) {
    app.register(testRoutes, {prefix: TEST_PREFIX})
}