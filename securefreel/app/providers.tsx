'use client'

import { ReactNode } from 'react'
import { Web3Modal } from '@web3modal/ethers/react'
import { config, projectId } from './wagmi'

export function WalletProvider({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Web3Modal projectId={projectId} config={config} />
    </>
  )
}
