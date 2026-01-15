'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useProjectData, useProjectOperations, getProjectStatusLabel, isClientRole, isFreelancerRole, canUserAcceptProject, canUserFundProject } from '@/hooks/useEscrow'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { formatEther } from 'ethers'
import { Project } from '@/lib/contracts/types'

export function ProjectsOverview() {
  const { address } = useWeb3ModalAccount()
  const { projects, loading, fetchProjects } = useProjectData()
  const { createProject, loading: operationLoading } = useProjectOperations()
  const [newProject, setNewProject] = useState({ title: '', amount: '' })
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const handleCreateProject = async () => {
    if (!newProject.title || !newProject.amount) return

    const deadline = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60 // 30 days
    const txHash = await createProject(newProject.title, newProject.amount, deadline)

    if (txHash) {
      setNewProject({ title: '', amount: '' })
      await fetchProjects()
    }
  }

  // Filter projects for current user
  const userProjects = projects.filter(
    (p) => p.client.toLowerCase() === address?.toLowerCase() || p.freelancer.toLowerCase() === address?.toLowerCase()
  )

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: return 'bg-blue-100 text-blue-800'
      case 1: return 'bg-yellow-100 text-yellow-800'
      case 2: return 'bg-purple-100 text-purple-800'
      case 3: return 'bg-orange-100 text-orange-800'
      case 4: return 'bg-green-100 text-green-800'
      case 5: return 'bg-red-100 text-red-800'
      case 6: return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <CardTitle className="text-lg sm:text-xl">Smart Contract Projects</CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">Manage escrow-protected projects</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="text-xs sm:text-sm">Create Project</Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-sm">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-xs sm:text-sm">Project Title</Label>
                <Input
                  id="title"
                  placeholder="Web3 Marketplace..."
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="text-xs sm:text-sm"
                />
              </div>
              <div>
                <Label htmlFor="amount" className="text-xs sm:text-sm">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="1.5"
                  value={newProject.amount}
                  onChange={(e) => setNewProject({ ...newProject, amount: e.target.value })}
                  className="text-xs sm:text-sm"
                />
              </div>
              <Button 
                onClick={handleCreateProject} 
                disabled={operationLoading || !newProject.title || !newProject.amount}
                className="w-full text-xs sm:text-sm"
              >
                {operationLoading ? 'Creating...' : 'Create'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
            Loading projects...
          </div>
        ) : userProjects.length === 0 ? (
          <div className="text-center py-8 text-xs sm:text-sm text-muted-foreground">
            No projects yet. Create one to get started!
          </div>
        ) : (
          <div className="space-y-4">
            {userProjects.map((project) => (
              <div
                key={project.projectId}
                className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-muted p-3 sm:p-4 rounded-lg gap-3 sm:gap-0 cursor-pointer hover:bg-muted/80 transition"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-xs sm:text-sm line-clamp-2">{project.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isClientRole(project, address) ? 'You are the client' : 'You are the freelancer'}
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(project.status)}`}>
                    {getProjectStatusLabel(project.status)}
                  </Badge>
                  <span className="text-xs sm:text-sm font-semibold whitespace-nowrap">
                    {formatEther(project.amount)} ETH
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {selectedProject && (
        <ProjectDetailDialog
          project={selectedProject}
          isOpen={!!selectedProject}
          onClose={() => setSelectedProject(null)}
          onRefresh={fetchProjects}
        />
      )}
    </Card>
  )
}

interface ProjectDetailDialogProps {
  project: Project
  isOpen: boolean
  onClose: () => void
  onRefresh: () => Promise<void>
}

function ProjectDetailDialog({
  project,
  isOpen,
  onClose,
  onRefresh,
}: ProjectDetailDialogProps) {
  const { address } = useWeb3ModalAccount()
  const {
    fundProject,
    acceptProject,
    startWork,
    submitWork,
    approveCompletion,
    loading,
  } = useProjectOperations()
  const [deliverableURI, setDeliverableURI] = useState('')

  const isClient = isClientRole(project, address)
  const isFreelancer = isFreelancerRole(project, address)
  const canFund = canUserFundProject(project, address)
  const canAccept = canUserAcceptProject(project, address)

  const handleFundProject = async () => {
    const success = await fundProject(Number(project.projectId), formatEther(project.amount))
    if (success) {
      await onRefresh()
    }
  }

  const handleAcceptProject = async () => {
    const success = await acceptProject(Number(project.projectId))
    if (success) {
      await onRefresh()
    }
  }

  const handleStartWork = async () => {
    const success = await startWork(Number(project.projectId))
    if (success) {
      await onRefresh()
    }
  }

  const handleSubmitWork = async () => {
    if (!deliverableURI) return
    const success = await submitWork(Number(project.projectId), deliverableURI)
    if (success) {
      setDeliverableURI('')
      await onRefresh()
    }
  }

  const handleApproveCompletion = async () => {
    const success = await approveCompletion(Number(project.projectId))
    if (success) {
      await onRefresh()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">{project.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-xs sm:text-sm">
          {/* Project Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-muted-foreground">Client</p>
              <p className="font-mono truncate">{project.client.slice(0, 10)}...</p>
            </div>
            <div>
              <p className="text-muted-foreground">Freelancer</p>
              <p className="font-mono truncate">
                {project.freelancer === '0x0000000000000000000000000000000000000000'
                  ? 'Not assigned'
                  : project.freelancer.slice(0, 10) + '...'}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-semibold">{formatEther(project.amount)} ETH</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-semibold">{getProjectStatusLabel(project.status)}</p>
            </div>
          </div>

          {/* Deliverables */}
          {project.deliverableURI && (
            <div>
              <p className="text-muted-foreground mb-1">Deliverables</p>
              <a
                href={`https://ipfs.io/ipfs/${project.deliverableURI}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-xs truncate"
              >
                View on IPFS
              </a>
            </div>
          )}

          {/* Client Actions */}
          {isClient && (
            <div className="space-y-2 border-t pt-4">
              <p className="font-semibold text-xs sm:text-sm">Client Actions</p>
              {canFund && (
                <Button
                  onClick={handleFundProject}
                  disabled={loading}
                  className="w-full text-xs sm:text-sm"
                >
                  {loading ? 'Funding...' : 'Fund Project'}
                </Button>
              )}
              {project.status === 3 && (
                <Button
                  onClick={handleApproveCompletion}
                  disabled={loading}
                  className="w-full text-xs sm:text-sm"
                  variant="default"
                >
                  {loading ? 'Approving...' : 'Approve Completion'}
                </Button>
              )}
            </div>
          )}

          {/* Freelancer Actions */}
          {isFreelancer && (
            <div className="space-y-2 border-t pt-4">
              <p className="font-semibold text-xs sm:text-sm">Freelancer Actions</p>
              {project.status === 0 && canAccept && (
                <Button
                  onClick={handleAcceptProject}
                  disabled={loading}
                  className="w-full text-xs sm:text-sm"
                >
                  {loading ? 'Accepting...' : 'Accept Project'}
                </Button>
              )}
              {project.status === 1 && (
                <Button
                  onClick={handleStartWork}
                  disabled={loading}
                  className="w-full text-xs sm:text-sm"
                >
                  {loading ? 'Starting...' : 'Start Work'}
                </Button>
              )}
              {project.status === 2 && (
                <div className="space-y-2">
                  <Input
                    placeholder="IPFS hash of deliverables"
                    value={deliverableURI}
                    onChange={(e) => setDeliverableURI(e.target.value)}
                    className="text-xs sm:text-sm"
                  />
                  <Button
                    onClick={handleSubmitWork}
                    disabled={loading || !deliverableURI}
                    className="w-full text-xs sm:text-sm"
                  >
                    {loading ? 'Submitting...' : 'Submit Work'}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* General Actions */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full text-xs sm:text-sm"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
