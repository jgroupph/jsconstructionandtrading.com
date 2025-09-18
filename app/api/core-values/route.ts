import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        //fetch all core-values and sort by title ascending
        const coreValues = await db.collection("core-values").find({}).sort({ title: 1 }).toArray();

        return NextResponse.json(coreValues, { status: 200 });
    } catch (error) {
        console.error("Error fetching core-values:", error);
        return NextResponse.json({ error: "Failed to fetch core-values" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const body = await req.json();
        const doc = {
            ...body,
            createdAt: new Date(),
        }

        const result = await db.collection("core-values").insertOne({
            ...body, createdAt: new Date()
        });
        return NextResponse.json({...doc, id:result.insertedId.toString()}, { status: 201 });
    } catch (error) {
        console.error("Error creating core-value:", error);
        return NextResponse.json({ error: "Failed to create core-value" }, { status: 500 });
    }
}