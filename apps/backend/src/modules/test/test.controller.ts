import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateTestBody } from "./test.schema.js";
import { createTestService, getTestsService } from "./test.service.js";

export const createTest = async(
    req: FastifyRequest<{Body: CreateTestBody}>,
    reply: FastifyReply
) => {
    const {name} = req.body;
    const res = await createTestService(name);
    return reply.code(201).send(res);
}

export const getTests = async(
    _req: FastifyRequest,
    reply: FastifyReply
) => {
    const res = await getTestsService();
    return reply.code(200).send(res);
}