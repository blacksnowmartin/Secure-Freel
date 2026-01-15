# API Reference - SecureFreel Escrow System

## Smart Contract Functions

### Project Management

#### `createProject(title, amount, paymentToken, deadline) → uint256`
Create a new freelance project.

**Parameters**:
- `title` (string): Project title
- `amount` (uint256): Amount in wei (use `parseEther("1.5")`)
- `paymentToken` (address): Token address (use `ZeroAddress` for ETH)
- `deadline` (uint256): Unix timestamp for project deadline

**Returns**: Project ID (uint256)

**Emits**: `ProjectCreated`

**Example**:
```typescript
const projectId = await contract.createProject(
  "Web3 Development",
  parseEther("1.5"),
  ZeroAddress,
  Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60
)
```

---

#### `acceptProject(projectId) → void`
Accept a project as freelancer.

**Parameters**:
- `projectId` (uint256): ID of project to accept

**Emits**: `ProjectAccepted`

**Requirements**:
- Project must be in Open state
- Caller must not be the client

**Example**:
```typescript
await contract.acceptProject(0)
```

---

#### `fundProject(projectId) → void` (payable)
Fund a project with escrow funds.

**Parameters**:
- `projectId` (uint256): ID of project to fund

**Value**: Amount in wei (must match project amount)

**Emits**: `ProjectFunded`

**Requirements**:
- Project must be in Open state
- Freelancer must be assigned
- Correct ETH amount (or ERC20 approved)

**Example**:
```typescript
await contract.fundProject(0, {
  value: parseEther("1.5")
})
```

---

### Work Management

#### `startWork(projectId) → void`
Start working on a funded project.

**Parameters**:
- `projectId` (uint256): ID of project

**Emits**: `ProjectStarted`

**Requirements**:
- Project must be in Funded state
- Caller must be freelancer

**Example**:
```typescript
await contract.startWork(0)
```

---

#### `submitWork(projectId, deliverableURI) → void`
Submit work for review.

**Parameters**:
- `projectId` (uint256): ID of project
- `deliverableURI` (string): IPFS hash or URL to deliverables

**Emits**: `WorkSubmitted`

**Requirements**:
- Project must be in InProgress state
- Caller must be freelancer

**Example**:
```typescript
await contract.submitWork(0, "QmXxxx...")
```

---

### Approval & Payment

#### `approveCompletion(projectId) → void`
Approve completed work and release funds.

**Parameters**:
- `projectId` (uint256): ID of project

**Emits**: `ProjectCompleted`, `ReputationUpdated`

**Requirements**:
- Project must be in UnderReview state
- Caller must be client
- No active dispute

**Effects**:
- Freelancer receives 98% of amount
- Treasury receives 2% fee
- Freelancer karma increases by 100

**Example**:
```typescript
await contract.approveCompletion(0)
```

---

### Dispute Resolution

#### `initiateDispute(projectId, reason) → void`
Initiate a dispute.

**Parameters**:
- `projectId` (uint256): ID of project
- `reason` (string): Reason for dispute

**Emits**: `DisputeInitiated`

**Requirements**:
- Project must be in InProgress or UnderReview
- Caller must be client or freelancer
- No active dispute

**Example**:
```typescript
await contract.initiateDispute(0, "Work quality issue")
```

---

#### `resolveDispute(projectId, winner, resolution) → void`
Resolve an active dispute (admin only).

**Parameters**:
- `projectId` (uint256): ID of project
- `winner` (address): Address of dispute winner
- `resolution` (string): Resolution description

**Emits**: `DisputeResolved`

**Requirements**:
- Caller must be contract owner
- Dispute must be initiated

**Effects**:
- If freelancer wins: funds released, karma +100
- If client wins: funds refunded, freelancer karma -50

**Example**:
```typescript
await contract.resolveDispute(0, freelancerAddress, "Approved")
```

---

## Query Functions

### `getProject(projectId) → Project`
Get project details.

**Parameters**:
- `projectId` (uint256): ID of project

**Returns**:
```typescript
{
  projectId: number,
  client: string,
  freelancer: string,
  title: string,
  amount: bigint,
  paymentToken: string,
  deadline: bigint,
  status: number,        // 0-6 (ProjectStatus enum)
  createdAt: bigint,
  completedAt: bigint,
  disputeStatus: number, // 0-2 (DisputeStatus enum)
  deliverableURI: string
}
```

**Example**:
```typescript
const project = await contract.getProject(0)
console.log(project.title)
```

---

### `getReputation(userAddress) → UserReputation`
Get user reputation.

**Parameters**:
- `userAddress` (address): User address

