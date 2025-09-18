import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);

        //fetch all milestones and sort by year descending
        const milestones = await db.collection("milestones").find({}).sort({ year: 1 }).toArray();
        

        return NextResponse.json(milestones, { status: 200 });
    } catch (error) {
        console.error("Error fetching milestones:", error);
        return NextResponse.json({ error: "Failed to fetch milestones" }, { status: 500 });
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

        const result = await db.collection("milestones").insertOne({
            ...body, createdAt: new Date()
        });
        
        return NextResponse.json({...doc, id:result.insertedId.toString()}, { status: 201 });
    } catch (error) {
        console.error("Error creating milestone:", error);
        return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
    }
}