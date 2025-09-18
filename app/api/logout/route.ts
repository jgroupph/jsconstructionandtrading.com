import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ success: true })
  
  // Clear the admin session cookie
  res.cookies.set({
    name: "admin-session",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  })
  
  // Also clear the token cookie for backward compatibility
  res.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
  })
  
  return res
}
