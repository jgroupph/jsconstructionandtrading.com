// app/api/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT, JWTPayload } from "jose";
import clientPromise from "@/lib/mongodb";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function createJWT(payload: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1h")
    .sign(secret);
}

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  // 1. Connect to DB and find user
  const client = await clientPromise;
  const db = client.db("jsprime"); // <- your DB name
  const users = db.collection("users");

  const user = await users.findOne({ username });
  if (!user) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // 2. Verify password hash
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  // 3. Create JWT
  const token = await createJWT({
    userId: user._id.toString(),
    username: user.username,
  });

  // 4. Return response with HTTP-only cookie
  const res = NextResponse.json({ success: true });
  res.cookies.set({
    name: "token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8 // 8 hours,
  });

  return res;
}
