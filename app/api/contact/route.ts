import clientPromise from "@/lib/mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)

    // Fetch contact information
    const contact = await db.collection("contact").findOne({})

    // If no contact exists, return default data
    if (!contact) {
      const defaultContact = {
        mobilePhone: "+63925 551 0987",
        landlineNumber: "+628 788 1613",
        emails: ["info.jsprimeconstruction@gmail.com", "info.jsconstructionandtrading@gmail.com"],
        facebookLink: "https://www.facebook.com/js.primeconstruction",
        googleMapsSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966.0397265328708!2d121.04332891856315!3d14.41800154359728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d0370b94827b%3A0x476639e09c165bb5!2sCivic%20Prime%20Condominium!5e0!3m2!1sen!2sph!4v1719562752538!5m2!1sen!2sph",
        addresses: [
          {
            officeType: "Head Office",
            building: "Civic Prime Building",
            streetAddress: "2301 Civic Drive",
            subdivision: "Filinvest Corporate City",
            barangay: "Alabang",
            city: "Muntinlupa City",
            province: "",
            country: "Philippines",
            postalCode: "1781",
          },
          {
            officeType: "Satellite Office",
            building: "",
            streetAddress: "Daang Hari Molino IV",
            subdivision: "",
            barangay: "",
            city: "Bacoor City",
            province: "Cavite",
            country: "Philippines",
            postalCode: "",
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Insert default data
      await db.collection("contact").insertOne(defaultContact)
      return NextResponse.json(defaultContact, { status: 200 })
    }

    return NextResponse.json(contact, { status: 200 })
  } catch (error) {
    console.error("Error fetching contact:", error)
    return NextResponse.json({ error: "Failed to fetch contact" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const client = await clientPromise
    const db = client.db(process.env.DB_NAME)
    const body = await req.json()

    const { formData, updatedAt } = body

    // Remove _id field from formData to prevent immutable field error
    const { _id, ...updateData } = formData

    const result = await db.collection("contact").updateOne({}, { $set: { ...updateData, updatedAt } }, { upsert: true })

    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error updating contact:", error)
    return NextResponse.json({ error: "Failed to update contact" }, { status: 500 })
  }
}
