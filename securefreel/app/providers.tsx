'use client'

import { ReactNode } from 'react'
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react'
import { mainnet, sepolia } from 'viem/chains'

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'your-project-id-here'

const metadata = {
  name: 'SecureFreel',
  description: 'Secure Freelance Platform with Web3',
  url: 'https://securefreel.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const ethersConfig = defaultConfig({
  metadata,
  defaultChainId: mainnet.id,
  rpcUrl: `https://eth.rpc.node.glif.io/rpc/v1`,
})

createWeb3Modal({
  ethersConfig,
  chains: [mainnet, sepolia],
  projectId,
})

export function WalletProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}
