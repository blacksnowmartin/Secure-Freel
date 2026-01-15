# Integration Guide - SecureFreel Escrow System

Complete guide to understanding and integrating the escrow system into your workflow.

## Architecture Overview

### Smart Contract Layer
The `FreelanceEscrow` contract handles:
- Fund escrow and release
- State transitions
- Reputation tracking
- Platform fee collection

### React Hooks Layer
Custom hooks in `hooks/useEscrow.ts` provide:
- Contract interaction abstraction
- State management
- Error handling
- Loading states

### UI Components Layer
React components handle:
- User interface
- Data display
- Action triggers
- Real-time updates

## How Data Flows

```
User Action (Create Project)
         ↓
React Component (escrow-projects.tsx)
         ↓
useProjectOperations Hook
         ↓
Smart Contract Function (createProject)
         ↓
Blockchain State Updated
         ↓
Event Emitted (ProjectCreated)
         ↓
useProjectData Hook
         ↓
Component Re-renders
```

## Using the Hooks

### 1. Initialize Contract Connection

```typescript
import { useEscrowContract } from '@/hooks/useEscrow'

function MyComponent() {
  const { contract, isConnected, userAddress, error } = useEscrowContract()
  
  if (!isConnected) return <div>Connect wallet</div>
  if (error) return <div>Error: {error}</div>
  
  // contract is ready to use
}
```

### 2. Perform Project Operations

```typescript
import { useProjectOperations } from '@/hooks/useEscrow'

function ProjectManager() {
  const { createProject, fundProject, loading, error } = useProjectOperations()
  
  const handleCreate = async () => {
    const txHash = await createProject(
      'My Project',
      '1.5',  // amount in ETH
      1704067200  // deadline (unix timestamp)
    )
    
    if (txHash) {
      console.log('Project created:', txHash)
      // Refresh data
    }
  }
  
  return (
    <button onClick={handleCreate} disabled={loading}>
      {loading ? 'Creating...' : 'Create Project'}
    </button>
  )
}
```

### 3. Fetch and Display Data

```typescript
import { useProjectData, useUserReputation } from '@/hooks/useEscrow'

function Dashboard() {
  const { projects, fetchProjects, loading } = useProjectData()
  const { reputation, fetchReputation } = useUserReputation()
  
  useEffect(() => {
    fetchProjects()
    fetchReputation(userAddress)
  }, [userAddress])
  
  return (
    <div>
      <div>Karma: {reputation?.karma || 0}</div>
      <ul>
        {projects.map(p => (
          <li key={p.projectId}>{p.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

## Component Integration Points

### escrow-projects.tsx

**Purpose**: Main project management component
**Props**: None (uses hooks internally)
**Features**:
- Create new projects
- Display project list
- Show project details in modal
- Handle user actions based on role

**Usage**:
```typescript
import { ProjectsOverview } from '@/components/escrow-projects'

export default function Dashboard() {
  return <ProjectsOverview />
}
```

### reputation-profile.tsx

**Purpose**: Display user reputation
**Props**: None (uses hooks internally)
**Features**:
- Show karma score
- Display reputation level
- Show metrics (earnings, disputes, etc)
- Visual indicators

**Usage**:
```typescript
import { ReputationProfile } from '@/components/reputation-profile'

export default function Dashboard() {
  return <ReputationProfile />
}
```

## State Management

### Project States

```typescript
enum ProjectStatus {
  Open = 0,          // Waiting for freelancer
  Funded = 1,        // Client funded, ready to start
  InProgress = 2,    // Work in progress
  UnderReview = 3,   // Awaiting approval
  Completed = 4,     // Done, funds released
  Disputed = 5,      // Under dispute
  Cancelled = 6      // Cancelled, funds returned
}
```

### Role-Based Actions

```typescript
// Check user role
isClientRole(project, userAddress)
isFreelancerRole(project, userAddress)

// Check if action is allowed
canUserFundProject(project, userAddress)
canUserAcceptProject(project, userAddress)
canUserStartWork(project, userAddress)
canUserSubmitWork(project, userAddress)
canUserApproveCompletion(project, userAddress)
```

## Event Handling

The contract emits events for all major actions:

```typescript
// Listen to project creation
contract.on('ProjectCreated', (projectId, client, title, amount, token) => {
  console.log(`New project: ${title}`)
})

// Listen to completion
contract.on('ProjectCompleted', (projectId, freelancer, payment) => {
  console.log(`Project ${projectId} completed!`)
})

// Listen to disputes
contract.on('DisputeInitiated', (projectId, initiator, reason) => {
  console.log(`Dispute on project ${projectId}`)
})
```

## Error Handling

All operations include error states:

```typescript
const { createProject, loading, error } = useProjectOperations()

const handleCreate = async () => {
  const result = await createProject(title, amount, deadline)
  
  if (result) {
    // Success
    console.log('Project created:', result)
  } else {
    // Error
    console.log('Failed:', error)
  }
}
```

## Type Safety

All data types are defined in `lib/contracts/types.ts`:

```typescript
interface Project {
  projectId: number
  client: string
  freelancer: string
  title: string
  amount: bigint
  paymentToken: string
  deadline: bigint
  status: number
  createdAt: bigint
  completedAt: bigint
  disputeStatus: number
  deliverableURI: string
}

