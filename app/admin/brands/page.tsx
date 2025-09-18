"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Award } from "lucide-react"
import { BrandForm } from "@/components/admin/brand-form"
import { DeleteConfirmDialog } from "@/components/admin/delete-confirm-dialog"
import { showSuccessToast, showErrorToast, toastMessages } from "@/lib/toast-utils"

export interface Brand {
  id: string
  brand_name: string
  brand_img: string
  brand_img_file?: File | string | null
  createdAt: Date | null
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null)
  const [deleteBrand, setDeleteBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch brands from API when component mounts
    const fetchBrands = async () => {
      try {
        const res = await fetch("/api/brands")
        if (!res.ok) {
          showErrorToast(toastMessages.fetchFailed)
          return
        }
        const data: any = await res.json()
        // Sort brands by createdAt descending
        data.sort((a:any, b:any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        setBrands(data.map((b: any) => ({
          ...b,
          createdAt: b.createdAt ? new Date(b.createdAt) : new Date(),
          brand_img_file: b.brandImage || null,
          brand_img: b.brandImage || "",
          brand_name: b.brandName || "",
          id: b._id.toString() || b.id.toString()
        })))

      }
      catch (error) {
        console.error("Error fetching brands:", error)
        showErrorToast(toastMessages.fetchFailed)
      } finally {
        setLoading(false)
      }
    }

    setLoading(true)
    fetchBrands()
  }, [])

  const handleAddBrand = async (newBrand: Omit<Brand, "id" | "createdAt">) => {
    try {
      const formData = new FormData()
      formData.append("brand_name", newBrand.brand_name)
      formData.append("brand_img", newBrand.brand_img_file as File)

      const res = await fetch("/api/brands", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.brandAddFailed)
        throw new Error(error.error || "Failed to add brand")
      }

      const createdBrand = await res.json();
      
      setBrands((prev) => [{
        id: createdBrand.id,
        brand_name: createdBrand.brandName,
        brand_img: createdBrand.brandImage,
        brand_img_file: createdBrand.brandImage,
        createdAt: createdBrand.createdAt ? new Date(createdBrand.createdAt) : new Date(),
      }, ...prev])
      
      setIsFormOpen(false)
      showSuccessToast(toastMessages.brandAddedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.brandAddFailed)
      throw error
    }
  }

  const handleEditBrand = async (updatedBrand: Omit<Brand, "id" | "createdAt">) => {
    if (!editingBrand) return

    try {
      const formData = new FormData()
      formData.append("brand_name", updatedBrand.brand_name)
      formData.append("old_brand_img", editingBrand.brand_img_file as File | string);
      formData.append("createdAt", editingBrand.createdAt ? editingBrand.createdAt.toISOString() : new Date().toISOString());
      if (updatedBrand.brand_img_file instanceof File) {
        formData.append("brand_img_file", updatedBrand.brand_img_file as File);
      }

      const res = await fetch(`/api/brands/${editingBrand.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.brandUpdateFailed)
        throw new Error(error.error || "Failed to update brand")
      }

      const brandUpdated = await res.json();

      setBrands((prev) => prev.map((item) => (item.id === editingBrand.id ? {
        id: brandUpdated.id,
        brand_name: brandUpdated.brandName,
        brand_img: brandUpdated.brandImage,
        brand_img_file: brandUpdated.brandImage,
        createdAt: editingBrand.createdAt } : item)))
      
      setEditingBrand(null)
      showSuccessToast(toastMessages.brandUpdatedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.brandUpdateFailed)
      throw error
    }
  }

  const handleDeleteBrand = async (id: string) => {
    try {
      const res = await fetch(`/api/brands/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || toastMessages.brandDeleteFailed)
        throw new Error(error.error || "Failed to delete brand")
      }

      setBrands((prev) => prev.filter((item) => item.id !== id))
      setDeleteBrand(null)
      showSuccessToast(toastMessages.brandDeletedSuccess)
      
    } catch (error) {
      showErrorToast(toastMessages.brandDeleteFailed)
      throw error
    }
  }

  const openEditForm = (brand: Brand) => {
    setEditingBrand(brand)
  }

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#3A2D28]">Trusted Brands Management</h1>
          <p className="text-[#A48374]">Manage your trusted partner brands and logos</p>
        </div>

        <div className="flex justify-start sm:justify-end">
          <Button
            onClick={() => setIsFormOpen(true)}
            className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6] w-full sm:w-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Brand
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {loading ? (
          <div className="col-span-full flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-[#CBAD8D] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[#A48374] text-sm">Loading brands...</p>
            </div>
          </div>
        ) : (
          brands.map((brand, index) => (
            <Card
              key={brand.id}
              className="border-[#D1C7BD] hover:shadow-lg transition-all duration-300 animate-slide-in-left group bg-[#F1EDE6]"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="pb-3">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-white border border-[#D1C7BD] p-4">
                  <img
                    src={process.env.NEXT_PUBLIC_R2_PUBLIC_URL + "/" + brand.brand_img || "/placeholder.svg"}
                    alt={brand.brand_name}
                    className="object-contain w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm text-[#3A2D28] truncate">
                    {brand.brand_name}</CardTitle>
                    <Badge variant="secondary" className="bg-[#CBAD8D] text-[#3A2D28] text-xs">
                      <Award className="h-2 w-2 mr-1" />
                      Brand
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#D1C7BD]">
                  <span className="text-xs text-[#A48374]">Added {brand?.createdAt?.toLocaleDateString() }</span>
                  <div className="flex space-x-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openEditForm(brand)}
                      className="border-[#CBAD8D] text-[#3A2D28] hover:bg-[#EBE3DB] h-7 w-7 p-0"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteBrand(brand)}
                      className="border-red-300 text-red-700 hover:bg-red-50 h-7 w-7 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!loading && brands.length === 0 && (
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-[#CBAD8D] mb-4" />
            <h3 className="text-lg font-medium text-[#3A2D28] mb-2">No brands found</h3>
            <p className="text-[#A48374] text-center mb-4">Get started by adding your first trusted brand partner.</p>
            <Button onClick={() => setIsFormOpen(true)} className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6]">
              <Plus className="h-4 w-4 mr-2" />
              Add Brand
            </Button>
          </CardContent>
        </Card>
      )}

      <BrandForm
        isOpen={isFormOpen || !!editingBrand}
        onClose={() => {
          setIsFormOpen(false)
          setEditingBrand(null)
        }}
        onSubmit={editingBrand ? handleEditBrand : handleAddBrand}
        initialData={editingBrand}
        mode={editingBrand ? "edit" : "add"}
      />

      <DeleteConfirmDialog
        isOpen={!!deleteBrand}
        onClose={() => setDeleteBrand(null)}
        onConfirm={async () => {
          if (deleteBrand) {
            await handleDeleteBrand(deleteBrand.id)
          }
        }}
        title="Delete Brand"
        description={`Are you sure you want to delete "${deleteBrand?.brand_name}"? This action cannot be undone.`}
      />
    </div>
  )
}
