import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 border-2 border-amber-200 rotate-45 animate-construction-pulse opacity-20" />
        <div
          className="absolute bottom-20 right-20 w-48 h-48 border-2 border-orange-200 -rotate-12 animate-construction-pulse opacity-20"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-10 w-32 h-32 border-2 border-amber-300 rotate-12 animate-construction-pulse opacity-20"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="text-center space-y-6 relative z-10 animate-fade-in-up">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-amber-900 animate-slide-in-left">J's Prime Construction</h1>
          <p className="text-lg text-amber-700 animate-slide-in-right" style={{ animationDelay: "200ms" }}>
            Content Management System
          </p>
        </div>
        <div className="animate-scale-in" style={{ animationDelay: "400ms" }}>
          <Link href="/admin">
            <Button className="bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 text-lg construction-hover focus-construction">
              Access Admin Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
