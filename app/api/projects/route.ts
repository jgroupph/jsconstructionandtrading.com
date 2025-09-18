import clientPromise from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"

// GET all projects
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)

    const projects = await db.collection("projects").find({}).sort({ createdAt: 1 }).toArray()

    return NextResponse.json(projects, { status: 200 })
  } catch (error) {
    console.error("Error fetching projects:", error)
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const CACHE_TTL = Number.parseInt(process.env.CACHE_TTL || `${60 * 60 * 24 * 365}`, 10)
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  try {
    const formData = await req.formData()
    const image1 = formData.get("image1") as File | null
    const image2 = formData.get("image2") as File | null
    const title = formData.get("title") as string
    const location = formData.get("location") as string

    // Validate required fields
    if (!image1 || !image2 || !title || !location) {
      return NextResponse.json({ error: "All fields are required including 2 images" }, { status: 400 })
    }

    // Validate file types and sizes
    const validateFile = (file: File, fileName: string) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error(`${fileName}: Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.`)
      }
      if (file.size > MAX_FILE_SIZE) {
        throw new Error(`${fileName}: File size too large. Maximum size is 5MB.`)
      }
    }

    validateFile(image1, "Image 1")
    validateFile(image2, "Image 2")

    // Upload both images to R2
    const uploadImage = async (file: File, index: number) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      const key = `projects/${Date.now()}-${index}-${file.name.replace(/\s+/g, "-")}`

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          CacheControl: `public, max-age=${CACHE_TTL}`,
        }),
      )

      return key
    }

    const image1Key = await uploadImage(image1, 1)
    const image2Key = await uploadImage(image2, 2)

    // Save to MongoDB
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)

    const result = await db.collection("projects").insertOne({
      title,
      location,
      images: [image1Key, image2Key],
      createdAt: new Date(),
    })

    return NextResponse.json(
      {
        id: result.insertedId.toString(),
        title,
        location,
        images: [image1Key, image2Key],
        createdAt: new Date(),
      },
      { status: 201 },
    )
  } catch (error: any) {
    console.error("Error creating project:", error)
    
    // Handle validation errors specifically
    if (error.message && (error.message.includes("Invalid file type") || error.message.includes("File size too large"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
