import "fastify";

declare module "fastify" {
  interface FastifyInstance {
    authenticate: any;
  }
}

declare module "fastify" {
  interface FastifyReply {
    ok(data?: unknown, message?: string): void;
    created(data?: unknown, message?: string): void;
  }
}

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { id: string; email: string; username: string | null };
    user: { id: string; email: string; username: string | null };
  }
}