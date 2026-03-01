import type { FastifyInstance } from "fastify"
import { createTest, getTests } from "./test.controller.js";

export const TEST_PREFIX = "/test";

export async function testRoutes(app: FastifyInstance) {
    app.get("/", getTests)
    app.post("/", createTest);
}

