import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        //fetch all mission-vision and sort by year descending
        const missionVision = await db.collection("mision-vision").find({}).toArray();

        return NextResponse.json(missionVision, { status: 200 });
    } catch (error) {
        console.error("Error fetching mission-vision:", error);
        return NextResponse.json({ error: "Failed to fetch mission-vision" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const body = await req.json();

        const { formData, updatedAt } = body;

        const result = await db.collection("mision-vision").updateOne(
            { },
            { $set: { ...formData, updatedAt } }
        );

        return NextResponse.json(result, { status: 200 });
    } catch (error) {
        console.error("Error updating mission-vision:", error);
        return NextResponse.json({ error: "Failed to update mission-vision" }, { status: 500 });
    }
}
