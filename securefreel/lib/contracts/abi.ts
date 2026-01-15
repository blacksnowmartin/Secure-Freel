export const FREELANCE_ESCROW_ABI = [
  {
    type: "constructor",
    inputs: [{ name: "_treasury", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "acceptProject",
    inputs: [{ name: "_projectId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approveCompletion",
    inputs: [{ name: "_projectId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createProject",
    inputs: [
      { name: "_title", type: "string", internalType: "string" },
      { name: "_amount", type: "uint256", internalType: "uint256" },
      { name: "_paymentToken", type: "address", internalType: "address" },
      { name: "_deadline", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "fundProject",
    inputs: [{ name: "_projectId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "getProject",
    inputs: [{ name: "_projectId", type: "uint256", internalType: "uint256" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct FreelanceEscrow.Project",
        components: [
          { name: "projectId", type: "uint256", internalType: "uint256" },
          { name: "client", type: "address", internalType: "address" },
          { name: "freelancer", type: "address", internalType: "address" },
          { name: "title", type: "string", internalType: "string" },
          { name: "amount", type: "uint256", internalType: "uint256" },
          {
            name: "paymentToken",
            type: "address",
            internalType: "address",
          },
          { name: "deadline", type: "uint256", internalType: "uint256" },
          { name: "status", type: "uint8", internalType: "enum FreelanceEscrow.ProjectStatus" },
          { name: "createdAt", type: "uint256", internalType: "uint256" },
          { name: "completedAt", type: "uint256", internalType: "uint256" },
          {
            name: "disputeStatus",
            type: "uint8",
            internalType: "enum FreelanceEscrow.DisputeStatus",
          },
          {
            name: "deliverableURI",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getReputation",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct FreelanceEscrow.UserReputation",
        components: [
          {
            name: "completedProjects",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "totalEarnings", type: "uint256", internalType: "uint256" },
          { name: "karma", type: "uint256", internalType: "uint256" },
          { name: "totalDisputes", type: "uint256", internalType: "uint256" },
          { name: "successRate", type: "uint256", internalType: "uint256" },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getTotalProjects",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getUserProjects",
    inputs: [{ name: "_user", type: "address", internalType: "address" }],
    outputs: [{ name: "", type: "uint256[]", internalType: "uint256[]" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "initiateDispute",
    inputs: [
      { name: "_projectId", type: "uint256", internalType: "uint256" },
      { name: "_reason", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "platformFeePercentage",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "projects",
    inputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    outputs: [
      { name: "projectId", type: "uint256", internalType: "uint256" },
      { name: "client", type: "address", internalType: "address" },
      { name: "freelancer", type: "address", internalType: "address" },
      { name: "title", type: "string", internalType: "string" },
      { name: "amount", type: "uint256", internalType: "uint256" },
      { name: "paymentToken", type: "address", internalType: "address" },
      { name: "deadline", type: "uint256", internalType: "uint256" },
      { name: "status", type: "uint8", internalType: "enum FreelanceEscrow.ProjectStatus" },
      { name: "createdAt", type: "uint256", internalType: "uint256" },
      { name: "completedAt", type: "uint256", internalType: "uint256" },
      {
        name: "disputeStatus",
        type: "uint8",
        internalType: "enum FreelanceEscrow.DisputeStatus",
      },
      { name: "deliverableURI", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "resolveDispute",
    inputs: [
      { name: "_projectId", type: "uint256", internalType: "uint256" },
      { name: "_winner", type: "address", internalType: "address" },
      { name: "_resolution", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setPlatformFee",
    inputs: [{ name: "_newFee", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "setTreasuryAddress",
    inputs: [{ name: "_newTreasury", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "startWork",
    inputs: [{ name: "_projectId", type: "uint256", internalType: "uint256" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "submitWork",
    inputs: [
      { name: "_projectId", type: "uint256", internalType: "uint256" },
      { name: "_deliverableURI", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "treasuryAddress",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "withdrawFees",
    inputs: [{ name: "_token", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "ProjectCreated",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "title", type: "string", indexed: false },
      { name: "amount", type: "uint256", indexed: false },
      { name: "paymentToken", type: "address", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ProjectFunded",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "client", type: "address", indexed: true },
      { name: "amount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ProjectAccepted",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "freelancer", type: "address", indexed: true },
    ],
  },
  {
    type: "event",
    name: "ProjectStarted",
    inputs: [{ name: "projectId", type: "uint256", indexed: true }],
  },
  {
    type: "event",
    name: "WorkSubmitted",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "freelancer", type: "address", indexed: true },
      { name: "deliverableURI", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ProjectCompleted",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "freelancer", type: "address", indexed: true },
      { name: "paymentAmount", type: "uint256", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DisputeInitiated",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "initiator", type: "address", indexed: true },
      { name: "reason", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "DisputeResolved",
    inputs: [
      { name: "projectId", type: "uint256", indexed: true },
      { name: "winner", type: "address", indexed: true },
      { name: "resolution", type: "string", indexed: false },
    ],
  },
  {
    type: "event",
    name: "ReputationUpdated",
    inputs: [
      { name: "user", type: "address", indexed: true },
      { name: "completedProjects", type: "uint256", indexed: false },
      { name: "karma", type: "uint256", indexed: false },
    ],
  },
] as const;

export const PROJECT_STATUS = {
  Open: 0,
  Funded: 1,
  InProgress: 2,
  UnderReview: 3,
  Completed: 4,
  Disputed: 5,
  Cancelled: 6,
} as const;

export const PROJECT_STATUS_LABELS: Record<number, string> = {
  0: "Open",
  1: "Funded",
  2: "In Progress",
  3: "Under Review",
  4: "Completed",
  5: "Disputed",
  6: "Cancelled",
};

export const DISPUTE_STATUS = {
  None: 0,
  Initiated: 1,
  Resolved: 2,
} as const;

export const DISPUTE_STATUS_LABELS: Record<number, string> = {
  0: "None",
  1: "Disputed",
  2: "Resolved",
};
