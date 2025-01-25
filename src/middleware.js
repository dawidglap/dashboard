import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Allow access to public routes, login page, and API routes
  if (
    pathname.startsWith("/login") || // Allow login page
    pathname.startsWith("/api") || // Allow API calls
    pathname === "/" // Allow homepage or other public pages
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to the login page
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow access to authenticated users
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"], // Protect dashboard routes
};
