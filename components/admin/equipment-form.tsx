"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoadingSpinner } from "@/components/admin/loading-spinner"
import { Upload } from "lucide-react"
import type { Equipment } from "@/app/admin/equipment/page"
import { set } from "date-fns"

interface EquipmentFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (equipment: Omit<Equipment, "id" | "createdAt">) => Promise<void>
  initialData?: Equipment | null
  mode: "add" | "edit"
}

export function EquipmentForm({ isOpen, onClose, onSubmit, initialData, mode }: EquipmentFormProps) {
  const [formData, setFormData] = useState({
    equipment_name: "",
    equipment_img: "",
    description: "",
    equipment_img_file: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFileUploading, setIsFileUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        equipment_name: initialData.equipment_name,
        equipment_img: initialData.equipment_img,
        description: initialData.description,
        equipment_img_file: null,
      })
    } else {
      setFormData({
        equipment_name: "",
        equipment_img: "",
        description: "",
        equipment_img_file: null,
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      setFormData({ equipment_name: "", equipment_img: "", description: "", equipment_img_file: null })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
      setIsFileUploading(false)
    }
  }

  const handleClose = () => {
    setFormData({ equipment_name: "", equipment_img: "", description: "", equipment_img_file: null })
    setIsFileUploading(false);
    onClose()
  }

  const handleFileUpload = (file: File) => {
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed.')
      return
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      alert('File size too large. Maximum size is 5MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setFormData((prev) => ({ ...prev, equipment_img: result, equipment_img_file: file }))
    }
    setIsFileUploading(true)
    reader.readAsDataURL(file)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-auto my-4 animate-scale-in flex flex-col justify-center">
        <DialogHeader>
          <DialogTitle className="text-[#3A2D28] text-lg sm:text-xl text-center sm:text-left">
            {mode === "add" ? "Add New Equipment" : "Edit Equipment"}
          </DialogTitle>
          <DialogDescription className="text-[#A48374] text-sm text-center sm:text-left">
            {mode === "add"
              ? "Add a new piece of heavy equipment to your rental listings."
              : "Update the equipment information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 w-full">
          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
            <Label htmlFor="name" className="text-[#3A2D28] text-sm font-medium">
              Equipment Name
            </Label>
            <Input
              id="name"
              value={formData.equipment_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, equipment_name: e.target.value }))}
              placeholder="e.g., Excavator, Bulldozer, Crane"
              required
              className="border-[#D1C7BD] focus:border-[#A48374] focus-construction text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <Label htmlFor="image" className="text-[#3A2D28] text-sm font-medium">
              Equipment Image
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file)
                }
              }}
              className="border-[#D1C7BD] focus:border-[#A48374] focus-construction text-sm"
              disabled={isSubmitting}
              required={!formData.equipment_img}
            />
            <p className="text-xs text-[#A48374] flex items-center gap-1">
              <Upload className="h-3 w-3" />
              Upload an image of the equipment (JPG, PNG, WebP supported)
            </p>
            {formData.equipment_img && (
              <div className="w-full h-32 sm:h-40 rounded border overflow-hidden bg-[#F1EDE6] mt-2">
                <img
                  src={(mode == "add" || isFileUploading ? "" : process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/") + formData.equipment_img || "/placeholder.svg"}
                  alt="Equipment preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          <div className="space-y-2 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <Label htmlFor="description" className="text-[#3A2D28] text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the equipment's capabilities, specifications, and ideal use cases..."
              required
              rows={4}
              className="border-[#D1C7BD] focus:border-[#A48374] resize-none focus-construction text-sm"
              disabled={isSubmitting}
            />
          </div>

          <DialogFooter
            className="flex flex-col sm:flex-row gap-2 pt-4 animate-fade-in-up justify-center sm:justify-end"
            style={{ animationDelay: "400ms" }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-[#CBAD8D] text-[#3A2D28] hover:bg-[#EBE3DB] bg-transparent focus-construction w-full sm:w-auto order-2 sm:order-1"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3A2D28] hover:bg-[#2A1F1C] text-white focus-construction min-w-[120px] w-full sm:w-auto order-1 sm:order-2"
            >
              {isSubmitting ? (
                <LoadingSpinner size="sm" text={mode === "add" ? "Adding" : "Updating"} />
              ) : mode === "add" ? (
                "Add Equipment"
              ) : (
                "Update Equipment"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}