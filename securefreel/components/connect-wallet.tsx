'use client'

import { useWeb3Modal } from '@web3modal/ethers/react'
import { useWeb3ModalAccount } from '@web3modal/ethers/react'
import { Button } from '@/components/ui/button'
import { Wallet } from 'lucide-react'

export function ConnectWallet() {
  const { open } = useWeb3Modal()
  const { address, isConnected } = useWeb3ModalAccount()

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  return (
    <Button
      onClick={() => open()}
      variant={isConnected ? 'outline' : 'default'}
      className="flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      {isConnected ? truncateAddress(address || '') : 'Connect Wallet'}
    </Button>
  )
}
