// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload;
  } catch (err) {
    console.error("JWT verify failed:", err);
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const protectedPaths = ["/admin", "admin/equipment", "admin/brands","admin/projects","admin/milestones","admin/mission-vision","admin/core-values","admin/settings","admin/contacts", "/profile"];
  const isProtected = protectedPaths.some((path) =>
    req.nextUrl.pathname.startsWith(path)
  );

  if (isProtected) {
    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ token is valid, request continues
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"], // runs on all routes (including /api) except Next internals
};
