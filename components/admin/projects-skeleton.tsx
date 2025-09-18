import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden shadow-lg"
        >
          <CardContent className="p-0">
            <div className="relative overflow-hidden group">
              <Skeleton className="h-64 w-full" />
              <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <div className="p-6 space-y-3">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function BrandsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 items-center">
      {Array.from({ length: 7 }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm"
        >
          <Skeleton className="h-12 w-20" />
        </div>
      ))}
    </div>
  )
}
