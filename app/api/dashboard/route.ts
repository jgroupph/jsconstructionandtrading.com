import { NextRequest, NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)
    
    // Get counts from different collections
    const [equipmentCount, brandsCount, projectsCount] = await Promise.all([
      db.collection("equipments").countDocuments(),
      db.collection("brands").countDocuments(), 
      db.collection("projects").countDocuments()
    ])

    return NextResponse.json({
      equipment: equipmentCount,
      brands: brandsCount,
      projects: projectsCount
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}
