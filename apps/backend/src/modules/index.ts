import type { FastifyInstance } from "fastify";
import { TEST_PREFIX, testRoutes } from "./test/test.route.js";
import { AUTH_PREFIX, authRoutes } from "./auth/auth.route.js";
import { USER_PREFIX, userRoutes } from "./user/user.route.js";
import { FILE_PREFIX, fileRoutes } from "./file/file.route.js";
import { FOLDER_PREFIX, folderRoutes } from "./folder/folder.route.js";

export async function registerModules(app: FastifyInstance) {
  app.register(async function (api) {
    api.register(testRoutes, { prefix: TEST_PREFIX })
    api.register(authRoutes, { prefix: AUTH_PREFIX })
    api.register(userRoutes, { prefix: USER_PREFIX })
    api.register(fileRoutes, { prefix: FILE_PREFIX })
    api.register(folderRoutes, { prefix: FOLDER_PREFIX })
  }, { prefix: "/api" })
}
