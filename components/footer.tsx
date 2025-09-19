"use client"

import { useState, useEffect } from "react"
import { Facebook } from "lucide-react"

interface Address {
  officeType: string
  building: string
  streetAddress: string
  subdivision: string
  barangay: string
  city: string
  province: string
  country: string
  postalCode: string
}

interface ContactData {
  mobilePhone: string
  landlineNumber: string
  emails: string[]
  facebookLink: string
  googleMapsSrc: string
  addresses: Address[]
}

export function Footer() {
  const [contactData, setContactData] = useState<ContactData | null>(null)

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const response = await fetch("/api/contact")
        if (response.ok) {
          const data = await response.json()
          setContactData(data)
        }
      } catch (error) {
        console.error("Error fetching contact data:", error)
      }
    }

    fetchContactData()
  }, [])

  // Fallback data while loading or if fetch fails
  const defaultData: ContactData = {
    mobilePhone: "+63925 551 0987",
    landlineNumber: "+628 788 1613",
    emails: ["info.jsprimeconstruction@gmail.com", "info.jsconstructionandtrading@gmail.com"],
    facebookLink: "https://www.facebook.com/js.primeconstruction",
    googleMapsSrc: "",
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
        building: "Verdana Center",
        streetAddress: "Daang Hari Molino IV",
        subdivision: "",
        barangay: "",
        city: "Bacoor City",
        province: "Cavite",
        country: "Philippines",
        postalCode: "",
      },
    ],
  }

  const data = contactData || defaultData

  return (
  <footer className="bg-[#3A2D28] text-[#EBE3DB] py-16 px-6">
  <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-[#EBE3DB]">FIND US</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-[#CBAD8D] mb-2">Address</h4>
              {data.addresses.map((address, index) => (
                <div key={index} className="text-[#D1C7BD] space-y-1 mb-4">
                  <p className="font-medium">{address.officeType}:</p>
                  {address.building && <p>{address.building}</p>}
                  <p>{address.streetAddress}</p>
                  {address.subdivision && <p>{address.subdivision}</p>}
                  {address.barangay && <p>{address.barangay}</p>}
                  <p>{address.city}</p>
                  {address.province && <p>{address.province}</p>}
                  {address.country && <p>{address.country}</p>}
                  {address.postalCode && <p>{address.postalCode}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="font-semibold text-[#CBAD8D] mb-2">Contact</h4>
            <div className="text-[#D1C7BD] space-y-1">
              <p>Mobile: {data.mobilePhone}</p>
              <p>Landline: {data.landlineNumber}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-[#CBAD8D] mb-2">Email</h4>
            <div className="text-[#D1C7BD] space-y-1">
              {data.emails.filter(email => email.trim()).map((email, index) => (
                <p key={index}>{email}</p>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-[#EBE3DB] mb-4">SOCIAL MEDIA</h3>
            <a href={data.facebookLink} target="_blank" rel="noopener noreferrer">
              <Facebook className="w-6 h-6 text-[#D1C7BD] hover:text-[#EBE3DB] cursor-pointer transition-colors" />
            </a>
          </div>
        </div>

        <div className="space-y-4">
          <a href="https://jsprimeconstruction.com" target="_blank" rel="noopener noreferrer">
            <img
              src="/logo-pages.png"
              alt="J's Prime Construction"
              className="h-16 w-16"
            />
          </a>
          <div className="text-[#D1C7BD] text-sm">
            <p>Copyright J's Prime Construction</p>
            <p>© 2024 All Rights Reserved</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
