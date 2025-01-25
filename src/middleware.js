import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Check if the user is logged in
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // For now, allow any authenticated user to access the dashboard
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect all dashboard routes
};
