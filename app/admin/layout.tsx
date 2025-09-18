"use client"

import type React from "react"
import { useState } from "react"
import { Sidebar } from "@/components/admin/sidebar"
import { ConstructionBackground } from "@/components/admin/construction-background"
import { Button } from "@/components/ui/button"
import { Toaster } from "@/components/ui/toaster"
import { Menu, X } from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const closeSidebar = () => {
    setSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-stone-50 relative">
      <ConstructionBackground />
      <div className="flex relative z-10">
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <div
          className={`
          fixed lg:fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
          lg:h-screen lg:overflow-y-auto
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
        >
          <Sidebar onNavigate={closeSidebar} />
        </div>

        <main className="flex-1 lg:ml-64 min-h-screen">
          <div className="lg:hidden p-4 bg-white border-b border-stone-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-stone-700 hover:bg-stone-100"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="ml-2 font-medium">Menu</span>
            </Button>
          </div>

          <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  )
}
