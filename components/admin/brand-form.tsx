"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Upload } from "lucide-react"
import type { Brand } from "@/app/admin/brands/page"

interface BrandFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (brand: Omit<Brand, "id" | "createdAt">) => Promise<void>
  initialData?: Brand | null
  mode: "add" | "edit"
}

export function BrandForm({ isOpen, onClose, onSubmit, initialData, mode }: BrandFormProps) {
  const [formData, setFormData] = useState({
    brand_name: "",
    brand_img: "",
    brand_img_file: null as File | null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false);
  const  [isFileUploading, setIsFileUploading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        brand_name: initialData.brand_name,
        brand_img: initialData.brand_img,
        brand_img_file: null,
      })
    } else {
      setFormData({
        brand_name: "",
        brand_img: "",
        brand_img_file: null,
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
      setFormData({ brand_name: "", brand_img: "" , brand_img_file: null})
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
      setIsFileUploading(false)
    }
  }

  const handleClose = () => {
    setFormData({ brand_name: "", brand_img: "", brand_img_file: null })
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
      setFormData((prev) => ({ ...prev, brand_img: result, brand_img_file: file }) )
    }
    reader.readAsDataURL(file)
    setIsFileUploading(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px] w-[95vw] max-w-[95vw] max-h-[90vh] overflow-y-auto mx-auto">
        <DialogHeader>
          <DialogTitle className="text-[#3A2D28] text-lg sm:text-xl text-center sm:text-left">
            {mode === "add" ? "Add New Brand" : "Edit Brand"}
          </DialogTitle>
          <DialogDescription className="text-[#A48374] text-sm text-center sm:text-left">
            {mode === "add"
              ? "Add a new trusted brand partner to your website."
              : "Update the brand information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="brand_name" className="text-[#3A2D28] text-sm font-medium">
              Brand Name
            </Label>
            <Input
              id="brand_name"
              value={formData.brand_name}
              onChange={(e) => setFormData((prev) => ({ ...prev, brand_name: e.target.value }))}
              placeholder="e.g., MDC, Walter Mart, Globe"
              required
              className="border-[#D1C7BD] focus:border-[#A48374] text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="brand_img" className="text-[#3A2D28] text-sm font-medium">
              Brand Logo
            </Label>
            <Input
              id="brand_img"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleFileUpload(file)
                }
              }}
              className="border-[#D1C7BD] focus:border-[#A48374] text-sm"
              required={!formData.brand_img}
            />
            <p className="text-xs text-[#A48374] flex items-center gap-1">
              <Upload className="h-3 w-3" />
              Upload a brand logo image (JPG, PNG, WebP supported)
            </p>
          </div>

          {formData.brand_img && (
            <div className="space-y-2">
              <Label className="text-[#3A2D28] text-sm font-medium">Preview</Label>
              <div className="aspect-square w-20 sm:w-24 relative overflow-hidden rounded-lg bg-white border border-[#D1C7BD] p-2">
                <img
                  src={(mode == "add" || isFileUploading ? "" : process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/") + formData.brand_img || "/placeholder.svg"}
                  alt="Brand preview"
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-[#CBAD8D] text-[#3A2D28] hover:bg-[#EBE3DB] bg-transparent w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#3A2D28] hover:bg-[#2A1F1C] text-white w-full sm:w-auto order-1 sm:order-2"
            >
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Brand" : "Update Brand"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
