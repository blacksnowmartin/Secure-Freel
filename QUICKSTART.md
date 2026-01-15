# Quick Start Guide - SecureFreel Escrow System

Get the escrow system running in 5 minutes!

## 1. Install Dependencies

```bash
cd securefreel
npm install
```

## 2. Compile Smart Contract

```bash
npm run hardhat:compile
```

## 3. Start Local Blockchain

In a new terminal:
```bash
npm run hardhat:node
```

This starts a local Ethereum node on `http://localhost:8545`

## 4. Deploy Contract

In another terminal:
```bash
npm run hardhat:deploy
```

You'll see output like:
```
✅ FreelanceEscrow deployed to: 0x5FbDB2315678afccb333f8a9c614026efdb98F2e
```

## 5. Setup Frontend Environment

Create `securefreel/.env.local`:
```
NEXT_PUBLIC_NETWORK=localhost
NEXT_PUBLIC_CONTRACT_ADDRESS=0x5FbDB2315678afccb333f8a9c614026efdb98F2e
```

## 6. Run Frontend

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## 7. Connect Wallet

1. Click "Connect Wallet" in the header
2. Select Metamask (or your preferred wallet)
3. Switch to **Localhost 8545** network in your wallet
4. Import test accounts from Hardhat (printed at startup)

## 8. Test the System

### Create a Project (as Client)
1. Go to Dashboard → Smart Contract Projects
2. Click "Create Project"
3. Fill in details:
   - Title: "Test Web3 Project"
   - Amount: 1.0 (ETH)
4. Click "Create"
5. See your project appear in the list

### Accept Project (as Different Wallet)
1. Switch to another test account in Metamask
2. Refresh the page
3. Find the project in the list
4. Click on it → "Accept Project"

### Fund Project (as Client)
1. Switch back to original wallet (client)
2. Click project → "Fund Project"
3. Approve transaction

### Work on Project (as Freelancer)
1. Switch to freelancer account
2. Click "Start Work"
3. When done, submit work with IPFS hash or URL
4. Click "Submit Work"

### Approve & Release Funds (as Client)
1. Switch to client account
2. Review the submitted work
3. Click "Approve Completion"
4. Funds automatically released to freelancer
5. 2% fee sent to treasury
6. Freelancer karma increases by 100!

## Testing Without Frontend

Run automated tests:
```bash
npm run hardhat:test
```

## Useful Hardhat Commands

```bash
# Compile contracts
npm run hardhat:compile

# Run tests
npm run hardhat:test

# Deploy to localhost
npm run hardhat:deploy

# Deploy to testnet
npm run hardhat:deploy -- --network sepolia

# Get contract info
npm run hardhat:node  # Starts node with pre-deployed contracts
```

## Troubleshooting

### "Contract not deployed"
- Ensure `hardhat:node` is running in another terminal
- Make sure contract address in `.env.local` is correct
- Check the address printed by `hardhat:deploy`

### "Wallet not connecting"
- Switch to Localhost 8545 in Metamask
- Clear browser cache
- Try different wallet provider

### "Transaction failed"
- Ensure account has enough test ETH (Hardhat gives 10000 ETH per account)
- Check that you're performing valid action for current state
- Review error message for details

### "Can't see smart contract projects"
- Ensure wallet is connected
- Check Network is set to Localhost (31337)
- Try refreshing page

## Network Details

**Local Development:**
- RPC URL: `http://localhost:8545`
- Chain ID: 31337
- Gas Price: 1 gwei
- All accounts have 10000 ETH

## Default Test Accounts

Hardhat creates 20 test accounts with private keys:
```
Account 0: 0x8ba1f109551bD432803012645Ac136ddd64DBA72
...Account 19: (printed at startup)
```

Seed phrase (if using in Metamask):
```
Each hardhat:node restart generates new test accounts
```

## Next Steps

1. **Explore Reputation System**
   - Complete projects to increase karma
   - Watch reputation profile update

2. **Test Dispute Resolution**
   - Initiate a dispute
   - See dispute handling in action

3. **Try Different Networks**
   - Switch to Sepolia testnet
   - Use real test ETH
   - Interact with actual blockchain

4. **Build on Top**
   - Integrate with other Web3 apps
   - Add NFT badges for milestones
   - Create governance features

## Documentation

For detailed information, see:
- `ESCROW_SYSTEM_README.md` - Complete system documentation
- `contracts/FreelanceEscrow.sol` - Smart contract code with comments
- `hooks/useEscrow.ts` - React hooks documentation

## Support

Issues? Check:
1. Hardhat docs: https://hardhat.org
2. Ethers.js docs: https://docs.ethers.org
3. OpenZeppelin docs: https://docs.openzeppelin.com

---

**Happy testing! 🚀**
