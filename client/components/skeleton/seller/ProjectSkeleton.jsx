import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function ProjectSkeleton() {
  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
          <div className="h-4 w-72 bg-muted/60 rounded-md animate-pulse" />
        </div>
        <div className="h-10 w-full md:w-[300px] bg-muted rounded-md animate-pulse" />
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="h-full">
            <CardHeader className="pb-2 space-y-3">
              <div className="flex justify-between items-start gap-3">
                <div className="space-y-2 w-full">
                  <div className="h-5 w-3/4 bg-muted rounded-md animate-pulse" />
                  <div className="h-4 w-1/2 bg-muted/60 rounded-md animate-pulse" />
                </div>
                <div className="h-6 w-16 bg-muted rounded-full animate-pulse" />
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted/60 rounded-md animate-pulse" />
                <div className="h-4 w-full bg-muted/60 rounded-md animate-pulse" />
                <div className="h-4 w-2/3 bg-muted/60 rounded-md animate-pulse" />
              </div>

              <div className="flex justify-between">
                <div className="h-3 w-24 bg-muted/60 rounded-md animate-pulse" />
                <div className="h-3 w-24 bg-muted/60 rounded-md animate-pulse" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
