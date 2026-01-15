'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useUserReputation } from '@/hooks/useEscrow'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { formatEther } from 'ethers'
import { UserReputation } from '@/lib/contracts/types'
import { Award, TrendingUp, Shield } from 'lucide-react'

export function ReputationProfile() {
  const { address } = useWeb3ModalAccount()
  const { reputation, fetchReputation, loading } = useUserReputation()
  const [displayReputation, setDisplayReputation] = useState<UserReputation | null>(null)

  useEffect(() => {
    if (address) {
      fetchReputation(address)
    }
  }, [address, fetchReputation])

  useEffect(() => {
    setDisplayReputation(reputation)
  }, [reputation])

  if (!address) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Connect wallet to view reputation
          </p>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            Loading reputation...
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!displayReputation) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-xs sm:text-sm text-muted-foreground text-center">
            No reputation data available
          </p>
        </CardContent>
      </Card>
    )
  }

  const karma = Number(displayReputation.karma)
  const completedProjects = Number(displayReputation.completedProjects)
  const successRate = Number(displayReputation.successRate)
  const totalEarnings = formatEther(displayReputation.totalEarnings)
  const totalDisputes = Number(displayReputation.totalDisputes)

  const getKarmaLevel = (karma: number): string => {
    if (karma >= 1000) return 'Elite'
    if (karma >= 500) return 'Expert'
    if (karma >= 100) return 'Trusted'
    return 'New'
  }

  const getKarmaColor = (karma: number): string => {
    if (karma >= 1000) return 'bg-purple-100 text-purple-800'
    if (karma >= 500) return 'bg-blue-100 text-blue-800'
    if (karma >= 100) return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Award className="w-5 h-5" />
          Reputation Profile
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Karma Score */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Karma Score</p>
                <p className="text-2xl sm:text-3xl font-bold">{karma}</p>
              </div>
              <Badge className={`${getKarmaColor(karma)} text-xs sm:text-sm`}>
                {getKarmaLevel(karma)}
              </Badge>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Completed Projects */}
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-green-600" />
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">{completedProjects}</p>
            </div>

            {/* Success Rate */}
            <div className="bg-muted p-3 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
              <p className="text-xl sm:text-2xl font-bold">
                {(successRate / 100).toFixed(1)}%
              </p>
            </div>

            {/* Total Earnings */}
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Total Earnings</p>
              <p className="text-sm sm:text-base font-bold truncate">
                {parseFloat(totalEarnings).toFixed(3)} ETH
              </p>
            </div>

            {/* Disputes */}
            <div className="bg-muted p-3 rounded-lg">
              <p className="text-xs text-muted-foreground mb-2">Disputes</p>
              <p className="text-xl sm:text-2xl font-bold">{totalDisputes}</p>
            </div>
          </div>

          {/* Info Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-900">
              ✨ Complete projects to increase your karma score and unlock elite status!
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
