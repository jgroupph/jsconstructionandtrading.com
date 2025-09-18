"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Award, Shield, Users, Lightbulb, Heart, Target } from "lucide-react"

interface CoreValue {
  id: string
  title: string
  description: string
  icon: string
  createdAt: Date
}

interface CoreValueFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<CoreValue, "id" | "createdAt">) => Promise<void>
  initialData?: CoreValue | null
}

const iconOptions = [
  { value: "Award", label: "Award", icon: Award },
  { value: "Shield", label: "Shield", icon: Shield },
  { value: "Users", label: "Users", icon: Users },
  { value: "Lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "Heart", label: "Heart", icon: Heart },
  { value: "Target", label: "Target", icon: Target },
]

export function CoreValueForm({ isOpen, onClose, onSubmit, initialData }: CoreValueFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "Award",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        icon: initialData.icon,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        icon: "Award",
      })
    }
  }, [initialData, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await onSubmit(formData)
      setFormData({ title: "", description: "", icon: "Award" })
    } catch (error) {
      console.error("Error submitting form:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedIcon = iconOptions.find((option) => option.value === formData.icon)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#f7f2ec] border border-[#e2d6c3] rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-[#4c2c13]">{initialData ? "Edit Core Value" : "Add New Core Value"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title" className="text-[#4c2c13]">
              Title
            </Label>
            <Input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., EXCELLENCE"
              required
              className="focus:ring-[#4c2c13] focus:border-[#4c2c13] bg-[#f7f2ec] text-[#4c2c13] border border-[#e2d6c3]"
            />
          </div>
          <div>
            <Label htmlFor="icon" className="text-[#4c2c13]">
              Icon
            </Label>
            <Select value={formData.icon} onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}>
              <SelectTrigger className="focus:ring-[#4c2c13] focus:border-[#4c2c13] bg-[#f7f2ec] text-[#4c2c13] border border-[#e2d6c3]">
                <SelectValue>
                  <div className="flex items-center gap-2">
                    {selectedIcon && <selectedIcon.icon className="w-4 h-4 text-[#4c2c13]" />}
                    {selectedIcon?.label}
                  </div>
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="bg-[#f7f2ec] text-[#4c2c13] border border-[#e2d6c3]">
                {iconOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <option.icon className="w-4 h-4 text-[#4c2c13]" />
                      {option.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description" className="text-[#4c2c13]">
              Description
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this core value..."
              required
              rows={4}
              className="focus:ring-[#4c2c13] focus:border-[#4c2c13] bg-[#f7f2ec] text-[#4c2c13] border border-[#e2d6c3]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
              className="border border-[#e2d6c3] text-[#4c2c13] bg-[#f7f2ec] hover:bg-[#e2d6c3]"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-[#4c2c13] hover:bg-[#3a210e] text-white"
            >
              {isSubmitting ? "Saving..." : initialData ? "Update" : "Add"} Core Value
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
