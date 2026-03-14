import { env } from "@/config/env.js"
import type { SerializeOptions } from "@fastify/cookie"

export const COOKIE_TITLE = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token"
}

export const getAuthOptions = (sameSite: SerializeOptions['sameSite'] = 'lax'): SerializeOptions => {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: sameSite,
    path: "/"
  }
}