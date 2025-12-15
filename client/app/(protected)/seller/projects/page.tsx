"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search } from "lucide-react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { asFetchProjects } from "@/redux/action/projectAction"
import { Project } from "@/redux/reducers/projectReducer"
import ProjectSkeleton from "@/components/skeleton/seller/ProjectSkeleton"

export default function FindProjectsPage() {
  const dispatch = useDispatch()
  const { projects, isLoading } = useSelector((state: any) => state.projects)
  const { user } = useSelector((state: any) => state.user)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredProjects, setFilteredProjects] = useState(projects)

  useEffect(() => {
    dispatch(asFetchProjects() as any)
  }, [dispatch])

  useEffect(() => {
    // Filter out projects that are not pending or where the user has already bid
    const availableProjects = projects.filter(
      (project: Project) => project.status === "PENDING" && !project.bids?.some((bid) => bid.sellerId === user?.id),
    )

    if (searchTerm) {
      setFilteredProjects(
        availableProjects.filter(
          (project: Project) =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      )
    } else {
      setFilteredProjects(availableProjects)
    }
  }, [projects, searchTerm, user?.id])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="container py-10 mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Find Projects</h1>
          <p className="text-muted-foreground">Browse available projects and place your bids</p>
        </div>
        <form onSubmit={handleSearch} className="w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search projects..."
              className="pl-8 w-full md:w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </form>
      </div>

      {isLoading ? (
        <ProjectSkeleton/>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No projects found</CardTitle>
            <CardDescription>
              {searchTerm
                ? "No projects match your search criteria. Try a different search term."
                : "There are no available projects at the moment. Check back later for new opportunities."}
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project: Project) => (
            <Link key={project.id} href={`/seller/projects/${project.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                      <CardDescription className="mt-1">
                        Budget: ₹{project.budgetMin} - ₹{project.budgetMax}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                    >
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{project.description}</p>
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Posted: {formatDate(project.createdAt)}</span>
                    <span>Deadline: {formatDate(project.deadline)}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
