"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface MissionVision {
  mission: string
  vision: string
  updatedAt: Date
}

interface MissionVisionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<MissionVision, "updatedAt">) => Promise<void>
  initialData: MissionVision
}

export function MissionVisionForm({ isOpen, onClose, onSubmit, initialData }: MissionVisionFormProps) {
  const [formData, setFormData] = useState({
    mission: "",
    vision: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        mission: initialData.mission,
        vision: initialData.vision,
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-amber-900">Edit Mission & Vision</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="mission" className="text-amber-800 text-base font-semibold">
              Mission Statement
            </Label>
            <p className="text-sm text-gray-600 mb-2">Define your company's purpose and what you aim to achieve</p>
            <Textarea
              id="mission"
              value={formData.mission}
              onChange={(e) => setFormData((prev) => ({ ...prev, mission: e.target.value }))}
              placeholder="Enter your mission statement..."
              required
              rows={4}
              className="focus:ring-amber-500 focus:border-amber-500"
            />
          </div>
          <div>
            <Label htmlFor="vision" className="text-amber-800 text-base font-semibold">
              Vision Statement
            </Label>
            <p className="text-sm text-gray-600 mb-2">Describe your company's future aspirations and goals</p>
            <Textarea
              id="vision"
              value={formData.vision}
              onChange={(e) => setFormData((prev) => ({ ...prev, vision: e.target.value }))}
              placeholder="Enter your vision statement..."
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
              disabled={isSubmitting}
              className="bg-amber-600 hover:bg-amber-700"
            >
              {isSubmitting ? "Updating..." : "Update Mission & Vision"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
