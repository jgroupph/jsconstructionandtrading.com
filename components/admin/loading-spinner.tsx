"use client"

import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
  text?: string
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  }

  return (
    <div className={cn("flex items-center justify-center space-x-2", className)}>
      <div
        className={cn("animate-spin rounded-full border-2 border-amber-200 border-t-amber-600", sizeClasses[size])}
      />
      {text && (
        <span className="text-amber-700 text-sm flex items-center">
          {text}
          <span className="loading-dots ml-1">
            <span>.</span>
            <span>.</span>
            <span>.</span>
          </span>
        </span>
      )}
    </div>
  )
}
