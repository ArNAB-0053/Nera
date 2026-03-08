import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

declare module "fastify" {
  interface FastifyReply {
    ok(data?: unknown): void;
    created(data?: unknown): void;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string; username?: string };
    user: { id: string; email: string; username?: string };
  }
}