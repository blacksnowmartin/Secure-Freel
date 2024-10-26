# SecureFreel
The vision of SecureFreel is to revolutionize freelance work by providing a secure, anonymous platform for clients and freelancers. Through Arbitrum Stylus, the platform ensures confidentiality, privacy, and seamless transactions, empowering both parties to collaborate efficiently without compromising on security or convenience.

Recent development is to migrate the project to Base and Stylus Arbitrum Chains.
I'll guide you through setting up the environment from scratch and importing the necessary modules to achieve the SecureFreel dashboard preview we created earlier. Let's go through this step-by-step.

I'll guide you through converting the SecureFreel project to use Hardhat for Ethereum development and Yarn as the package manager, while also switching from TypeScript to JavaScript. This will involve setting up a new project structure and making some changes to our existing code.

Let's go through this step-by-step:

1. First, let's create a new directory and initialize a Yarn project:


```shellscript
mkdir securefreel-hardhat
cd securefreel-hardhat
yarn init -y
```

2. Now, let's install Hardhat and the necessary dependencies:


```shellscript
yarn add --dev hardhat @nomicfoundation/hardhat-toolbox
yarn add react react-dom next
yarn add @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-tabs lucide-react
```

3. Initialize a Hardhat project:


```shellscript
npx hardhat
```

Choose "Create a JavaScript project" when prompted. This will set up a basic Hardhat project structure.

4. Now, let's set up the Next.js part of our project. Create a new directory called `frontend` in the root of your project:


```shellscript
mkdir frontend
cd frontend
```

5. Create a `pages` directory inside `frontend`:


```shellscript
mkdir pages
```

6. Create a `components` directory inside `frontend`:


```shellscript
mkdir components
```

7. Now, let's convert our `Dashboard.tsx` to JavaScript. Create a new file `frontend/components/Dashboard.js` and add the following content:


```javascript
import React, { useState } from 'react'
import { Shield, Lock, UserCircle2, Plus, DollarSign } from 'lucide-react'

export default function Dashboard() {
  const [balance, setBalance] = useState("1000")
  const [escrowAmount, setEscrowAmount] = useState("0")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPostProject, setShowPostProject] = useState(false)
  const [showSmartContract, setShowSmartContract] = useState(false)

  const handleEscrowDeposit = (amount) => {
    setEscrowAmount((prevAmount) => (parseFloat(prevAmount) + parseFloat(amount)).toString())
    setBalance((prevBalance) => (parseFloat(prevBalance) - parseFloat(amount)).toString())
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8 flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-800">SecureFreel</h1>
        <div className="flex space-x-4">
          <Shield className="w-6 h-6 text-blue-500" />
          <Lock className="w-6 h-6 text-blue-500" />
          <UserCircle2 className="w-6 h-6 text-blue-500" />
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Balance</h2>
          <p className="text-3xl font-bold">${balance}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Escrow</h2>
          <p className="text-3xl font-bold">${escrowAmount}</p>
          <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowSmartContract(true)}>
            Fund Project
          </button>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Actions</h2>
          <div className="flex justify-between">
            <button className="bg-green-500 text-white px-4 py-2 rounded flex items-center" onClick={() => setShowPostProject(true)}>
              <Plus className="mr-2 h-4 w-4" /> Post Project
            </button>
            <button className="bg-purple-500 text-white px-4 py-2 rounded flex items-center" onClick={() => setShowOnboarding(true)}>
              <UserCircle2 className="mr-2 h-4 w-4" /> Onboarding
            </button>
          </div>
        </div>
      </div>

      {/* Tabs for projects */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex mb-4">
          <button className="mr-4 font-semibold text-blue-500">Open Projects</button>
          <button className="mr-4 font-semibold">Ongoing Projects</button>
          <button className="font-semibold">Completed Projects</button>
        </div>
        <div>
          <p>No open projects at the moment.</p>
        </div>
      </div>

      {/* Dialogs */}
      {showPostProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Post a New Project</h2>
            <div className="mb-4">
              <label className="block mb-2">Title</label>
              <input className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Description</label>
              <input className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Budget</label>
              <input className="w-full border p-2 rounded" type="number" />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowPostProject(false)}>Post Project</button>
          </div>
        </div>
      )}

      {showOnboarding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Freelancer Onboarding</h2>
            <div className="mb-4">
              <label className="block mb-2">Name</label>
              <input className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Skills</label>
              <input className="w-full border p-2 rounded" />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Hourly Rate</label>
              <input className="w-full border p-2 rounded" type="number" />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => setShowOnboarding(false)}>Complete Onboarding</button>
          </div>
        </div>
      )}

      {showSmartContract && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Smart Contract Payment</h2>
            <div className="mb-4">
              <label className="block mb-2">Amount</label>
              <input id="escrow-amount" className="w-full border p-2 rounded" type="number" />
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center" onClick={() => {
              const amount = document.getElementById('escrow-amount').value
              handleEscrowDeposit(amount)
              setShowSmartContract(false)
            }}>
              <DollarSign className="mr-2 h-4 w-4" /> Fund Escrow
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
```

8. Create a new file `frontend/pages/index.js` with the following content:


```javascript
import Dashboard from '../components/Dashboard'

export default function Home() {
  return <Dashboard />
}
```

9. Now, let's set up Tailwind CSS. First, install the necessary dependencies:


```shellscript
yarn add --dev tailwindcss postcss autoprefixer
```

10. Initialize Tailwind CSS:


```shellscript
npx tailwindcss init -p
```

11. Update the `tailwind.config.js` file in the `frontend` directory:


```javascript
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

12. Create a `frontend/styles/globals.css` file with the following content:


```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

13. Create a `frontend/pages/_app.js` file with the following content:


```javascript
import '../styles/globals.css'

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp
```

14. Update the `package.json` in the root directory to include scripts for running the frontend:


```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

15. Finally, let's create a simple smart contract for the escrow functionality. Create a new file `contracts/Escrow.sol`:


```plaintext
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Escrow {
    address public client;
    address public freelancer;
    uint public amount;
    bool public funded;
    bool public completed;

    constructor(address _freelancer) {
        client = msg.sender;
        freelancer = _freelancer;
    }

    function fund() public payable {
        require(msg.sender == client, "Only client can fund");
        require(!funded, "Already funded");
        amount = msg.value;
        funded = true;
    }

    function release() public {
        require(msg.sender == client, "Only client can release funds");
        require(funded, "Not funded");
        require(!completed, "Already completed");
        payable(freelancer).transfer(amount);
        completed = true;
    }
}
```

This setup creates a basic Hardhat project with a Next.js frontend using JavaScript. The `Dashboard` component has been converted to JavaScript and simplified to use basic HTML and Tailwind CSS classes instead of the shadcn/ui components.

To run the project:

1. Start the Hardhat node:


```shellscript
npx hardhat node
```

2. In a new terminal, deploy the smart contract:


```shellscript
npx hardhat run scripts/deploy.js --network localhost
```

3. Start the Next.js development server:


```shellscript
cd frontend
yarn dev
```

You can now access your application at `http://localhost:3000`.

Remember, this is a basic setup and you'll need to implement the actual interaction between the frontend and the smart contract. You may want to use libraries like ethers.js or web3.js to interact with the blockchain from your frontend.
https://gamma.app/docs/SecureFreel-The-Future-of-Decentralized-Freelance-Platforms-a9du1org6g9dtvk
