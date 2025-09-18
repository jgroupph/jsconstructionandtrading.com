import clientPromise from "@/lib/mongodb";
import {ObjectId} from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const body = await req.json();
        const { id } = params;
        const result = await db.collection("milestones").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...body } }
        );

        if (result.modifiedCount === 1) {
            return NextResponse.json({ message: "Milestone updated successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Milestone not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error updating milestone:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.DB_NAME);
        const { id } = params;
        const result = await db.collection("milestones").deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 1) {
            return NextResponse.json({ message: "Milestone deleted successfully" }, { status: 200 });
        } else {
            return NextResponse.json({ message: "Milestone not found" }, { status: 404 });
        }
    } catch (error) {
        console.error("Error deleting milestone:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}