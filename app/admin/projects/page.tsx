"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Building2, MapPin, Images } from "lucide-react"
import { ProjectForm } from "@/components/admin/project-form"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { showSuccessToast, showErrorToast, toastMessages } from "@/lib/toast-utils"

export interface Project {
  _id?: string
  id?: string
  title: string
  location: string
  images: string[]
  createdAt: Date
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [deleteProject, setDeleteProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data)
      } else {
        showErrorToast(toastMessages.fetchFailed)
      }
    } catch (error) {
      showErrorToast(toastMessages.fetchFailed)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProject = async (formData: FormData) => {
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const newProject = await response.json()
        setProjects((prev) => [newProject, ...prev])
        setIsFormOpen(false)
        showSuccessToast(toastMessages.projectAddedSuccess)
      } else {
        const error = await response.json()
        showErrorToast(error.error || toastMessages.projectAddFailed)
        throw new Error(error.error || "Failed to add project")
      }
    } catch (error) {
      showErrorToast(toastMessages.projectAddFailed)
      throw error
    }
  }

  const handleEditProject = async (formData: FormData) => {
    if (!editingProject) return

    try {
      const projectId = editingProject._id || editingProject.id
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        body: formData,
      })

      if (response.ok) {
        const updatedProject = await response.json()
        setProjects((prev) =>
          prev.map((item) => ((item._id || item.id) === projectId ? { ...item, ...updatedProject } : item)),
        )
        setEditingProject(null)
        showSuccessToast(toastMessages.projectUpdatedSuccess)
      } else {
        const error = await response.json()
        showErrorToast(error.error || toastMessages.projectUpdateFailed)
        throw new Error(error.error || "Failed to update project")
      }
    } catch (error) {
      showErrorToast(toastMessages.projectUpdateFailed)
      throw error
    }
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProjects((prev) => prev.filter((item) => (item._id || item.id) !== projectId))
        setDeleteProject(null)
        showSuccessToast(toastMessages.projectDeletedSuccess)
      } else {
        const error = await response.json()
        showErrorToast(error.error || toastMessages.projectDeleteFailed)
        throw new Error(error.error || "Failed to delete project")
      }
    } catch (error) {
      showErrorToast(toastMessages.projectDeleteFailed)
      throw error
    }
  }

  const openEditForm = (project: Project) => {
    setEditingProject(project)
  }

  if (loading) {
    return (
      <div className="space-y-8 animate-fade-in-up">
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-[#3A2D28]">Featured Projects Management</h1>
            <p className="text-[#A48374]">Showcase your construction and renovation projects</p>
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
          <h1 className="text-3xl font-bold text-[#3A2D28]">Featured Projects Management</h1>
          <p className="text-[#A48374]">Showcase your construction and renovation projects</p>
        </div>

        <div className="flex justify-start lg:justify-end">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6] w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project, index) => (
          <Card
            key={project._id || project.id}
            className="border-[#D1C7BD] hover:shadow-lg transition-all duration-300 animate-slide-in-left overflow-hidden bg-[#F1EDE6]"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardHeader className="pb-3">
              <div className="aspect-[2/1] relative overflow-hidden rounded-lg bg-[#EBE3DB]">
                <div className="grid grid-cols-2 gap-1 h-full">
                  {project.images.slice(0, 2).map((image, idx) => (
                    <div key={idx} className="relative overflow-hidden">
                      <img
                        src={`${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${image}` || "/placeholder.svg"}
                        alt={`${project.title} - Image ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg text-[#3A2D28] leading-tight">{project.title}</CardTitle>
                  <Badge variant="secondary" className="bg-[#CBAD8D] text-[#3A2D28] shrink-0">
                    <Building2 className="h-3 w-3 mr-1" />
                    Project
                  </Badge>
                </div>
                <div className="flex items-center text-[#A48374] text-sm">
                  <MapPin className="h-4 w-4 mr-1 shrink-0" />
                  <span className="truncate">{project.location}</span>
                </div>
                <div className="flex items-center text-[#A48374] text-sm">
                  <Images className="h-4 w-4 mr-1" />
                  <span>{project.images.length} images</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#D1C7BD]">
                <span className="text-xs text-[#A48374]">Added {new Date(project.createdAt).toLocaleDateString()}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditForm(project)}
                    className="border-[#CBAD8D] text-[#3A2D28] hover:bg-[#EBE3DB]"
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteProject(project)}
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

      {projects.length === 0 && !loading && (
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-[#CBAD8D] mb-4" />
            <h3 className="text-lg font-medium text-[#3A2D28] mb-2">No projects found</h3>
            <p className="text-[#A48374] text-center mb-4">
              Get started by adding your first featured construction project.
            </p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6]">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          </CardContent>
        </Card>
      )}

      <ProjectForm
        isOpen={isFormOpen || !!editingProject}
        onClose={() => {
          setIsFormOpen(false)
          setEditingProject(null)
        }}
        onSubmit={editingProject ? handleEditProject : handleAddProject}
        initialData={editingProject}
        mode={editingProject ? "edit" : "add"}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteProject}
        onClose={() => setDeleteProject(null)}
        onConfirm={async () => {
          if (deleteProject) {
            await handleDeleteProject(deleteProject._id || deleteProject.id!)
          }
        }}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteProject?.title}"? This action cannot be undone.`}
      />
    </div>
  )
}
