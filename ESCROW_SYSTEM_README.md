# SecureFreel - Web3 Freelance Escrow System

A complete Web3-based freelance platform with smart contract-based escrow, role-based access control, project state management, reputation scoring, and automatic fee deduction.

## Features

### 1. Escrow System
- **Secure Fund Locking**: Clients deposit ETH or ERC20 tokens that are locked in the smart contract
- **Automated Release**: Funds are released to freelancers only upon project completion
- **Refund Mechanism**: Disputed or cancelled projects return funds to the client
- **2% Platform Fee**: Automatic deduction from successful payouts to the treasury

### 2. Role-Based Access Control
- **Client Role**: Project creators who fund and approve work
- **Freelancer Role**: Service providers who deliver work
- **Clear Permission Model**: Each role has specific actions they can perform

### 3. Project State Management
The system uses a multi-state project lifecycle:

- **Open**: Project created, waiting for freelancer acceptance
- **Funded**: Client has deposited funds into escrow
- **InProgress**: Freelancer is actively working on the project
- **UnderReview**: Freelancer submitted work, awaiting client approval
- **Completed**: Project successfully completed, funds released
- **Disputed**: Project under dispute investigation
- **Cancelled**: Project cancelled, funds returned

### 4. Reputation System (Karma)
- **Karma Points**: Users earn reputation through successful completions
  - +100 karma per completed project
  - -50 karma per disputed project
- **Success Rate**: Calculated percentage of successful projects
- **Reputation Levels**:
  - New: 0-99 karma
  - Trusted: 100-499 karma
  - Expert: 500-999 karma
  - Elite: 1000+ karma
- **Visible Metrics**:
  - Completed projects count
  - Total earnings
  - Success rate percentage
  - Dispute history

### 5. Fee Logic
- **Platform Fee**: 2% of project amount (200 basis points)
- **Automatic Deduction**: Fees are automatically deducted upon project completion
- **Treasury Management**: Fees accumulate in treasury address
- **Configurable**: Admin can adjust fee percentage (max 10%)

## Technical Architecture

### Smart Contract (Solidity)

**File**: `contracts/FreelanceEscrow.sol`

#### Key Functions

**Client Operations**:
- `createProject()` - Create a new project
- `fundProject()` - Deposit funds into escrow
- `approveCompletion()` - Approve completed work and release funds
- `initiateDispute()` - Initiate dispute resolution

**Freelancer Operations**:
- `acceptProject()` - Accept a project
- `startWork()` - Start working on funded project
- `submitWork()` - Submit deliverables for review
- `initiateDispute()` - Challenge client decision

**Admin Operations**:
- `resolveDispute()` - Settle disputes and release funds accordingly
- `setPlatformFee()` - Update fee percentage
- `setTreasuryAddress()` - Update treasury address
- `withdrawFees()` - Withdraw accumulated fees

#### State Variables
```solidity
mapping(uint256 => Project) public projects;
mapping(address => UserReputation) public userReputations;
mapping(address => uint256[]) public userProjects;
uint256 public platformFeePercentage = 200; // 2%
address public treasuryAddress;
```

### React Hooks (`hooks/useEscrow.ts`)

#### Available Hooks

1. **`useEscrowContract()`**
   - Initializes contract connection
   - Manages signer and provider
   - Returns contract instance

2. **`useProjectOperations()`**
   - `createProject()` - Create new project
   - `fundProject()` - Fund a project
   - `acceptProject()` - Accept project as freelancer
   - `startWork()` - Transition to in-progress
   - `submitWork()` - Submit deliverables
   - `approveCompletion()` - Approve and release funds
   - `initiateDispute()` - Initiate dispute

3. **`useProjectData()`**
   - `fetchProjects()` - Get all projects
   - `fetchProject()` - Get single project details
   - Manages loading and error states

4. **`useUserReputation()`**
   - `fetchReputation()` - Get user reputation data
   - Returns karma, earnings, success rate, etc.

5. **`useUserProjects()`**
   - `fetchUserProjects()` - Get projects for specific user
   - Returns array of project IDs

#### Helper Functions
- `getProjectStatusLabel()` - Convert status number to readable text
- `isClientRole()` - Check if user is client
- `isFreelancerRole()` - Check if user is freelancer
- `canUserFundProject()` - Check if action is allowed
- `canUserAcceptProject()` - Check if action is allowed
- `canUserStartWork()` - Check if action is allowed
- `canUserSubmitWork()` - Check if action is allowed
- `canUserApproveCompletion()` - Check if action is allowed

## Frontend Components

### 1. EscrowProjects (`components/escrow-projects.tsx`)
- Display all smart contract projects
- Create new projects
- Show project details in modal
- Context-aware actions based on user role
- Mobile-responsive design

### 2. ReputationProfile (`components/reputation-profile.tsx`)
- Display user reputation score
- Show karma level (New/Trusted/Expert/Elite)
- Display completion statistics
- Show total earnings
- Display dispute history
- Visual indicators and badges

## Setup Instructions

