"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, FileText, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { asFetchBuyerProjects } from "@/redux/action/projectAction"
import { Project } from "@/redux/reducers/projectReducer"

export default function BuyerDashboard() {
  const dispatch = useDispatch()
  const { user } = useSelector((state: any) => state.user)
  const { projects, isLoading } = useSelector((state: any) => state.projects)

  useEffect(() => {
    dispatch(asFetchBuyerProjects() as any)
  }, [dispatch])

  const pendingProjects = projects.filter((project: Project) => project.status === "PENDING")
  const activeProjects = projects.filter((project: Project) => project.status === "IN_PROGRESS");
  const confirmProjects = projects.filter((project: Project) => project.status === "CONFIRM");
  const completedProjects = projects.filter((project: Project) => project.status === "COMPLETED")

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
            Pending
          </Badge>
        )
      case "IN_PROGRESS":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            In Progress
          </Badge>
        )
        case "CONFIRM":
        return (
          <Badge variant="outline" className="bg-blue-100 text-green-600 dark:bg-green-700 dark:text-green-200">
            Submited
          </Badge>
        )
      case "COMPLETED":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Completed
          </Badge>
        )

        case "CANCELLED":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-muted-foreground">Manage your projects and track their progress</p>
        </div>
        <Link href="/buyer/create-project">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects.length}</div>
            <p className="text-xs text-muted-foreground">All your posted projects</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects.length}</div>
            <p className="text-xs text-muted-foreground">Projects currently in progress</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Waiting For Confirmation</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{confirmProjects.length}</div>
            <p className="text-xs text-muted-foreground">Project approved by seller</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed Projects</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedProjects.length}</div>
            <p className="text-xs text-muted-foreground">Successfully delivered projects</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="confirm">Confirm</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <TabsContent value="all">
              {projects.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No projects yet</CardTitle>
                    <CardDescription>
                      You haven&apos;t created any projects yet. Create your first project to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/buyer/create-project">
                      <Button>Create Your First Project</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {projects.map((project: Project, idx: number) => (
                    <Link key={idx} href={`/buyer/projects/${project.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription className="mt-1">
                                Budget: ₹{project.budgetMin} - ₹{project.budgetMax}
                              </CardDescription>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Deadline: {formatDate(project.deadline)}</span>
                            <span>Bids: {project?._count?.bids || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="pending">
              {pendingProjects.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No pending projects</CardTitle>
                    <CardDescription>You don&apos;t have any pending projects at the moment.</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pendingProjects.map((project: Project, idx: number) => (
                    <Link key={idx} href={`/buyer/projects/${project.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription className="mt-1">
                                Budget: ${project.budgetMin} - ${project.budgetMax}
                              </CardDescription>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Deadline: {formatDate(project.deadline)}</span>
                            <span>Bids: {project?._count?.bids || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="active">
              {activeProjects.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No active projects</CardTitle>
                    <CardDescription>You don&apos;t have any active projects at the moment.</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {activeProjects.map((project: Project) => (
                    <Link key={project.id} href={`/buyer/projects/${project.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription className="mt-1">
                                Budget: ${project.budgetMin} - ${project.budgetMax}
                              </CardDescription>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Deadline: {formatDate(project.deadline)}</span>
                            <span>Started: {project.updatedAt && formatDate(project.updatedAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="confirm">
              {confirmProjects.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No Confirm projects</CardTitle>
                    <CardDescription>You don&apos;t have any Confirm projects at the moment.</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {confirmProjects.map((project: Project, idx: number) => (
                    <Link key={idx} href={`/buyer/projects/${project.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription className="mt-1">
                                Budget: ${project.budgetMin} - ${project.budgetMax}
                              </CardDescription>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Deadline: {formatDate(project.deadline)}</span>
                            <span>Started: {project.updatedAt && formatDate(project.updatedAt)}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="completed">
              {completedProjects.length === 0 ? (
                <Card>
                  <CardHeader>
                    <CardTitle>No completed projects</CardTitle>
                    <CardDescription>You don&apos;t have any completed projects yet.</CardDescription>
                  </CardHeader>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {completedProjects.map((project: Project, idx: number) => (
                    <Link key={idx} href={`/buyer/projects/${project.id}`}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{project.title}</CardTitle>
                              <CardDescription className="mt-1">
                                Budget: ${project.budgetMin} - ${project.budgetMax}
                              </CardDescription>
                            </div>
                            {getStatusBadge(project.status)}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.description}</p>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Completed: {project.updatedAt && formatDate(project.updatedAt)}</span>
                            <span>Deliverables: {project.deliverables?.length || 0}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  )
}
