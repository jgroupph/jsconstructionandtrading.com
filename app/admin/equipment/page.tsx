"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Truck } from "lucide-react"
import { EquipmentForm } from "@/components/admin/equipment-form"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { showSuccessToast, showErrorToast, toastMessages } from "@/lib/toast-utils"

export interface Equipment {
  id: string
  equipment_name: string
  equipment_img: string
  equipment_img_file?: File | string | null
  description: string
  createdAt: Date | null
}

export default function EquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null)
  const [deleteEquipment, setDeleteEquipment] = useState<Equipment | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
      // Fetch equipments from API when component mounts
      const fetchEquipments = async () => {
        try {
          const res = await fetch("/api/equipments")
          if (!res.ok) {
            showErrorToast(toastMessages.fetchFailed)
            return
          }
          const data: any = await res.json()
          // Sort equipments by createdAt descending
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
  
        }
        catch (error) {
          console.error("Error fetching equipments:", error)
          showErrorToast(toastMessages.fetchFailed)
        } finally {
          setLoading(false)
        }
      }
  
      fetchEquipments()
    }, [])

  const handleAddEquipment = async (newEquipment: Omit<Equipment, "id" | "createdAt">) => {
    try {
      const formData = new FormData();
      formData.append("equipment_name", newEquipment.equipment_name)
      formData.append("description", newEquipment.description)
      formData.append("equipment_img", newEquipment.equipment_img_file as File)

      const res = await fetch("/api/equipments", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.equipmentAddFailed)
        throw new Error(error.error || "Failed to add equipment")
      }

      const createdEquipment = await res.json();

      setEquipment((prev) => [{
        id: createdEquipment.id,
        equipment_name: createdEquipment.equipmentName,
        equipment_img: createdEquipment.equipmentImage,
        description: createdEquipment.description,
        createdAt: createdEquipment.createdAt ? new Date(createdEquipment.createdAt) : new Date(),
        equipment_img_file: createdEquipment.equipmentImage || "",
      }, ...prev]);
      
      setIsFormOpen(false)
      showSuccessToast(toastMessages.equipmentAddedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.equipmentAddFailed)
      throw error
    }
  }

  const handleEditEquipment = async (updatedEquipment: Omit<Equipment, "id" | "createdAt">) => {
    if (!editingEquipment) return

    try {
      const formData = new FormData();
      formData.append("equipment_name", updatedEquipment.equipment_name);
      formData.append("old_equipment_img", editingEquipment.equipment_img_file as File | string);
      formData.append("description", updatedEquipment.description);
      formData.append("createdAt", editingEquipment.createdAt ? editingEquipment.createdAt.toISOString() : new Date().toISOString());
      if (updatedEquipment.equipment_img_file instanceof File) {
        formData.append("equipment_img_file", updatedEquipment.equipment_img_file);
      }

      const res = await fetch(`/api/equipments/${editingEquipment.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.equipmentUpdateFailed)
        throw new Error(error.error || "Failed to update equipment")
      }

      const equipmentUpdated = await res.json();

      setEquipment((prev) => prev.map((item) => (item.id === editingEquipment.id ? {
        id: editingEquipment.id,
        equipment_name: equipmentUpdated.equipmentName,
        equipment_img: equipmentUpdated.equipmentImage,
        description: equipmentUpdated.description,
        equipment_img_file: equipmentUpdated.equipmentImage || "",
        createdAt: editingEquipment.createdAt,
      } : item)))
      
      setEditingEquipment(null)
      showSuccessToast(toastMessages.equipmentUpdatedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.equipmentUpdateFailed)
      throw error
    }
  }

  const handleDeleteEquipment = async (id: string) => {
    try {
      const res = await fetch(`/api/equipments/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.equipmentDeleteFailed)
        throw new Error(error.error || "Failed to delete equipment")
      }

      setEquipment((prev) => prev.filter((item) => item.id !== id))
      setDeleteEquipment(null)
      showSuccessToast(toastMessages.equipmentDeletedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.equipmentDeleteFailed)
      throw error
    }
  }

  const openEditForm = (equipment: Equipment) => {
    setEditingEquipment(equipment)
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#3A2D28]">Heavy Equipment Management</h1>
            <p className="text-[#A48374]">Manage your construction equipment rental listings</p>
          </div>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3A2D28]"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#3A2D28]">Heavy Equipment Management</h1>
          <p className="text-[#A48374]">Manage your construction equipment rental listings</p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6] w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item, index) => (
          <Card
            key={item.id}
            className="border-[#D1C7BD] hover:shadow-lg transition-all duration-300 animate-slide-in-left bg-[#F1EDE6]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="aspect-video relative overflow-hidden rounded-lg bg-[#EBE3DB]">
                <img
                  src={process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" +item.equipment_img || "/placeholder.svg"}
                  alt={item.equipment_name}
                  className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg text-[#3A2D28]">{item.equipment_name}</CardTitle>
                  <Badge variant="secondary" className="bg-[#CBAD8D] text-[#3A2D28]">
                    <Truck className="h-3 w-3 mr-1" />
                    Equipment
                  </Badge>
                </div>
                <CardDescription className="text-[#A48374] text-sm leading-relaxed">{item.description}</CardDescription>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D1C7BD]">
                <span className="text-xs text-[#A48374]">Added {item?.createdAt?.toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(item)}
                    className="border-[#CBAD8D] text-[#3A2D28] hover:bg-[#EBE3DB]"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteEquipment(item)}
                    className="border-red-300 text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {equipment.length === 0 && (
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Truck className="h-12 w-12 text-[#CBAD8D] mb-4" />
            <h3 className="text-lg font-medium text-[#3A2D28] mb-2">No equipment found</h3>
            <p className="text-[#A48374] text-center mb-4">
              Get started by adding your first piece of heavy equipment.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6]">
              <Plus className="h-4 w-4 mr-2" />
              Add Equipment
            </Button>
          </CardContent>
        </Card>
      )}

      <EquipmentForm
        isOpen={isFormOpen || !!editingEquipment}
        onClose={() => {
          setIsFormOpen(false)
          setEditingEquipment(null)
        }}
        onSubmit={editingEquipment ? handleEditEquipment : handleAddEquipment}
        initialData={editingEquipment}
        mode={editingEquipment ? "edit" : "add"}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteEquipment}
        onClose={() => setDeleteEquipment(null)}
        onConfirm={async () => {
          if (deleteEquipment) {
            await handleDeleteEquipment(deleteEquipment.id)
          }
        }}
        title="Delete Equipment"
        description={`Are you sure you want to delete "${deleteEquipment?.equipment_name}"? This action cannot be undone.`}
      />
    </div>
  )
}