import fp from "fastify-plugin";
import type { FastifyInstance } from "fastify";
import { HTTP_STATUS } from "@nera/http";
import { success } from "@nera/http";

export default fp(async (app: FastifyInstance) => {
  app.decorateReply("created", function (data?: unknown) {
    return this.code(HTTP_STATUS.CREATED.code).send(success(data));
  });

  app.decorateReply("ok", function (data?: unknown) {
    return this.code(HTTP_STATUS.OK.code).send(success(data));
  });
});