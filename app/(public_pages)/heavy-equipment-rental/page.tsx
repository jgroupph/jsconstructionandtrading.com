"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Truck, Clock, Shield, Award, Phone, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import { EquipmentSkeleton } from "@/components/admin/equipment-skeleton"

interface ContactData {
  mobilePhone: string
  landlineNumber: string
  emails: string[]
  facebookLink: string
  googleMapsSrc: string
  addresses: any[]
}

export default function HeavyEquipmentRentalPage() {
  const [equipment, setEquipment] = useState<any[]>([])
  const [equipmentLoading, setEquipmentLoading] = useState(true)
  const [contactData, setContactData] = useState<ContactData | null>(null)

  useEffect(() => {
    //fetch equipment from API
    const fetchEquipment = async () => {
      try {
        setEquipmentLoading(true);
        const res = await fetch("/api/equipments")
        if (!res.ok) {
          console.error("Failed to fetch equipment")
          return
        }
        const data = await res.json()

        data.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          setEquipment(data.map((b: any) => ({
            ...b,
            createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
            equipment_img: b.equipmentImage || null,
            equipment_img_file: b.equipmentImage || "",
            equipment_name: b.equipmentName || "",
            description: b.description || "",
            id: b._id.toString() || b.id.toString()
          })))
        
      } catch (error) {
        console.error("Error fetching equipment:", error)
      } finally {
        setEquipmentLoading(false);
      }
    }

    // Fetch contact data
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

    fetchEquipment()
    fetchContactData()
  }, [])

  // Fallback contact info
  const defaultContactData: ContactData = {
    mobilePhone: "+639255510987",
    landlineNumber: "+628 788 1613",
    emails: ["jsprimeconstruction@gmail.com"],
    facebookLink: "",
    googleMapsSrc: "",
    addresses: []
  }

  const contact = contactData || defaultContactData
  const companyPhone = contact.mobilePhone
  const companyEmail = contact.emails[0] || "jsprimeconstruction@gmail.com"

  // Helper to open phone dialer
  const handleCall = () => {
    window.open(`tel:${companyPhone}`);
  };

  // Helper to open mail app
  const handleMail = (subject = "Heavy Equipment Rental Inquiry", body = "Hello, I would like to inquire about your equipment rental services.") => {
    window.open(`mailto:${companyEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  // Helper for equipment quote
  const handleEquipmentQuote = (equipmentName: string) => {
    const subject = `Quote Request for ${equipmentName}`;
    const body = `Hello, I would like to request a quote for renting the ${equipmentName}. Please provide details and pricing.`;
    handleMail(subject, body);
  };

  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#3A2D28] py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[#A48374] rounded-full animate-float" />
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-[#CBAD8D] rounded-full animate-float-delayed" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#EBE3DB] rounded-full animate-float-slow" />
        </div>

        <div className="max-w-7xl mx-auto text-center space-y-8 relative z-10">
          <div className="space-y-6" data-aos="fade-up">
            <Badge className="bg-[#CBAD8D] text-[#3A2D28] px-4 py-2 text-sm font-semibold">
              Heavy Equipment Rental
            </Badge>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-balance text-[#EBE3DB]">
              Years of Quality Work <span className="text-[#CBAD8D]">Assurance</span>
            </h1>
            <p className="text-xl text-white leading-relaxed max-w-3xl mx-auto">
              Heavy equipment solutions provided by our service. Professional-grade construction equipment available for
              rent with flexible terms and reliable support.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="zoom-in" data-aos-delay="200">
            <Button
              size="lg"
              className="bg-[#CBAD8D] hover:bg-[#A48374] text-[#3A2D28] px-8 py-3 text-lg font-semibold border-2 border-[#EBE3DB] hover:border-[#A48374] transition-all duration-300 hover:scale-105"
              onClick={handleCall}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call for Quote
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-[#A48374]/10 border-[#EBE3DB] text-[#EBE3DB] hover:bg-[#A48374]/20 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={() => handleMail()}
            >
              <Mail className="w-5 h-5 mr-2" />
              Request Info
            </Button>
          </div>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold text-foreground animate-fade-in-up">Available Equipment</h2>
            <p className="text-xl text-muted-foreground animate-fade-in-up" style={{ animationDelay: "100ms" }}>
              Professional construction equipment for all your project needs
            </p>
          </div>

          {equipmentLoading ? (
            <EquipmentSkeleton />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {equipment.map((item, index) => (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group"
                  data-aos="fade-up"
                  data-aos-delay={100 + index * 150}
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden">
                      <img
                        src={process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" + item.equipment_img || "/placeholder.svg"}
                        alt={item.equipment_name}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#A48374]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <Button
                          size="sm"
                          className="w-full bg-[#EBE3DB] text-[#3A2D28] hover:bg-[#A48374]"
                          onClick={() => handleEquipmentQuote(item.equipment_name)}
                        >
                          Request Quote
                        </Button>
                      </div>
                    </div>
                    <div className="p-6 space-y-3">
                      <div className="bg-[#A48374] text-[#3A2D28] text-center py-2 px-4 rounded font-semibold group-hover:bg-[#CBAD8D] transition-colors duration-300">
                        {item.equipment_name}
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
  {/* Features Section removed as requested */}

      {/* Disclaimer Section */}
      <section className="py-12 px-6 bg-muted/50">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-muted-foreground italic">
            <strong>Disclaimer:</strong> The images shown are for illustration purposes only and may not be an exact
            representation of the product.
          </p>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3A2D28] via-[#A48374] to-[#3A2D28] text-[#EBE3DB]">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl lg:text-5xl font-bold leading-tight text-balance animate-fade-in-up">
            Ready to Rent Equipment?
          </h2>
          <p className="text-xl text-white leading-relaxed animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            Contact us today for competitive rates and reliable heavy equipment rental services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Button
              size="lg"
              className="bg-[#CBAD8D] text-[#3A2D28] hover:bg-[#A48374] px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105"
              onClick={handleCall}
            >
              <Phone className="w-5 h-5 mr-2" />
              Call Now: {companyPhone}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-[#EBE3DB] text-[#EBE3DB] hover:bg-[#A48374]/10 px-8 py-3 text-lg font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
              onClick={() => handleMail("Quote Request", "Hello, I would like to request a quote for heavy equipment rental.")}
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Quote Request
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
