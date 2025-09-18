"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, Key, LogOut } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"
import { LogoutConfirmDialog } from "@/components/admin/logout-confirm-dialog"
import { ScrollAnimation } from "@/components/admin/scroll-animation"

export default function SettingsPage() {
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showErrorToast("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      showErrorToast("Password must be at least 6 characters long")
      return
    }

    setIsChangingPassword(true)

    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        showErrorToast(error.error || "Failed to change password")
        return
      }

      showSuccessToast("Password changed successfully")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      })
    } catch (error) {
      showErrorToast("Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  const handleLogoutClick = () => {
    setIsLogoutDialogOpen(true)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-[#3A2D28]">Account Settings</h1>
        <p className="text-[#A48374]">Manage your account preferences and security</p>
      </div>

      {/* Account Information */}
      <ScrollAnimation>
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#3A2D28]">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-[#3A2D28]">Username</Label>
              <Input
                id="username"
                value="jsprime-admin"
                disabled
                className="bg-[#EBE3DB] border-[#D1C7BD] text-[#A48374]"
              />
              <p className="text-sm text-[#A48374]">Username cannot be changed</p>
            </div>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Change Password */}
      <ScrollAnimation delay={100}>
        <Card className="border-[#D1C7BD] bg-[#F1EDE6]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[#3A2D28]">
              <Key className="h-5 w-5" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-[#3A2D28]">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="border-[#D1C7BD] focus:border-[#A48374]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-[#3A2D28]">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="border-[#D1C7BD] focus:border-[#A48374]"
                  required
                  minLength={6}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-[#3A2D28]">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="border-[#D1C7BD] focus:border-[#A48374]"
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-[#3A2D28] hover:bg-[#A48374] text-[#F1EDE6]"
              >
                {isChangingPassword ? "Changing Password..." : "Change Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </ScrollAnimation>

      <Separator className="bg-[#D1C7BD]" />

      {/* Logout Section */}
      <ScrollAnimation delay={200}>
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <LogOut className="h-5 w-5" />
              Logout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-red-600">
              This will log you out of your account and redirect you to the login page.
            </p>
            <Button
              onClick={handleLogoutClick}
              disabled={false}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700"
            >
              Logout
            </Button>
          </CardContent>
        </Card>
      </ScrollAnimation>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
      />
    </div>
  )
}
