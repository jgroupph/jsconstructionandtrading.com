"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

import { ObjectId } from "mongodb"

interface Milestone {
  id: ObjectId | string
  year: string
  title: string
  description: string
  createdAt: Date
}

interface MilestoneFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<Milestone, "id" | "createdAt">) => Promise<void>
  initialData?: Milestone | null
}

export function MilestoneForm({ isOpen, onClose, onSubmit, initialData }: MilestoneFormProps) {
  const [formData, setFormData] = useState({
    year: "",
    title: "",
    description: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        year: initialData.year,
        title: initialData.title,
        description: initialData.description,
      })
    } else {
      setFormData({
        year: "",
        title: "",
        description: "",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      setFormData({ year: "", title: "", description: "" })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-amber-900">{initialData ? "Edit Milestone" : "Add New Milestone"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="year" className="text-amber-800">
              Year
            </Label>
            <Input
              id="year"
              type="text"
              value={formData.year}
              onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))}
              placeholder="e.g., 2012"
              required
              className="focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <Label htmlFor="title" className="text-amber-800">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Company Founded"
              required
              className="focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <Label htmlFor="description" className="text-amber-800">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this milestone..."
              required
              rows={4}
              className="focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-amber-600 hover:bg-amber-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Add"} Milestone
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
