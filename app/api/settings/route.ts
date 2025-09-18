import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import clientPromise from "@/lib/mongodb"
import { cookies } from "next/headers"

export async function PATCH(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    // Get session from cookies (check for token cookie like in login)
    const cookieStore = cookies()
    const tokenCookie = cookieStore.get("token")
    
    if (!tokenCookie) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const client = await clientPromise
    const db = client.db("jsprime") // Use same DB name as login
    
    // Find the user (assuming admin user)
    const user = await db.collection("users").findOne({ username: "jsprime-admin" })
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      )
    }

    // Verify current password using bcrypt like in login
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      )
    }

    // Hash the new password like you would in registration
    const hashedNewPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await db.collection("users").updateOne(
      { username: "jsprime-admin" },
      { $set: { password: hashedNewPassword, updatedAt: new Date() } }
    )

    return NextResponse.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Error updating password:", error)
    return NextResponse.json(
      { error: "Failed to update password" },
      { status: 500 }
    )
  }
}
