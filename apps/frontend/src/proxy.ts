import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AUTH_COOKIE = "access_token";
const AUTH_PAGES = new Set(["/", "/sign-in", "/sign-up"]);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasAuthCookie = Boolean(request.cookies.get(AUTH_COOKIE)?.value);

  if (pathname === "/me" && !hasAuthCookie) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (AUTH_PAGES.has(pathname) && hasAuthCookie) {
    return NextResponse.redirect(new URL("/me", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/me"],
};
