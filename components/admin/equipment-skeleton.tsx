import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function EquipmentSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card
          key={index}
          className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <CardContent className="p-0">
            <div className="relative overflow-hidden group">
              <Skeleton className="h-48 w-full" />
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-28" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
