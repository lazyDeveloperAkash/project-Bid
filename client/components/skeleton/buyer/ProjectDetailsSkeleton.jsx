import { Card, CardContent, CardHeader } from "@/components/ui/card"

const Skeleton = ({className}) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
)

export default function ProjectDetailsSkeleton() {
  return (
    <div className="container py-10 mx-auto">
      <div className="flex items-center mb-6 gap-4">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-6 w-24 ml-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-40 bg-muted/60" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full bg-muted/60" />
                <Skeleton className="h-4 w-full bg-muted/60" />
                <Skeleton className="h-4 w-2/3 bg-muted/60" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32 bg-muted/60" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-32 bg-muted/60" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-2">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-64 bg-muted/60" />
            </CardHeader>
            <CardContent className="space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-24 bg-muted/60" />
                    </div>
                    <Skeleton className="h-4 w-16 bg-muted/60" />
                  </div>
                  <Skeleton className="h-4 w-full bg-muted/60" />
                  <Skeleton className="h-4 w-2/3 bg-muted/60" />
                  <div className="flex justify-end">
                    <Skeleton className="h-9 w-24" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-40" />
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-20 bg-muted/60" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full bg-muted/60" />
              <Skeleton className="h-4 w-2/3 bg-muted/60 mt-2" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
