'use client'

import { useState, useCallback, useEffect } from 'react'
import { BrowserProvider, Contract, parseEther, ZeroAddress } from 'ethers'
import { useWeb3ModalAccount, useWeb3ModalProvider } from '@web3modal/ethers/react'
import { FREELANCE_ESCROW_ABI, PROJECT_STATUS_LABELS, PROJECT_STATUS } from '@/lib/contracts/abi'
import { Project, UserReputation } from '@/lib/contracts/types'
import { getContractAddress } from '@/lib/contracts/config'

export function useEscrowContract() {
  const { address, isConnected } = useWeb3ModalAccount()
  const { walletProvider } = useWeb3ModalProvider()
  const [contract, setContract] = useState<Contract | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isConnected || !walletProvider) {
      setContract(null)
      return
    }

    const initContract = async () => {
      try {
        const provider = new BrowserProvider(walletProvider)
        const signer = await provider.getSigner()
        const contractAddress = getContractAddress()
        
        const escrowContract = new Contract(
          contractAddress,
          FREELANCE_ESCROW_ABI,
          signer
        )
        
        setContract(escrowContract)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize contract')
        setContract(null)
      }
    }

    initContract()
  }, [isConnected, walletProvider])

  return { contract, loading, error, isConnected, userAddress: address }
}

export function useProjectOperations() {
  const { contract, isConnected, userAddress } = useEscrowContract()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createProject = useCallback(
    async (title: string, amount: string, deadline: number) => {
      if (!contract || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.createProject(
          title,
          parseEther(amount),
          ZeroAddress, // ETH payment
          deadline
        )
        
        const receipt = await tx.wait()
        return receipt?.hash
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create project'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract, isConnected]
  )

  const fundProject = useCallback(
    async (projectId: number, amount: string) => {
      if (!contract || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.fundProject(projectId, {
          value: parseEther(amount),
        })
        
        const receipt = await tx.wait()
        return receipt?.hash
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fund project'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract, isConnected]
  )

  const acceptProject = useCallback(
    async (projectId: number) => {
      if (!contract || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.acceptProject(projectId)
        const receipt = await tx.wait()
        return receipt?.hash
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to accept project'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract, isConnected]
  )

  const startWork = useCallback(
    async (projectId: number) => {
      if (!contract || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.startWork(projectId)
        const receipt = await tx.wait()
        return receipt?.hash
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to start work'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract, isConnected]
  )

  const submitWork = useCallback(
    async (projectId: number, deliverableURI: string) => {
      if (!contract || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.submitWork(projectId, deliverableURI)
        const receipt = await tx.wait()
        return receipt?.hash
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to submit work'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract, isConnected]
  )

  const approveCompletion = useCallback(
    async (projectId: number) => {
      if (!contract || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.approveCompletion(projectId)
        const receipt = await tx.wait()
        return receipt?.hash
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to approve completion'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract, isConnected]
  )

  const initiateDispute = useCallback(
    async (projectId: number, reason: string) => {
      if (!contract || !isConnected) {
        setError('Wallet not connected')
        return null
      }

      setLoading(true)
      setError(null)

      try {
        const tx = await contract.initiateDispute(projectId, reason)
        const receipt = await tx.wait()
        return receipt?.hash
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to initiate dispute'
        setError(message)
        return null
      } finally {
        setLoading(false)
      }
    },
    [contract, isConnected]
  )

  return {
    createProject,
    fundProject,
    acceptProject,
    startWork,
    submitWork,
    approveCompletion,
    initiateDispute,
    loading,
    error,
  }
}

export function useProjectData() {
  const { contract, isConnected } = useEscrowContract()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProjects = useCallback(async () => {
    if (!contract) return

    setLoading(true)
    setError(null)

    try {
      const totalProjects = await contract.getTotalProjects()
      const projectsArray: Project[] = []

      for (let i = 0; i < totalProjects; i++) {
        const project = await contract.getProject(i)
        projectsArray.push(project as Project)
      }

      setProjects(projectsArray)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch projects'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [contract])

  const fetchProject = useCallback(
    async (projectId: number) => {
      if (!contract) return null

      try {
        const project = await contract.getProject(projectId)
        return project as Project
      } catch (err) {
        console.error('Failed to fetch project:', err)
        return null
      }
    },
    [contract]
  )

  useEffect(() => {
    if (isConnected) {
      fetchProjects()
    }
  }, [isConnected, fetchProjects])

  return {
    projects,
    fetchProjects,
    fetchProject,
    loading,
    error,
  }
}

export function useUserReputation() {
  const { contract } = useEscrowContract()
  const [reputation, setReputation] = useState<UserReputation | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReputation = useCallback(
    async (userAddress: string) => {
      if (!contract) return

      setLoading(true)
      setError(null)

      try {
        const rep = await contract.getReputation(userAddress)
        setReputation(rep as UserReputation)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch reputation'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [contract]
  )

  return {
    reputation,
    fetchReputation,
    loading,
    error,
  }
}

export function useUserProjects() {
  const { contract } = useEscrowContract()
  const [projectIds, setProjectIds] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUserProjects = useCallback(
    async (userAddress: string) => {
      if (!contract) return

      setLoading(true)
      setError(null)

      try {
        const ids = await contract.getUserProjects(userAddress)
        setProjectIds(ids.map((id: any) => Number(id)))
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch user projects'
        setError(message)
      } finally {
        setLoading(false)
      }
    },
    [contract]
  )

  return {
    projectIds,
    fetchUserProjects,
    loading,
    error,
  }
}

export function getProjectStatusLabel(status: number): string {
  return PROJECT_STATUS_LABELS[status] || 'Unknown'
}

export function isClientRole(project: Project, userAddress?: string): boolean {
  return userAddress?.toLowerCase() === project.client.toLowerCase()
}

export function isFreelancerRole(project: Project, userAddress?: string): boolean {
  return userAddress?.toLowerCase() === project.freelancer.toLowerCase()
}

export function canUserFundProject(project: Project, userAddress?: string): boolean {
  return (
    isClientRole(project, userAddress) &&
    project.status === PROJECT_STATUS.Open &&
    project.freelancer !== ZeroAddress
  )
}

export function canUserAcceptProject(project: Project, userAddress?: string): boolean {
  return project.status === PROJECT_STATUS.Open && userAddress !== project.client
}

export function canUserStartWork(project: Project, userAddress?: string): boolean {
  return (
    isFreelancerRole(project, userAddress) &&
    project.status === PROJECT_STATUS.Funded
  )
}

export function canUserSubmitWork(project: Project, userAddress?: string): boolean {
  return (
    isFreelancerRole(project, userAddress) &&
    project.status === PROJECT_STATUS.InProgress
  )
}

export function canUserApproveCompletion(project: Project, userAddress?: string): boolean {
  return (
    isClientRole(project, userAddress) &&
    project.status === PROJECT_STATUS.UnderReview &&
    project.disputeStatus === 0 // No dispute
  )
}
