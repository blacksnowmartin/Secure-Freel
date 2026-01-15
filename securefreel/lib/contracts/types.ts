export interface Project {
  projectId: number;
  client: string;
  freelancer: string;
  title: string;
  amount: bigint;
  paymentToken: string;
  deadline: bigint;
  status: number; // ProjectStatus enum
  createdAt: bigint;
  completedAt: bigint;
  disputeStatus: number; // DisputeStatus enum
  deliverableURI: string;
}

export interface UserReputation {
  completedProjects: bigint;
  totalEarnings: bigint;
  karma: bigint;
  totalDisputes: bigint;
  successRate: bigint; // 0-10000 (0-100%)
}

export interface DeploymentInfo {
  network: string;
  chainId: number;
  contractAddress: string;
  treasuryAddress: string;
  deployerAddress: string;
  deploymentBlock: number;
  timestamp: string;
}
