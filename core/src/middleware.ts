import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/lib/auth/auth-config.ts";
import { API_AUTH_PREFIX, AUTH_ROUTES, PROTECTED_ROUTES } from "@/routes";
import { ERROR } from "./types/error";

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuth = !!req.auth;

  if (isAccessingApiAuthRoute(pathname)) {
    return NextResponse.next();
  }

  if (isAccessingAuthRoute(pathname)) {
    return isAuth
      ? NextResponse.redirect(new URL("/", req.url))
      : NextResponse.next();
  }

  if (isAccessingProtectedRoute(pathname) && !isAuth) {
    return NextResponse.redirect(
      new URL(`/login?error=${ERROR.UNAUTHORIZED}`, req.url)
    );
  }

  return NextResponse.next();
});

const isAccessingApiAuthRoute = (pathname: string) =>
  pathname.startsWith(API_AUTH_PREFIX);

const isAccessingAuthRoute = (pathname: string) =>
  AUTH_ROUTES.some((route) => pathname.startsWith(route));

const isAccessingProtectedRoute = (pathname: string) =>
  PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};
