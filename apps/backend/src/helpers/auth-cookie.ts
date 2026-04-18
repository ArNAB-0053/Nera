import type { SerializeOptions } from "@fastify/cookie";
import type { FastifyReply } from "fastify/types/reply.js"
import { COOKIE_TITLE, getAuthOptions } from "./base.helper.js";

export const ACCESS_COOKIE_OPTIONS: SerializeOptions = getAuthOptions()
export const REFRESH_COOKIE_OPTIONS: SerializeOptions = getAuthOptions()

// helper base fns
export function setCookies(reply: FastifyReply, title: string, options: SerializeOptions, token?: string) {
  reply.setCookie(title, token || '', options)
}

export function clearCookie(reply: FastifyReply, title: string, path?: string) {
  reply.clearCookie(title, {
    path: path || "/"
  })
}

// jwt-sign
export const jwtSign = async (reply: FastifyReply, options: any) => {
  const token  = await reply.jwtSign(options as any)
  return token
}

// auth cookies
export function setAuthCookie(reply: FastifyReply, accessToken: string, refreshToken: string) {
  reply.setCookie(COOKIE_TITLE.ACCESS_TOKEN, accessToken, ACCESS_COOKIE_OPTIONS)
  reply.setCookie(COOKIE_TITLE.REFRESH_TOKEN, refreshToken, REFRESH_COOKIE_OPTIONS)
}

export function clearAuthCookie(reply: FastifyReply) {
  clearCookie(reply, COOKIE_TITLE.ACCESS_TOKEN)
  clearCookie(reply, COOKIE_TITLE.REFRESH_TOKEN)
}
