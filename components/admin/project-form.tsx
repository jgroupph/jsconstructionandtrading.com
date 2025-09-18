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
import { Upload, X } from "lucide-react"
import type { Project } from "@/app/admin/projects/page"

interface ProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (formData: FormData) => Promise<void>
  initialData?: Project | null
  mode: "add" | "edit"
}

export function ProjectForm({ isOpen, onClose, onSubmit, initialData, mode }: ProjectFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
  })
  const [image1File, setImage1File] = useState<File | null>(null)
  const [image2File, setImage2File] = useState<File | null>(null)
  const [image1Preview, setImage1Preview] = useState<string>("")
  const [image2Preview, setImage2Preview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        location: initialData.location,
      })
      if (initialData.images && initialData.images.length > 0) {
        setImage1Preview(`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${initialData.images[0]}`)
      }
      if (initialData.images && initialData.images.length > 1) {
        setImage2Preview(`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${initialData.images[1]}`)
      }
    } else {
      setFormData({
        title: "",
        location: "",
      })
      setImage1Preview("")
      setImage2Preview("")
    }
    setImage1File(null)
    setImage2File(null)
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const submitFormData = new FormData()
      submitFormData.append("title", formData.title)
      submitFormData.append("location", formData.location)

      if (mode === "add") {
        // For adding, both images are required
        if (!image1File || !image2File) {
          alert("Both images are required for new projects")
          setIsSubmitting(false)
          return
        }
        submitFormData.append("image1", image1File)
        submitFormData.append("image2", image2File)
      } else {
        // For editing, append files if they exist
        if (image1File) {
          submitFormData.append("image1", image1File)
        }
        if (image2File) {
          submitFormData.append("image2", image2File)
        }
        // Include old image keys for replacement
        if (initialData?.images) {
          submitFormData.append("oldImage1", initialData.images[0] || "")
          submitFormData.append("oldImage2", initialData.images[1] || "")
        }
      }

      await onSubmit(submitFormData)
      
      // Reset form on success
      setFormData({ title: "", location: "" })
      setImage1File(null)
      setImage2File(null)
      setImage1Preview("")
      setImage2Preview("")
      
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setFormData({ title: "", location: "" })
    setImage1File(null)
    setImage2File(null)
    setImage1Preview("")
    setImage2Preview("")
    onClose()
  }

  const handleFileUpload = (fileNumber: 1 | 2, file: File) => {
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
      if (fileNumber === 1) {
        setImage1File(file)
        setImage1Preview(result)
      } else {
        setImage2File(file)
        setImage2Preview(result)
      }
    }
    reader.readAsDataURL(file)
  }

  const removeImage = (imageNumber: 1 | 2) => {
    if (imageNumber === 1) {
      setImage1File(null)
      setImage1Preview("")
    } else {
      setImage2File(null)
      setImage2Preview("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[650px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-[#3A2D28] text-lg sm:text-xl">
            {mode === "add" ? "Add New Project" : "Edit Project"}
          </DialogTitle>
          <DialogDescription className="text-[#A48374] text-sm">
            {mode === "add"
              ? "Add a new featured construction project to showcase your work."
              : "Update the project information below."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-[#3A2D28] text-sm font-medium">
              Project Title *
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Makati Development Corporation"
              required
              className="border-[#D1C7BD] focus:border-[#A48374] text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-[#3A2D28] text-sm font-medium">
              Location *
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., Valero, Makati City"
              required
              className="border-[#D1C7BD] focus:border-[#A48374] text-sm"
            />
          </div>

          <div className="space-y-4">
            <Label className="text-[#3A2D28] text-sm font-medium">Project Images * (Exactly 2 images required)</Label>

            {/* Image 1 */}
            <div className="space-y-2">
              <Label className="text-[#A48374] text-xs">Image 1</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex-1 w-full">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(1, file)
                      }
                    }}
                    className="border-[#D1C7BD] focus:border-[#A48374] text-xs sm:text-sm"
                    required={mode === "add" && !image1Preview}
                  />
                </div>
                {image1Preview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(1)}
                    className="border-red-300 text-red-700 hover:bg-red-50 shrink-0 w-full sm:w-auto"
                  >
                    <X className="h-3 w-3 sm:mr-1" />
                    <span className="sm:hidden">Remove</span>
                  </Button>
                )}
              </div>
              {image1Preview && (
                <div className="w-full h-32 rounded border overflow-hidden bg-[#F1EDE6]">
                  <img
                    src={image1Preview || "/placeholder.svg"}
                    alt="Image 1 Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            {/* Image 2 */}
            <div className="space-y-2">
              <Label className="text-[#A48374] text-xs">Image 2</Label>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex-1 w-full">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        handleFileUpload(2, file)
                      }
                    }}
                    className="border-[#D1C7BD] focus:border-[#A48374] text-xs sm:text-sm"
                    required={mode === "add" && !image2Preview}
                  />
                </div>
                {image2Preview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImage(2)}
                    className="border-red-300 text-red-700 hover:bg-red-50 shrink-0 w-full sm:w-auto"
                  >
                    <X className="h-3 w-3 sm:mr-1" />
                    <span className="sm:hidden">Remove</span>
                  </Button>
                )}
              </div>
              {image2Preview && (
                <div className="w-full h-32 rounded border overflow-hidden bg-[#F1EDE6]">
                  <img
                    src={image2Preview || "/placeholder.svg"}
                    alt="Image 2 Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>

            <p className="text-xs text-[#A48374] flex items-start gap-1">
              <Upload className="h-3 w-3 mt-0.5 shrink-0" />
              <span>Upload exactly 2 images for each project. Supported formats: JPG, PNG, WebP.</span>
            </p>
          </div>

          {(image1Preview || image2Preview) && (
            <div className="space-y-2">
              <Label className="text-[#3A2D28] text-sm font-medium">Preview Gallery</Label>
              <div className="grid grid-cols-2 gap-2 max-h-40 overflow-hidden rounded-lg">
                {image1Preview && (
                  <div className="aspect-video relative overflow-hidden rounded bg-[#F1EDE6]">
                    <img
                      src={image1Preview || "/placeholder.svg"}
                      alt="Preview 1"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
                {image2Preview && (
                  <div className="aspect-video relative overflow-hidden rounded bg-[#F1EDE6]">
                    <img
                      src={image2Preview || "/placeholder.svg"}
                      alt="Preview 2"
                      className="object-cover w-full h-full"
                    />
                  </div>
                )}
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
              {isSubmitting ? "Saving..." : mode === "add" ? "Add Project" : "Update Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
