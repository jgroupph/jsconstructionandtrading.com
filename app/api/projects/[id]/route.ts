import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { r2 } from "@/lib/r2"

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const CACHE_TTL = Number.parseInt(process.env.CACHE_TTL || `${60 * 60 * 24 * 365}`, 10)
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  try {
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)
    const { id } = params

    const formData = await req.formData()
    const title = formData.get("title") as string
    const location = formData.get("location") as string
    const image1File = formData.get("image1") as File | null
    const image2File = formData.get("image2") as File | null
    const oldImage1 = formData.get("oldImage1") as string | null
    const oldImage2 = formData.get("oldImage2") as string | null

    // Validate required fields
    if (!title || !location) {
      return NextResponse.json({ error: "Title and location are required" }, { status: 400 })
    }

    // Validate files if provided
    const validateFile = (file: File | null, fileName: string) => {
      if (file) {
        if (!ALLOWED_TYPES.includes(file.type)) {
          throw new Error(`${fileName}: Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.`)
        }
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`${fileName}: File size too large. Maximum size is 5MB.`)
        }
      }
    }

    validateFile(image1File, "Image 1")
    validateFile(image2File, "Image 2")

    // Get current project
    const currentProject = await db.collection("projects").findOne({ _id: new ObjectId(id) })
    if (!currentProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    const newImages = [...currentProject.images]

    // Handle image1 update
    if (image1File) {
      const buffer = Buffer.from(await image1File.arrayBuffer())
      const key = `projects/${Date.now()}-1-${image1File.name.replace(/\s+/g, "-")}`

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: image1File.type,
          CacheControl: `public, max-age=${CACHE_TTL}`,
        }),
      )

      // Delete old image1
      if (oldImage1) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: oldImage1,
            }),
          )
        } catch (err) {
          console.error("Failed to delete old image1:", err)
        }
      }

      newImages[0] = key
    }

    // Handle image2 update
    if (image2File) {
      const buffer = Buffer.from(await image2File.arrayBuffer())
      const key = `projects/${Date.now()}-2-${image2File.name.replace(/\s+/g, "-")}`

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: image2File.type,
          CacheControl: `public, max-age=${CACHE_TTL}`,
        }),
      )

      // Delete old image2
      if (oldImage2) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: oldImage2,
            }),
          )
        } catch (err) {
          console.error("Failed to delete old image2:", err)
        }
      }

      newImages[1] = key
    }

    // Update MongoDB
    await db.collection("projects").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          location,
          images: newImages,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json(
      {
        id,
        title,
        location,
        images: newImages,
        updatedAt: new Date(),
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("Error updating project:", error)
    
    // Handle validation errors specifically
    if (error.message && (error.message.includes("Invalid file type") || error.message.includes("File size too large"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)
    const { id } = params

    // Find project
    const project = await db.collection("projects").findOne({ _id: new ObjectId(id) })
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Delete images from R2
    if (project.images && project.images.length > 0) {
      for (const imageKey of project.images) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: imageKey,
            }),
          )
        } catch (err) {
          console.error("Failed to delete R2 image:", imageKey, err)
        }
      }
    }

    // Delete from MongoDB
    const result = await db.collection("projects").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 })
    } else {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }
  } catch (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }
}
