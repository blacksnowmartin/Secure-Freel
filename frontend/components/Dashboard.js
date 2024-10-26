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