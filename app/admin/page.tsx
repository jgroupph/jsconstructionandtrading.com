"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Truck, Award, Clock, Target, Users, Settings, LogOut } from "lucide-react"
import { ScrollAnimation } from "@/components/admin/scroll-animation"
import { LogoutConfirmDialog } from "@/components/admin/logout-confirm-dialog"
import { showErrorToast } from "@/lib/toast-utils"

interface DashboardData {
  equipment: number
  brands: number
  projects: number
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    equipment: 0,
    brands: 0,
    projects: 0
  })
  const [loading, setLoading] = useState(true)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("/api/dashboard")
        if (!res.ok) {
          showErrorToast("Failed to fetch dashboard data")
          return
        }
        const data = await res.json()
        setDashboardData(data)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        showErrorToast("Failed to fetch dashboard data")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])
  return (
    <div className="space-y-8">
      <ScrollAnimation>
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-[#3A2D28]">Admin Dashboard</h1>
          <p className="text-[#A48374]">Manage your construction website content</p>
        </div>
      </ScrollAnimation>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { 
            title: "Heavy Equipment", 
            value: loading ? "..." : dashboardData.equipment.toString(), 
            desc: "Active equipment listings", 
            icon: Truck 
          },
          { 
            title: "Trusted Brands", 
            value: loading ? "..." : dashboardData.brands.toString(), 
            desc: "Partner brands", 
            icon: Award 
          },
          { 
            title: "Featured Projects", 
            value: loading ? "..." : dashboardData.projects.toString(), 
            desc: "Showcase projects", 
            icon: Building2 
          },
        ].map((item, index) => (
          <ScrollAnimation key={item.title} delay={index * 100}>
            <Card className="border-[#D1C7BD] construction-hover bg-[#F1EDE6]">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#3A2D28]">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-[#A48374]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#3A2D28]">{item.value}</div>
                <p className="text-xs text-[#A48374]">{item.desc}</p>
              </CardContent>
            </Card>
          </ScrollAnimation>
        ))}
      </div>

      <div className="w-full">
        <ScrollAnimation delay={200}>
          <Card className="border-[#D1C7BD] construction-hover bg-[#F1EDE6]">
            <CardHeader>
              <CardTitle className="text-[#3A2D28]">Quick Actions</CardTitle>
              <CardDescription className="text-[#A48374]">Manage your website content efficiently</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {[
                  { href: "/admin/equipment", icon: Truck, text: "Manage Heavy Equipment" },
                  { href: "/admin/brands", icon: Award, text: "Manage Trusted Brands" },
                  { href: "/admin/projects", icon: Building2, text: "Manage Featured Projects" },
                  { href: "/admin/milestones", icon: Target, text: "Manage Company Milestones" },
                  { href: "/admin/mission-vision", icon: Users, text: "Update Mission & Vision" },
                  { href: "/admin/core-values", icon: Clock, text: "Manage Core Values" },
                  { href: "/admin/settings", icon: Settings, text: "Account Settings" },
                  { href: "#", icon: LogOut, text: "Logout", isLogout: true },
                ].map((action, index) => {
                  if (action.isLogout) {
                    return (
                      <button
                        key="logout"
                        onClick={() => setIsLogoutDialogOpen(true)}
                        className="flex items-center p-3 rounded-lg border border-[#D1C7BD] construction-hover focus-construction hover:bg-red-50 hover:border-red-200 transition-colors w-full text-left"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <action.icon className="h-5 w-5 mr-3 text-red-500" />
                        <span className="font-medium text-red-600">
                          {action.text}
                        </span>
                      </button>
                    )
                  }
                  
                  return (
                    <a
                      key={action.href}
                      href={action.href}
                      className="flex items-center p-3 rounded-lg border border-[#D1C7BD] construction-hover focus-construction hover:bg-[#EBE3DB] transition-colors"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <action.icon className="h-5 w-5 mr-3 text-[#A48374]" />
                      <span className="font-medium text-[#3A2D28]">
                        {action.text}
                      </span>
                    </a>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Logout Confirmation Dialog */}
        <LogoutConfirmDialog
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
        />
      </div>
    </div>
  )
}