**Returns**:
```typescript
{
  completedProjects: bigint,
  totalEarnings: bigint,
  karma: bigint,
  totalDisputes: bigint,
  successRate: bigint    // 0-10000 (0-100%)
}
```

**Example**:
```typescript
const rep = await contract.getReputation(userAddress)
console.log(`Karma: ${rep.karma}`)
console.log(`Success Rate: ${rep.successRate / 100}%`)
```

---

### `getUserProjects(userAddress) → uint256[]`
Get all projects for a user.

**Parameters**:
- `userAddress` (address): User address

**Returns**: Array of project IDs

**Example**:
```typescript
const projectIds = await contract.getUserProjects(userAddress)
projectIds.forEach(id => {
  const project = await contract.getProject(id)
  console.log(project.title)
})
```

---

### `getTotalProjects() → uint256`
Get total number of projects.

**Returns**: Total projects count

**Example**:
```typescript
const total = await contract.getTotalProjects()
console.log(`Total projects: ${total}`)
```

---

## Admin Functions

### `setPlatformFee(newFee) → void`
Update platform fee percentage (owner only).

**Parameters**:
- `newFee` (uint256): New fee in basis points (200 = 2%)

**Requirements**:
- Caller must be owner
- Fee must be ≤ 1000 (10%)

**Example**:
```typescript
await contract.setPlatformFee(300) // 3%
```

---

### `setTreasuryAddress(newTreasury) → void`
Update treasury address (owner only).

**Parameters**:
- `newTreasury` (address): New treasury address

**Requirements**:
- Caller must be owner
- Address must not be zero address

**Example**:
```typescript
await contract.setTreasuryAddress("0x...")
```

---

### `withdrawFees(token) → void`
Withdraw accumulated platform fees (owner only).

**Parameters**:
- `token` (address): Token address (use `ZeroAddress` for ETH)

**Requirements**:
- Caller must be owner
- Must be ETH or ERC20

**Example**:
```typescript
await contract.withdrawFees(ZeroAddress) // Withdraw ETH fees
```

---

## React Hooks API

### useEscrowContract()
Initialize contract connection.

**Returns**:
```typescript
{
  contract: Contract | null,
  loading: boolean,
  error: string | null,
  isConnected: boolean,
  userAddress: string | undefined
}
```

**Example**:
```typescript
const { contract, isConnected } = useEscrowContract()
```

---

### useProjectOperations()
Perform project operations.

**Returns**:
```typescript
{
  createProject: (title, amount, deadline) => Promise<string | null>,
  fundProject: (projectId, amount) => Promise<string | null>,
  acceptProject: (projectId) => Promise<string | null>,
  startWork: (projectId) => Promise<string | null>,
  submitWork: (projectId, uri) => Promise<string | null>,
  approveCompletion: (projectId) => Promise<string | null>,
  initiateDispute: (projectId, reason) => Promise<string | null>,
  loading: boolean,
  error: string | null
}
```

**Example**:
```typescript
const { createProject, loading } = useProjectOperations()
const txHash = await createProject('Title', '1.5', deadline)
```

---

### useProjectData()
Fetch project data.

**Returns**:
```typescript
{
  projects: Project[],
  fetchProjects: () => Promise<void>,
  fetchProject: (projectId) => Promise<Project | null>,
  loading: boolean,
  error: string | null
}
```

**Example**:
```typescript
const { projects, fetchProjects } = useProjectData()

useEffect(() => {
  fetchProjects()
}, [])
```

---

### useUserReputation()
Fetch user reputation.

**Returns**:
```typescript
{
  reputation: UserReputation | null,
  fetchReputation: (userAddress) => Promise<void>,
  loading: boolean,
  error: string | null
}
```

**Example**:
```typescript
const { reputation, fetchReputation } = useUserReputation()

useEffect(() => {
  if (userAddress) {
    fetchReputation(userAddress)
  }
}, [userAddress])
```

---

### useUserProjects()
Fetch user's projects.

**Returns**:
```typescript
{
  projectIds: number[],
  fetchUserProjects: (userAddress) => Promise<void>,
  loading: boolean,
  error: string | null
}
```

**Example**:
```typescript
const { projectIds, fetchUserProjects } = useUserProjects()
```

---

## Helper Functions

### getProjectStatusLabel(status: number) → string
Convert status number to readable label.

**Returns**: "Open" | "Funded" | "In Progress" | "Under Review" | "Completed" | "Disputed" | "Cancelled"

**Example**:
```typescript
const label = getProjectStatusLabel(2) // "In Progress"
```

---

### isClientRole(project: Project, userAddress?: string) → boolean
Check if user is project client.

**Example**:
```typescript
if (isClientRole(project, address)) {
  // Show client actions
}
```

---

