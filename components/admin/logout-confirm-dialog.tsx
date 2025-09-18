"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LogOut } from "lucide-react"
import { showSuccessToast, showErrorToast } from "@/lib/toast-utils"
import { useRouter } from "next/navigation"

interface LogoutConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function LogoutConfirmDialog({ isOpen, onClose }: LogoutConfirmDialogProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoggingOut(true)
    
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
      })

      if (res.ok) {
        showSuccessToast("Logged out successfully")
        router.push("/login")
        onClose()
      } else {
        showErrorToast("Failed to logout")
      }
    } catch (error) {
      showErrorToast("Failed to logout")
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#3A2D28]">
            <LogOut className="h-5 w-5 text-red-600" />
            Confirm Logout
          </DialogTitle>
          <DialogDescription className="text-[#A48374]">
            Are you sure you want to logout? You'll need to sign in again to access the admin panel.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoggingOut}
            className="border-[#D1C7BD] text-[#3A2D28] hover:bg-[#EBE3DB]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            variant="destructive"
            className="bg-red-600 hover:bg-red-700"
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
