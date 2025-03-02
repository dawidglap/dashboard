import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // ✅ Log every request to verify middleware is running
  console.log("🟢 Middleware processing:", pathname);

  // ✅ Directly handle `/ref/{id}` to prevent Next.js from treating it as a missing page
  if (pathname.startsWith("/ref/")) {
    console.log("✅ Redirecting affiliate link:", pathname);
    return NextResponse.redirect(
      "https://www.webomo.ch/en/webomo-business",
      302
    );
  }

  // ✅ Authentication logic remains unchanged
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (pathname.startsWith("/login") || pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Ensure Middleware Matches `/ref/*`
export const config = {
  matcher: ["/ref/:path*", "/dashboard/:path*"],
};