### isFreelancerRole(project: Project, userAddress?: string) → boolean
Check if user is project freelancer.

**Example**:
```typescript
if (isFreelancerRole(project, address)) {
  // Show freelancer actions
}
```

---

### canUserFundProject(project: Project, userAddress?: string) → boolean
Check if user can fund project.

**Example**:
```typescript
if (canUserFundProject(project, address)) {
  // Show fund button
}
```

---

### canUserAcceptProject(project: Project, userAddress?: string) → boolean
Check if user can accept project.

**Example**:
```typescript
if (canUserAcceptProject(project, address)) {
  // Show accept button
}
```

---

### canUserStartWork(project: Project, userAddress?: string) → boolean
Check if user can start work.

**Example**:
```typescript
if (canUserStartWork(project, address)) {
  // Show start work button
}
```

---

### canUserSubmitWork(project: Project, userAddress?: string) → boolean
Check if user can submit work.

**Example**:
```typescript
if (canUserSubmitWork(project, address)) {
  // Show submit button
}
```

---

### canUserApproveCompletion(project: Project, userAddress?: string) → boolean
Check if user can approve completion.

**Example**:
```typescript
if (canUserApproveCompletion(project, address)) {
  // Show approve button
}
```

---

## Enums

### ProjectStatus
```typescript
enum ProjectStatus {
  Open = 0,
  Funded = 1,
  InProgress = 2,
  UnderReview = 3,
  Completed = 4,
  Disputed = 5,
  Cancelled = 6
}
```

---

### DisputeStatus
```typescript
enum DisputeStatus {
  None = 0,
  Initiated = 1,
  Resolved = 2
}
```

---

## Events

### ProjectCreated
```
event ProjectCreated(
  uint256 indexed projectId,
  address indexed client,
  string title,
  uint256 amount,
  address paymentToken
)
```

---

### ProjectFunded
```
event ProjectFunded(
  uint256 indexed projectId,
  address indexed client,
  uint256 amount
)
```

---

### ProjectAccepted
```
event ProjectAccepted(
  uint256 indexed projectId,
  address indexed freelancer
)
```

---

### ProjectStarted
```
event ProjectStarted(uint256 indexed projectId)
```

---

### WorkSubmitted
```
event WorkSubmitted(
  uint256 indexed projectId,
  address indexed freelancer,
  string deliverableURI
)
```

---

### ProjectCompleted
```
event ProjectCompleted(
  uint256 indexed projectId,
  address indexed freelancer,
  uint256 paymentAmount
)
```

---

### DisputeInitiated
```
event DisputeInitiated(
  uint256 indexed projectId,
  address indexed initiator,
  string reason
)
```

---

### DisputeResolved
```
event DisputeResolved(
  uint256 indexed projectId,
  address indexed winner,
  string resolution
)
```

---

### ReputationUpdated
```
event ReputationUpdated(
  address indexed user,
  uint256 completedProjects,
  uint256 karma
)
```

---

## Common Usage Patterns

### Complete Project Workflow
```typescript
// 1. Client creates project
const projectId = await createProject("Title", "1.0", deadline)

// 2. Freelancer accepts
await acceptProject(projectId)

// 3. Client funds
await fundProject(projectId, "1.0")

// 4. Freelancer starts
await startWork(projectId)

// 5. Freelancer submits
await submitWork(projectId, "QmXxxx")

// 6. Client approves
await approveCompletion(projectId)

// 7. Funds released, reputation updated
```

---

### Check User Permissions
```typescript
const { projects } = useProjectData()
const { address } = useWeb3ModalAccount()

const availableActions = projects
  .filter(p => canUserFundProject(p, address))
  .map(p => ({
    projectId: p.projectId,
    action: 'fund'
  }))
```

---

### Monitor Project Changes
```typescript
contract.on('ProjectCompleted', (projectId, freelancer, payment) => {
  console.log(`Project ${projectId} completed!`)
  fetchReputation(freelancer)
  fetchProjects()
})
```

---

## Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Wallet not connected" | No wallet connected | Call useWeb3ModalAccount first |
| "Project does not exist" | Invalid project ID | Use correct project ID |
| "Only client can call this" | Wrong user role | Use correct account |
| "Project not in progress" | Wrong project state | Project must be InProgress |
| "Deadline must be in the future" | Past deadline | Use future unix timestamp |
| "Incorrect ETH amount" | Wrong payment amount | Match project amount exactly |

---

**API Reference Complete** ✅

For implementation details, see source files:
- Smart Contract: `contracts/FreelanceEscrow.sol`
- React Hooks: `hooks/useEscrow.ts`
- Components: `components/escrow-projects.tsx`, `reputation-profile.tsx`