interface UserReputation {
  completedProjects: bigint
  totalEarnings: bigint
  karma: bigint
  totalDisputes: bigint
  successRate: bigint
}
```

## Gas Optimization Tips

1. **Batch Operations**: Combine multiple reads into single call
2. **Caching**: Cache frequently accessed data
3. **Lazy Loading**: Load data only when needed
4. **Event Indexing**: Use The Graph for efficient querying

## Common Patterns

### Pattern 1: Create and Fund Project

```typescript
const { createProject, fundProject } = useProjectOperations()

// 1. Create
const projectTx = await createProject('Title', '1.0', deadline)
await waitForConfirmation(projectTx)

// 2. Fund
const fundTx = await fundProject(projectId, '1.0')
await waitForConfirmation(fundTx)
```

### Pattern 2: Complete Workflow

```typescript
// Freelancer accepts
await acceptProject(projectId)

// Wait for funding
const funded = await waitForProjectState(projectId, 'Funded')

// Start work
await startWork(projectId)

// Submit deliverables
await submitWork(projectId, 'QmXxxx')

// Wait for client approval
const completed = await waitForProjectState(projectId, 'Completed')

// Check reputation updated
const rep = await fetchReputation(freelancerAddress)
console.log('New karma:', rep.karma)
```

### Pattern 3: Handle Disputes

```typescript
// Initiate dispute
await initiateDispute(projectId, 'Work quality issue')

// Monitor dispute status
const project = await fetchProject(projectId)
if (project.disputeStatus === 1) {
  console.log('Dispute in progress...')
}

// Wait for resolution (admin action)
contract.on('DisputeResolved', (projectId, winner) => {
  if (winner === userAddress) {
    console.log('You won the dispute!')
  }
})
```

## Testing Integration

### Unit Test Example

```typescript
import { useProjectOperations } from '@/hooks/useEscrow'
import { renderHook, act } from '@testing-library/react'

describe('useProjectOperations', () => {
  it('creates a project', async () => {
    const { result } = renderHook(() => useProjectOperations())
    
    await act(async () => {
      const tx = await result.current.createProject(
        'Test',
        '1.0',
        Date.now() + 86400
      )
      expect(tx).toBeDefined()
    })
  })
})
```

### Integration Test Example

```typescript
describe('Project Workflow', () => {
  it('completes full lifecycle', async () => {
    // Setup
    const client = getAccount(0)
    const freelancer = getAccount(1)
    
    // Create
    const projectId = await createProject(client, 'Test', '1.0')
    
    // Accept
    await acceptProject(freelancer, projectId)
    
    // Fund
    await fundProject(client, projectId, '1.0')
    
    // Work
    await startWork(freelancer, projectId)
    await submitWork(freelancer, projectId, 'QmXxxx')
    
    // Approve
    await approveCompletion(client, projectId)
    
    // Verify
    const rep = await getReputation(freelancer)
    expect(rep.completedProjects).toBe(1)
    expect(rep.karma).toBe(100)
  })
})
```

## Performance Considerations

### Optimization Strategies

1. **Memoization**:
```typescript
const memoizedProject = useMemo(
  () => projects.find(p => p.projectId === id),
  [projects, id]
)
```

2. **Debouncing**:
```typescript
const debouncedFetch = useMemo(
  () => debounce(fetchProjects, 300),
  []
)
```

3. **Pagination**:
```typescript
const [page, setPage] = useState(0)
const pageProjects = projects.slice(page * 10, (page + 1) * 10)
```

## Debugging

### Enable Contract Logging

```typescript
// In development, log all calls
if (process.env.NODE_ENV === 'development') {
  contract.on('*', (event) => {
    console.log('Contract event:', event)
  })
}
```

### Inspect Transaction Details

```typescript
const tx = await createProject(...)
console.log('Transaction:', {
  hash: tx,
  gasPrice: tx.gasPrice,
  gasLimit: tx.gasLimit,
  value: tx.value
})
```

## Deployment Checklist

Before going to production:

- [ ] Smart contract audited by security firm
- [ ] All tests passing
- [ ] Gas costs optimized
- [ ] Error handling comprehensive
- [ ] UI/UX tested on multiple devices
- [ ] Documentation complete
- [ ] Monitoring/alerting set up
- [ ] Incident response plan ready

## Support Resources

- **Smart Contract**: See `contracts/FreelanceEscrow.sol`
- **Hooks**: See `hooks/useEscrow.ts`
- **Components**: See `components/escrow-projects.tsx`, `reputation-profile.tsx`
- **Tests**: See `test/FreelanceEscrow.test.ts`
- **Docs**: See `ESCROW_SYSTEM_README.md`, `QUICKSTART.md`

## Next Steps

1. Deploy to testnet (Sepolia)
2. Conduct security audit
3. Create monitoring dashboard
4. Set up event indexing (The Graph)
5. Build advanced features (milestones, streaming, etc)

---

**Integration complete! Start building with SecureFreel Escrow.** 🚀
