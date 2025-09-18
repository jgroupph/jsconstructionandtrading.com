"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Award, Shield, Users, Lightbulb, Heart, Target } from "lucide-react"
import { CoreValueForm } from "@/components/admin/core-value-form"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { ScrollAnimation } from "@/components/admin/scroll-animation"
import { showSuccessToast, showErrorToast, toastMessages } from "@/lib/toast-utils"

interface CoreValue {
  id: string
  title: string
  description: string
  icon: string
  createdAt: Date
}

const iconMap = {
  Award,
  Shield,
  Users,
  Lightbulb,
  Heart,
  Target,
}


export default function CoreValuesPage() {
  const [values, setValues] = useState<CoreValue[] | []>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingValue, setEditingValue] = useState<CoreValue | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  //fetch core-values from the API when the component mounts
  useEffect(() => {
    const fetchValues = async () => {
      try {
        const response = await fetch("/api/core-values")
        if (response.ok) {
          const data = await response.json()
          // Convert string dates to Date objects
          const formattedData = data.map((value: any) => ({
            id: (value.id || value._id)?.toString(),
            title: value.title,
            description: value.description,
            icon: value.icon,
            createdAt: new Date(value.createdAt),
          }))
          setValues(formattedData)
        } else {
          showErrorToast(toastMessages.fetchFailed)
        }
      } catch (error) {
        console.error("Error fetching core values:", error)
        showErrorToast(toastMessages.fetchFailed)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchValues()
  }, [])

  const handleSubmit = async (data: Omit<CoreValue, "id" | "createdAt">) => {
    try {
      if (editingValue) {
        const res = await fetch(`/api/core-values/${editingValue.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const error = await res.json()
          showErrorToast(error.error || toastMessages.coreValueUpdateFailed)
          throw new Error(error.error || "Failed to update core value")
        }

        setValues((prev) => prev.map((value) => (value.id === editingValue.id ? { ...value, ...data } : value)))
        showSuccessToast(toastMessages.coreValueUpdatedSuccess)
        
      } else {
        const res = await fetch(`/api/core-values`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const error = await res.json()
          showErrorToast(error.error || toastMessages.coreValueAddFailed)
          throw new Error(error.error || "Failed to add core value")
        }

        const createdCoreValue = await res.json();
        setValues((prev) => [...prev, createdCoreValue]);
        showSuccessToast(toastMessages.coreValueAddedSuccess)
      }
      
      setIsFormOpen(false)
      setEditingValue(null)
      
    } catch (error) {
      if (editingValue) {
        showErrorToast(toastMessages.coreValueUpdateFailed)
      } else {
        showErrorToast(toastMessages.coreValueAddFailed)
      }
      throw error
    }
  }

  const handleEdit = (value: CoreValue) => {
    setEditingValue(value)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/core-values/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.coreValueDeleteFailed)
        throw new Error(error.error || "Failed to delete core value")
      }

      setValues((prev) => prev.filter((value) => value.id !== id))
      setDeleteId(null)
      showSuccessToast(toastMessages.coreValueDeletedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.coreValueDeleteFailed)
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <div>
          <h1 className="text-3xl font-bold text-[#4c2c13]">Core Values</h1>
          <p className="text-[#a78a6e] mt-2">Define the principles that guide your company</p>
        </div>
        <div className="mt-4">
          <Button onClick={() => setIsFormOpen(true)} className="bg-[#4c2c13] hover:bg-[#3a210e] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Core Value
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-[#CBAD8D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#A48374] text-sm">Loading core values...</p>
            </div>
          </div>
        ) : values.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Award className="h-12 w-12 text-[#CBAD8D] mb-4" />
                <h3 className="text-lg font-medium text-[#3A2D28] mb-2">No core values found</h3>
                <p className="text-[#A48374] text-center mb-4">
                  Start defining your company's principles and values
                </p>
                <Button
                  onClick={() => setIsFormOpen(true)}
                  className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Core Value
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          values.map((value, index) => {
            const IconComponent = iconMap[value.icon as keyof typeof iconMap] || Award
            return (
              <ScrollAnimation key={value.id.toString()} delay={index * 100}>
                <Card className="hover:shadow-lg transition-all duration-300 h-full border border-[#e2d6c3] bg-[#f7f2ec] rounded-xl">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="bg-[#e2d6c3] p-3 rounded-full">
                          <IconComponent className="w-6 h-6 text-[#4c2c13]" />
                        </div>
                        <CardTitle className="text-lg text-[#4c2c13]">{value.title}</CardTitle>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(value)}
                          className="hover:bg-[#f7f2ec] h-8 w-8 p-0 text-[#4c2c13]"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(value.id.toString())}
                          className="hover:bg-[#f7f2ec] hover:text-red-700 h-8 w-8 p-0 text-[#4c2c13]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[#4c2c13] leading-relaxed text-pretty">{value.description}</p>
                    <p className="text-sm text-[#a78a6e] mt-4">Added on {new Date(value.createdAt).toLocaleDateString()}</p>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            )
          })
        )}
      </div>



      <CoreValueForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingValue(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingValue}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId)
          }
        }}
        title="Delete Core Value"
        description="Are you sure you want to delete this core value? This action cannot be undone."
      />
    </div>
  )
}
