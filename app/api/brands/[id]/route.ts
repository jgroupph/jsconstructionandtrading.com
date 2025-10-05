import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { r2 } from "@/lib/r2";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    const CACHE_TTL = parseInt(process.env.CACHE_TTL || `${60 * 60 * 24 * 365}`, 10)
    const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

  try {
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)
    const { id } = params

    const formData = await req.formData()
    const brandName = formData.get("brand_name") as string |null
    const file = formData.get("brand_img_file") as File | null
    const oldBrandImg = formData.get("old_brand_img") as string | File | null
    const createdAt = formData.get("createdAt") as Date | string | null

    let newImageKey = oldBrandImg

    if (file) {
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

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const ext = file.name.split(".").pop()
      const key = `brands/${Date.now()}-${file.name.replace(/\s+/g, "-")}`

      await r2.send(
        new PutObjectCommand({
          Bucket: process.env.R2_BUCKET!,
          Key: key,
          Body: buffer,
          ContentType: file.type,
          CacheControl: `public, max-age=${CACHE_TTL}`,
        })
      );

      newImageKey = key;

      if (oldBrandImg) {
        try {
          await r2.send(
            new DeleteObjectCommand({
              Bucket: process.env.R2_BUCKET!,
              Key: typeof oldBrandImg === "string" ? oldBrandImg : "",
            })
          );
          console.log("Deleted old image: ", oldBrandImg);
        } catch (err) {
          console.error("Failed to delete old R2 image:", err);
        }
      }
    }

    // 3. Update DB
    const row = await db.collection("brands").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          brandName,
          brandImage: newImageKey,
        },
      }
    );

    return NextResponse.json(
      {
        brandName: brandName,
        brandImage: newImageKey,
        id: id,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Error updating brand:", error)
    
    // Handle validation errors specifically
    if (error.message && (error.message.includes("Invalid file type") || error.message.includes("File size too large"))) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.DB_NAME);
    const { id } = params;

    // 1. Find brand
    const brand = await db.collection("brands").findOne({ _id: new ObjectId(id) });
    if (!brand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    // 2. Delete image from R2 if exists
    if (brand.brandImage) {
      try {
        await r2.send(
          new DeleteObjectCommand({
            Bucket: process.env.R2_BUCKET!,
            Key: brand.brandImage,
          })
        );
        console.log("Deleted image from R2:", brand.brandImage);
      } catch (err) {
        console.error("Failed to delete R2 image:", err);
      }
    }

    // 3. Delete DB record
    const result = await db.collection("brands").deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 1) {
      return NextResponse.json({ message: "Brand deleted successfully" }, { status: 200 });
    } else {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
