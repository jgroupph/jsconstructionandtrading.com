"use client"

import { use, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Edit, Target, Eye } from "lucide-react"
import { MissionVisionForm } from "@/components/admin/mission-vision-form"
import { ScrollAnimation } from "@/components/admin/scroll-animation"
import { showSuccessToast, showErrorToast, toastMessages } from "@/lib/toast-utils"

interface MissionVision {
  mission: string
  vision: string
  updatedAt: Date
}

const initialData: MissionVision = {
  mission:
    "To deliver exceptional construction services that exceed client expectations through innovation, quality craftsmanship, and unwavering commitment to safety and sustainability.",
  vision:
    "To be the leading construction company recognized for transforming communities through outstanding projects that stand the test of time.",
  updatedAt: new Date("2023-01-01"),
}

export default function MissionVisionPage() {
  const [data, setData] = useState<MissionVision>(initialData)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/mission-vision")
        if (response.ok) {
          const data = await response.json()
          if (data.length > 0) {
            setData({
              ...data[0],
              updatedAt: new Date(data[0].updatedAt),
            })
          }
        } else {
          showErrorToast(toastMessages.fetchFailed)
        }
      } catch (error) {
        console.error("Error fetching mission-vision:", error)
        showErrorToast(toastMessages.fetchFailed)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchData()
  }, [])

  const handleSubmit = async (formData: Omit<MissionVision, "updatedAt">) => {
    try {
      const res = await fetch(`/api/mission-vision`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({formData, updatedAt: new Date()}),
      });
      
      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.missionVisionUpdateFailed)
        throw new Error(error.error || "Failed to update mission & vision")
      }

      setData({
        ...formData,
        updatedAt: new Date(),
      })

      setIsFormOpen(false)
      showSuccessToast(toastMessages.missionVisionUpdatedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.missionVisionUpdateFailed)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#3A2D28]">Mission & Vision</h1>
          <p className="text-[#A48374]">Define your company's purpose and future aspirations</p>
        </div>

        <div className="flex justify-start lg:justify-end">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6] w-full sm:w-auto"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit Mission & Vision
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-[#CBAD8D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#A48374] text-sm">Loading mission & vision...</p>
            </div>
          </div>
        ) : (
          <>
            <ScrollAnimation>
              <Card className="border-l-4 border-l-[#CBAD8D] hover:shadow-lg transition-all duration-300 h-full bg-[#F1EDE6] border-[#D1C7BD]">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EBE3DB] p-2 rounded-full">
                      <Target className="w-5 h-5 text-[#A48374]" />
                    </div>
                    <CardTitle className="text-xl text-[#3A2D28]">Our Mission</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#A48374] leading-relaxed text-balance">{data.mission}</p>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={100}>
              <Card className="border-l-4 border-l-[#A48374] hover:shadow-lg transition-all duration-300 h-full bg-[#F1EDE6] border-[#D1C7BD]">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EBE3DB] p-2 rounded-full">
                      <Eye className="w-5 h-5 text-[#3A2D28]" />
                    </div>
                    <CardTitle className="text-xl text-[#3A2D28]">Our Vision</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#A48374] leading-relaxed text-balance">{data.vision}</p>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </>
        )}
      </div>

      {!loading && (
        <Card className="bg-[#EBE3DB] border-[#D1C7BD]">
          <CardContent className="pt-6">
            <p className="text-sm text-[#A48374] text-center">
              Last updated on {data.updatedAt?.toLocaleDateString()} at {data.updatedAt?.toLocaleTimeString()}
            </p>
          </CardContent>
        </Card>
      )}

      <MissionVisionForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleSubmit}
        initialData={data}
      />
    </div>
  )
}
