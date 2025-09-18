"use client"

export function ConstructionBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-5">
      <div className="absolute top-10 left-10 w-32 h-32 border-4 border-amber-400 rotate-45 animate-construction-pulse" />
      <div
        className="absolute top-1/3 right-20 w-24 h-24 border-4 border-amber-500 rotate-12 animate-construction-pulse"
        style={{ animationDelay: "1s" }}
      />
      <div
        className="absolute bottom-20 left-1/4 w-20 h-20 border-4 border-amber-600 -rotate-12 animate-construction-pulse"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-1/3 right-1/3 w-28 h-28 border-4 border-amber-400 rotate-45 animate-construction-pulse"
        style={{ animationDelay: "0.5s" }}
      />
    </div>
  )
}
