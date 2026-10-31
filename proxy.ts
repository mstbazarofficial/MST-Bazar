import { auth } from "@/lib/auth";
import { getSafeRedirectPath } from "@/lib/safe-redirect";
import { NextRequest, NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/sign-up", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

  // Redirect authenticated users away from sign-in, sign-up, and password pages
  if (session && isAuthRoute) {
    const redirectTo = getSafeRedirectPath(
      request.nextUrl.searchParams.get("redirect"),
    );
    return NextResponse.redirect(new URL(redirectTo, request.url));
  }

  // Redirect unauthenticated users attempting to access protected routes
  if (!session && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/sign-up", "/forgot-password"],
};