### Prerequisites
- Node.js 18+
- Hardhat installed
- Wallet with test ETH (for testnet)

### Installation

1. **Install Dependencies**
```bash
cd securefreel
npm install
```

2. **Setup Hardhat**
```bash
npm run hardhat:compile
```

3. **Deploy Contract**
```bash
# Local development
npm run hardhat:node  # In one terminal
npm run hardhat:deploy  # In another terminal

# Testnet (e.g., Sepolia)
npm run hardhat:deploy -- --network sepolia
```

4. **Update Contract Address**
After deployment, update the address in `lib/contracts/config.ts`:
```typescript
export const CONTRACT_ADDRESSES: Record<string, string> = {
  localhost: "0x...", // Your deployed address
};
```

5. **Run Application**
```bash
npm run dev
```

## Usage Guide

### For Clients

1. **Create Project**
   - Go to Dashboard → Smart Contract Projects
   - Click "Create Project"
   - Enter project title and amount in ETH
   - Freelancer accepts the project

2. **Fund Project**
   - Click project → "Fund Project"
   - Confirm wallet transaction
   - Funds are now locked in escrow

3. **Review & Approve**
   - When freelancer submits work, review it
   - Click "Approve Completion" to release funds
   - Freelancer receives payment (minus 2% fee)

4. **Dispute Resolution**
   - If work is unsatisfactory, click "Initiate Dispute"
   - Platform admin reviews and decides
   - Funds either released or refunded

### For Freelancers

1. **Accept Project**
   - Browse available projects
   - Click project → "Accept Project"
   - Wait for client to fund

2. **Start Working**
   - Once project is funded, click "Start Work"
   - Project transitions to in-progress

3. **Submit Work**
   - Prepare deliverables
   - Upload to IPFS (or cloud storage)
   - Enter IPFS hash/URI
   - Click "Submit Work"

4. **Receive Payment**
   - Wait for client approval
   - Upon approval, payment released automatically
   - 2% platform fee deducted
   - Receive 98% of project amount
   - Karma increases by 100 points

## Environment Variables

Create `.env.local` in `securefreel/` directory:

```
# Contract Network
NEXT_PUBLIC_NETWORK=localhost
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...

# Hardhat Deployment
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_API_KEY
PRIVATE_KEY=your_private_key_here
TREASURY_ADDRESS=0x...  # Where fees go (defaults to deployer)
```

## Contract ABI

All contract functions are exposed through:
- `lib/contracts/abi.ts` - Full ABI and enums
- `lib/contracts/types.ts` - TypeScript interfaces
- `lib/contracts/config.ts` - Contract addresses and network config

## Deployment on Different Networks

### Local Development
```bash
npm run hardhat:node
npm run hardhat:deploy
```

### Sepolia Testnet
1. Get Sepolia ETH from faucet
2. Set environment variables
3. Deploy:
```bash
npm run hardhat:deploy -- --network sepolia
```

### Mainnet (Production)
⚠️ **Only after thorough testing:**
```bash
npm run hardhat:deploy -- --network mainnet
```

## Security Considerations

1. **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
2. **Access Control**: Role-based modifiers for all critical functions
3. **Escrow Locking**: Funds cannot be accessed until completion
4. **Admin Controlled**: Only contract owner can resolve disputes and withdraw fees
5. **ERC20 Support**: Works with any standard ERC20 token, not just ETH

## Testing

### Run Tests
```bash
npm run hardhat:test
```

### Test Files
- `test/FreelanceEscrow.test.ts` - Comprehensive test suite

## Gas Optimization

The contract is optimized for:
- Minimal state changes
- Efficient storage layout
- Optimized compiler settings (200 runs)
- Batch operations where possible

## Roadmap

Future enhancements:
- [ ] Milestone-based payments
- [ ] Automated arbitration using Chainlink
- [ ] Governance token ($FREE)
- [ ] Staking mechanism for reputation
- [ ] Multi-signature escrow for high-value projects
- [ ] Integration with payment channels for faster settlement

## Troubleshooting

### Contract Not Deploying
- Ensure Hardhat node is running
- Check gas limits and account balance
- Verify contract address in config

### Wallet Not Connecting
- Clear browser cache
- Check Web3Modal configuration
- Ensure correct network selected

### Transactions Failing
- Verify sufficient ETH for gas
- Check project state before action
- Review error message for specific issue

## Support & Contributing

For issues or suggestions:
1. Check existing GitHub issues
2. Create detailed bug report
3. Include transaction hash if applicable
4. Provide contract address and network

## License

MIT License - See LICENSE file for details

## Contract Events

The contract emits events for all major actions:
- `ProjectCreated` - New project created
- `ProjectFunded` - Funds deposited
- `ProjectAccepted` - Freelancer accepted
- `ProjectStarted` - Work started
- `WorkSubmitted` - Deliverables submitted
- `ProjectCompleted` - Project completed, funds released
- `DisputeInitiated` - Dispute started
- `DisputeResolved` - Dispute outcome
- `ReputationUpdated` - Karma/reputation changed

These can be used to build real-time notifications and analytics.
