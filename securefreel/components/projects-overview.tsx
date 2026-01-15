"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialProjects: Project[] = [
  { id: 1, title: "Web3 Marketplace System Development", status: "open", applicants: [] },
  { id: 2, title: "DeFi Dashboard Improvement", status: "ongoing", applicants: [] },
  { id: 3, title: "NFT Gallery Website Development", status: "completed", applicants: [] },
  { id: 4, title: "Crypto Wallet Assistance", status: "ongoing", applicants: [] },
  { id: 5, title: "P2P Trader needed for 1 Week Project", status: "open", applicants: [] },
  { id: 6, title: "Blockchain-based Supply Chain Management", status: "open", applicants: [] },
  { id: 7, title: "Smart Contract Development for Gaming", status: "ongoing", applicants: [] },
  { id: 8, title: "Decentralized Finance (DeFi) Lending Platform", status: "completed", applicants: [] },
  { id: 9, title: "Cryptocurrency Trading Bot Development", status: "ongoing", applicants: [] },
  { id: 10, title: "Non-Fungible Token (NFT) Marketplace Development", status: "open", applicants: [] },
  { id: 11, title: "Cross-chain Bridge Implementation", status: "open", applicants: [] },
  { id: 12, title: "DAO Governance Platform Development", status: "ongoing", applicants: [] },
  { id: 13, title: "Zero-Knowledge Proof Integration", status: "completed", applicants: [] },
  { id: 14, title: "Metaverse Asset Management System", status: "open", applicants: [] },
  { id: 15, title: "Layer 2 Scaling Solution Development", status: "ongoing", applicants: [] },
  { id: 16, title: "Decentralized Identity System", status: "completed", applicants: [] },
  { id: 17, title: "Tokenization Platform for Real Estate", status: "open", applicants: [] },
  { id: 18, title: "Web3 Social Media Platform", status: "ongoing", applicants: [] },
  { id: 19, title: "Blockchain Analytics Dashboard", status: "completed", applicants: [] },
  { id: 20, title: "DeFi Yield Aggregator Development", status: "open", applicants: [] }
]

export function ProjectsOverview() {
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState<{title: string, status: Project['status']}>({ title: "", status: "open" })

  // Load projects from session storage on component mount
  useEffect(() => {
    const storedProjects = sessionStorage.getItem("projects")
    if (storedProjects) {
      setProjects(JSON.parse(storedProjects) as Project[])
    } else {
      // Initialize with default projects if nothing in storage
      setProjects(initialProjects)
      sessionStorage.setItem("projects", JSON.stringify(initialProjects))
    }
  }, [])

  const handleCreateProject = () => {
    const projectToAdd: Project = {
      id: projects.length + 1,
      title: newProject.title,
      status: "open",
      applicants: []
    }
    const updatedProjects = [...projects, projectToAdd]
    setProjects(updatedProjects)
    sessionStorage.setItem("projects", JSON.stringify(updatedProjects))
    setNewProject({ title: "", status: "open" })
  }

  const handleApply = (projectId: number) => {
    const updatedProjects = projects.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          applicants: [...(project.applicants || []), "current-user"] // In a real app, use actual user ID
        }
      }
      return project
    })
    setProjects(updatedProjects)
    sessionStorage.setItem("projects", JSON.stringify(updatedProjects))
  }

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <CardTitle className="text-lg sm:text-xl">Projects Overview</CardTitle>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Create Project</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Project Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewProject({ ...newProject, title: e.target.value })}
                />
              </div>
              <Button onClick={handleCreateProject}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6 sm:space-y-8">
          {["Open Projects", "Ongoing Projects", "Completed Projects"].map((section) => (
            <div key={section}>
              <h3 className="font-semibold mb-2 text-sm sm:text-base">{section}</h3>
              <div className="space-y-2">
                {projects
                  .filter((project) => project.status === section.split(" ")[0].toLowerCase())
                  .map((project) => (
                    <div key={project.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted p-2 sm:p-3 rounded-md gap-2 sm:gap-0">
                      <span className="text-xs sm:text-sm line-clamp-2">{project.title}</span>
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Badge variant={project.status === "open" ? "default" : project.status === "ongoing" ? "secondary" : "outline"} className="text-xs">
                          {project.status}
                        </Badge>
                        {project.status === "open" && (
                          <Button
                            size="sm"
                            onClick={() => handleApply(project.id)}
                            disabled={project.applicants?.includes("current-user")}
                            className="text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                          >
                            {project.applicants?.includes("current-user") ? "Applied" : "Apply"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
