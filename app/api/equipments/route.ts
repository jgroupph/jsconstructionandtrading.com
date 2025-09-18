import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";
import sharp from "sharp";

// GET all brands
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const equipments = await db
      .collection("equipments")
      .find({})
      .sort({ equipmentName: 1 })
      .toArray();

    return NextResponse.json(equipments, { status: 200 });
  } catch (error) {
    console.error("Error fetching equipments:", error);
    return NextResponse.json({ error: "Failed to fetch equipments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const CACHE_TTL = parseInt(process.env.CACHE_TTL || `${60 * 60 * 24 * 365}`, 10)
  const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  try {
    const formData = await req.formData()
    const file = formData.get("equipment_img") as File | null
    const equipmentName = formData.get("equipment_name") as string
    const description = formData.get("description") as string

    if (!file || !equipmentName || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed." 
      }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ 
        error: "File size too large. Maximum size is 5MB." 
      }, { status: 400 })
    }

    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    const compressedBuffer = await sharp(buffer)
    .resize(800)
    .jpeg({ quality: 80 }) 
    .toBuffer();

    // Unique filename
    const key = `equipments/${Date.now()}-${file.name}`;

    // Upload to R2
    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET!,
        Key: key,
        Body: compressedBuffer,
        ContentType: file.type,
        CacheControl: `public, max-age=${CACHE_TTL}`,
      })
    );

    // R2 URL (raw S3 endpoint)
    const equipment_img = `${key}`;

    // Save to MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);

    const result = await db.collection("equipments").insertOne({
      equipmentName,
      equipmentImage: equipment_img,
      description,
      createdAt: new Date(),
    });

    return NextResponse.json(
      {
        equipmentName,
        equipmentImage: equipment_img,
        description,
        createdAt: new Date(),
        id: result.insertedId.toString(),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error creating equipment:", error)
    
    // Handle validation errors specifically
    if (error.message && (error.message.includes("Invalid file type") || error.message.includes("File size too large"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ error: "Failed to create equipment" }, { status: 500 })
  }
}
