"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Truck, Award, Building2, Settings, LogOut, FileText, Target, Heart, Phone } from "lucide-react"
import { LogoutConfirmDialog } from "@/components/admin/logout-confirm-dialog"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Heavy Equipment", href: "/admin/equipment", icon: Truck },
  { name: "Trusted Brands", href: "/admin/brands", icon: Award },
  { name: "Featured Projects", href: "/admin/projects", icon: Building2 },
  { name: "Milestones", href: "/admin/milestones", icon: FileText },
  { name: "Mission & Vision", href: "/admin/mission-vision", icon: Target },
  { name: "Core Values", href: "/admin/core-values", icon: Heart },
  { name: "Contact Info", href: "/admin/contacts", icon: Phone },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

interface SidebarProps {
  onNavigate?: () => void
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
  }

  return (
    <div className="w-64 h-full lg:h-screen shadow-xl flex flex-col" style={{ backgroundColor: "#3A2D28" }}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-8 flex-shrink-0">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo-homepage-nQN1zsKuzfTtrr9Ql1tZAxCN9UFRIk.png"
            alt="J's Prime Construction"
            className="h-12 w-12 mr-3"
          />
          <div>
            <h2 className="font-bold text-lg" style={{ color: "#F1EDE6" }}>
              J's Prime
            </h2>
            <p className="text-sm" style={{ color: "#EBE3DB" }}>
              Construction CMS
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive ? "shadow-lg" : "",
                )}
                style={{
                  backgroundColor: isActive ? "#A48374" : "transparent",
                  color: isActive ? "#F1EDE6" : "#EBE3DB",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "#A48374"
                    e.currentTarget.style.color = "#F1EDE6"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.backgroundColor = "transparent"
                    e.currentTarget.style.color = "#EBE3DB"
                  }
                }}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={handleLogoutClick}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200"
            style={{ color: "#EBE3DB" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#A48374"
              e.currentTarget.style.color = "#F1EDE6"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent"
              e.currentTarget.style.color = "#EBE3DB"
            }}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Sign Out
          </button>
        </div>

        {/* Logout Confirmation Dialog */}
        <LogoutConfirmDialog
          isOpen={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
        />
      </div>
    </div>
  )
}
