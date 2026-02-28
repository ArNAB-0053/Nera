import Fastify from "fastify";

const app = Fastify({
  logger: true
});

app.get("/health", async () => {
  return { status: "Nera backend running" };
});

const start = async () => {
  try {
    await app.listen({ port: 4000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();