"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Save, Phone, Mail, MapPin, Facebook } from "lucide-react"
import { showSuccessToast, showErrorToast, toastMessages } from "@/lib/toast-utils"

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

export default function ContactManagement() {
  const [contactData, setContactData] = useState<ContactData>({
    mobilePhone: "",
    landlineNumber: "",
    emails: ["", ""],
    facebookLink: "",
    googleMapsSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d966.0397265328708!2d121.04332891856315!3d14.41800154359728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3397d0370b94827b%3A0x476639e09c165bb5!2sCivic%20Prime%20Condominium!5e0!3m2!1sen!2sph!4v1719562752538!5m2!1sen!2sph",
    addresses: [
      {
        officeType: "",
        building: "",
        streetAddress: "",
        subdivision: "",
        barangay: "",
        city: "",
        province: "",
        country: "",
        postalCode: "",
      },
      {
        officeType: "",
        building: "",
        streetAddress: "",
        subdivision: "",
        barangay: "",
        city: "",
        province: "",
        country: "",
        postalCode: "",
      },
    ],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchContactData()
  }, [])

  const fetchContactData = async () => {
    try {
      const response = await fetch("/api/contact")
      if (response.ok) {
        const data = await response.json()
        setContactData(data)
      } else {
        showErrorToast(toastMessages.fetchFailed)
      }
    } catch (error) {
      console.error("Error fetching contact data:", error)
      showErrorToast(toastMessages.fetchFailed)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/contact", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: contactData,
          updatedAt: new Date(),
        }),
      })

      if (response.ok) {
        showSuccessToast(toastMessages.contactUpdatedSuccess)
      } else {
        const error = await response.json()
        showErrorToast(error.error || toastMessages.contactUpdateFailed)
      }
    } catch (error) {
      console.error("Error updating contact:", error)
      showErrorToast(toastMessages.contactUpdateFailed)
    } finally {
      setSaving(false)
    }
  }

  const updateField = (field: keyof ContactData, value: any) => {
    setContactData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const updateEmail = (index: number, value: string) => {
    const newEmails = [...contactData.emails]
    newEmails[index] = value
    updateField("emails", newEmails)
  }

  const updateAddress = (index: number, field: keyof Address, value: string) => {
    const newAddresses = [...contactData.addresses]
    newAddresses[index] = {
      ...newAddresses[index],
      [field]: value,
    }
    updateField("addresses", newAddresses)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="col-span-full flex items-center justify-center py-12">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-8 h-8 border-4 border-[#CBAD8D] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#A48374] text-sm">Loading contact information...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#3A2D28]">Contact Information</h1>
          <p className="text-[#A48374] mt-1">Manage your company's contact details and addresses</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6]">
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6">
        {/* Phone Numbers */}
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardHeader className="bg-[#EBE3DB]">
            <CardTitle className="text-[#3A2D28] flex items-center gap-2">
              <Phone className="w-5 h-5" />
              Phone Numbers
            </CardTitle>
            <CardDescription className="text-[#A48374]">Manage your contact phone numbers</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="mobilePhone" className="text-[#3A2D28]">
                Mobile Phone
              </Label>
              <Input
                id="mobilePhone"
                value={contactData.mobilePhone}
                onChange={(e) => updateField("mobilePhone", e.target.value)}
                placeholder="+63925 551 0987"
                className="border-[#D1C7BD] focus:border-[#A48374]"
              />
            </div>
            <div>
              <Label htmlFor="landlineNumber" className="text-[#3A2D28]">
                Landline Number
              </Label>
              <Input
                id="landlineNumber"
                value={contactData.landlineNumber}
                onChange={(e) => updateField("landlineNumber", e.target.value)}
                placeholder="+628 788 1613"
                className="border-[#D1C7BD] focus:border-[#A48374]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Email Addresses */}
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardHeader className="bg-[#EBE3DB]">
            <CardTitle className="text-[#3A2D28] flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Addresses
            </CardTitle>
            <CardDescription className="text-[#A48374]">Manage up to two email addresses</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {contactData.emails.map((email, index) => (
              <div key={index}>
                <Label htmlFor={`email${index + 1}`} className="text-[#3A2D28]">
                  Email {index + 1}
                </Label>
                <Input
                  id={`email${index + 1}`}
                  type="email"
                  value={email}
                  onChange={(e) => updateEmail(index, e.target.value)}
                  placeholder={`Email ${index + 1}`}
                  className="border-[#D1C7BD] focus:border-[#A48374]"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Social Media */}
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardHeader className="bg-[#EBE3DB]">
            <CardTitle className="text-[#3A2D28] flex items-center gap-2">
              <Facebook className="w-5 h-5" />
              Social Media & Maps
            </CardTitle>
            <CardDescription className="text-[#A48374]">Manage your social media links and Google Maps embed</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="facebookLink" className="text-[#3A2D28]">
                Facebook Link
              </Label>
              <Input
                id="facebookLink"
                type="url"
                value={contactData.facebookLink}
                onChange={(e) => updateField("facebookLink", e.target.value)}
                placeholder="https://www.facebook.com/js.primeconstruction"
                className="border-[#D1C7BD] focus:border-[#A48374]"
              />
            </div>
            <div>
              <Label htmlFor="googleMapsSrc" className="text-[#3A2D28]">
                Google Maps Embed URL
              </Label>
              <Input
                id="googleMapsSrc"
                type="url"
                value={contactData.googleMapsSrc}
                onChange={(e) => updateField("googleMapsSrc", e.target.value)}
                placeholder="https://www.google.com/maps/embed?pb=..."
                className="border-[#D1C7BD] focus:border-[#A48374]"
              />
              <p className="text-xs text-[#A48374] mt-1">
                Get embed URL from Google Maps → Share → Embed a map → Copy HTML src attribute
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Addresses */}
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardHeader className="bg-[#EBE3DB]">
            <CardTitle className="text-[#3A2D28] flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Office Addresses
            </CardTitle>
            <CardDescription className="text-[#A48374]">Manage up to two office addresses</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {contactData.addresses.map((address, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold text-[#3A2D28] mb-4">Address {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-[#3A2D28]">Office Type / Label</Label>
                    <Input
                      value={address.officeType}
                      onChange={(e) => updateAddress(index, "officeType", e.target.value)}
                      placeholder="Head Office, Satellite Office"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#3A2D28]">Building / Unit / Floor (Optional)</Label>
                    <Input
                      value={address.building}
                      onChange={(e) => updateAddress(index, "building", e.target.value)}
                      placeholder="Civic Prime Building"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-[#3A2D28]">Street Address</Label>
                    <Input
                      value={address.streetAddress}
                      onChange={(e) => updateAddress(index, "streetAddress", e.target.value)}
                      placeholder="2301 Civic Drive"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#3A2D28]">Subdivision / Complex / Corporate Park (Optional)</Label>
                    <Input
                      value={address.subdivision}
                      onChange={(e) => updateAddress(index, "subdivision", e.target.value)}
                      placeholder="Filinvest Corporate City"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#3A2D28]">Barangay / District (Optional)</Label>
                    <Input
                      value={address.barangay}
                      onChange={(e) => updateAddress(index, "barangay", e.target.value)}
                      placeholder="Alabang"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#3A2D28]">City / Municipality</Label>
                    <Input
                      value={address.city}
                      onChange={(e) => updateAddress(index, "city", e.target.value)}
                      placeholder="Muntinlupa City"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#3A2D28]">Province / State</Label>
                    <Input
                      value={address.province}
                      onChange={(e) => updateAddress(index, "province", e.target.value)}
                      placeholder="Cavite"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#3A2D28]">Country</Label>
                    <Input
                      value={address.country}
                      onChange={(e) => updateAddress(index, "country", e.target.value)}
                      placeholder="Philippines"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                  <div>
                    <Label className="text-[#3A2D28]">Postal Code / ZIP (Optional)</Label>
                    <Input
                      value={address.postalCode}
                      onChange={(e) => updateAddress(index, "postalCode", e.target.value)}
                      placeholder="1781"
                      className="border-[#D1C7BD] focus:border-[#A48374]"
                    />
                  </div>
                </div>
                {index < contactData.addresses.length - 1 && <Separator className="mt-6 bg-[#D1C7BD]" />}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
