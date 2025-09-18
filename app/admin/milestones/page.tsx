"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Calendar } from "lucide-react"
import { MilestoneForm } from "@/components/admin/milestone-form"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { ScrollAnimation } from "@/components/admin/scroll-animation"
import { showSuccessToast, showErrorToast, toastMessages } from "@/lib/toast-utils"
import { ObjectId } from "mongodb"

interface Milestone {
  id: ObjectId | string
  year: string
  title: string
  description: string
  createdAt: Date
}


export default function MilestonesPage() {
  const [milestones, setMilestones] = useState<Milestone[] | []>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Fetch milestones from the API when the component mounts
    const fetchMilestones = async () => {
      try {
        const response = await fetch("/api/milestones")
        if (response.ok) {
          const data = await response.json()
          // Convert string dates to Date objects
          const formattedData = data.map((milestone: any) => ({
            id: milestone.id || milestone._id,
            year: milestone.year,
            title: milestone.title,
            description: milestone.description,
            createdAt: new Date(milestone.createdAt),
          }))
          setMilestones(formattedData)
        } else {
          showErrorToast(toastMessages.fetchFailed)
        }
      } catch (error) {
        console.error("Error fetching milestones:", error)
        showErrorToast(toastMessages.fetchFailed)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchMilestones()
  }, [])

  const handleSubmit = async (data: Omit<Milestone, "id" | "createdAt">) => {
    try {
      if (editingMilestone) {
        const res = await fetch(`/api/milestones/${editingMilestone.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });
        
        if (!res.ok) {
          const error = await res.json()
          showErrorToast(error.error || toastMessages.milestoneUpdateFailed)
          throw new Error(error.error || "Failed to update milestone")
        }

        setMilestones((prev) =>
          prev.map((milestone) => (milestone.id === editingMilestone.id ? { ...milestone, ...data } : milestone)),
        )
        showSuccessToast(toastMessages.milestoneUpdatedSuccess)
      } else {
        const res = await fetch("/api/milestones", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const error = await res.json()
          showErrorToast(error.error || toastMessages.milestoneAddFailed)
          throw new Error(error.error || "Failed to add milestone")
        }

        const createdMilestone = await res.json();
        setMilestones((prev) => [...prev, createdMilestone]);
        showSuccessToast(toastMessages.milestoneAddedSuccess)
      }
      
      setIsFormOpen(false)
      setEditingMilestone(null)
      
    } catch (error) {
      if (editingMilestone) {
        showErrorToast(toastMessages.milestoneUpdateFailed)
      } else {
        showErrorToast(toastMessages.milestoneAddFailed)
      }
      throw error
    }
  }

  const handleEdit = (milestone: Milestone) => {
    setEditingMilestone(milestone)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/milestones/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.milestoneDeleteFailed)
        throw new Error(error.error || "Failed to delete milestone")
      }

      setMilestones((prev) => prev.filter((milestone) => milestone.id !== id))
      setDeleteId(null)
      showSuccessToast(toastMessages.milestoneDeletedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.milestoneDeleteFailed)
      throw error
    }
  }

  const sortedMilestones = [...milestones].sort((a, b) => Number.parseInt(a.year) - Number.parseInt(b.year))

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#3A2D28]">Company Milestones</h1>
          <p className="text-[#A48374]">Manage your company's timeline and achievements</p>
        </div>

        <div className="flex justify-start lg:justify-end">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6] w-full sm:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Milestone
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-[#CBAD8D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#A48374] text-sm">Loading milestones...</p>
            </div>
          </div>
        ) : sortedMilestones.length === 0 ? (
          <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-[#CBAD8D] mb-4" />
              <h3 className="text-lg font-medium text-[#3A2D28] mb-2">No milestones found</h3>
              <p className="text-[#A48374] text-center mb-4">
                Start building your company timeline by adding milestones
              </p>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Milestone
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedMilestones.map((milestone, index) => (
            <ScrollAnimation key={milestone.id.toString()} delay={index * 100}>
              <Card className="border-l-4 border-l-[#CBAD8D] hover:shadow-lg transition-all duration-300 bg-[#F1EDE6] border-[#D1C7BD]">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="bg-[#EBE3DB] p-2 rounded-full">
                        <Calendar className="w-5 h-5 text-[#A48374]" />
                      </div>
                      <div>
                        <CardTitle className="text-xl text-[#3A2D28]">{milestone.year}</CardTitle>
                        <h3 className="text-lg font-semibold text-[#A48374] mt-1">{milestone.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(milestone)}
                        className="border-[#CBAD8D] text-[#3A2D28] hover:bg-[#EBE3DB]"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteId(milestone.id.toString())}
                        className="border-red-300 text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[#A48374] leading-relaxed">{milestone.description}</p>
                  <p className="text-sm text-[#CBAD8D] mt-3">Added on {new Date(milestone.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            </ScrollAnimation>
          ))
        )}
      </div>



      <MilestoneForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false)
          setEditingMilestone(null)
        }}
        onSubmit={handleSubmit}
        initialData={editingMilestone}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await handleDelete(deleteId)
          }
        }}
        title="Delete Milestone"
        description="Are you sure you want to delete this milestone? This action cannot be undone."
      />
    </div>
  )
}
