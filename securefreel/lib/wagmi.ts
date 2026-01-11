import { getDefaultConfig } from '@web3modal/ethers/react'
import { mainnet, sepolia } from 'viem/chains'

export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'your-project-id-here'

export const metadata = {
  name: 'SecureFreel',
  description: 'Secure Freelance Platform with Web3',
  url: 'https://securefreel.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

export const config = getDefaultConfig({
  metadata,
  projectId,
  chains: [mainnet, sepolia],
  ssr: true,
})
