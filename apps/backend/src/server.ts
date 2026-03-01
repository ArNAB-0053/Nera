import "@config/env.js"
import { env } from "@config/env.js";
import app from "./app.js";

const start = async () => {
  try {
    await app.listen({
      port: env.PORT,
      host: "0.0.0.0"
    });

    app.log.info(`Backend running on port ${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();