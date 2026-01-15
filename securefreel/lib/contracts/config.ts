// Contract addresses by network
export const CONTRACT_ADDRESSES: Record<string, string> = {
  localhost: "0x5FbDB2315678afccb333f8a9c614026efdb98F2e", // Default Hardhat deployment
  sepolia: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
  mainnet: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || "",
};

// Get current contract address based on environment
export function getContractAddress(): string {
  const network = process.env.NEXT_PUBLIC_NETWORK || "localhost";
  const address = CONTRACT_ADDRESSES[network];
  
  if (!address) {
    console.warn(`No contract address found for network: ${network}`);
    return CONTRACT_ADDRESSES.localhost;
  }
  
  return address;
}

// Network configuration
export const NETWORK_CONFIG = {
  localhost: {
    name: "Localhost",
    chainId: 31337,
    rpcUrl: "http://localhost:8545",
    currency: "ETH",
  },
  sepolia: {
    name: "Sepolia Testnet",
    chainId: 11155111,
    rpcUrl: "https://eth-sepolia.g.alchemy.com/v2/",
    currency: "SepoliaETH",
  },
  mainnet: {
    name: "Ethereum Mainnet",
    chainId: 1,
    rpcUrl: "https://eth-mainnet.g.alchemy.com/v2/",
    currency: "ETH",
  },
};
