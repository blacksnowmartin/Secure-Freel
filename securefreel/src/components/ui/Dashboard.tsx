import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, Lock, UserCircle2, Plus, DollarSign } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


export default function Dashboard() {
  const [balance, setBalance] = useState("1000")
  const [escrowAmount, setEscrowAmount] = useState("0")
  const [showOnboarding, setShowOnboarding] = useState(false)
  const [showPostProject, setShowPostProject] = useState(false)
  const [showSmartContract, setShowSmartContract] = useState(false)

  const handleEscrowDeposit = (amount: string) => {
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
        <Card>
          <CardHeader>
            <CardTitle>Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${balance}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Escrow</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${escrowAmount}</p>
            <Button className="mt-4" onClick={() => setShowSmartContract(true)}>
              Fund Project
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-between">
            <Button onClick={() => setShowPostProject(true)}>
              <Plus className="mr-2 h-4 w-4" /> Post Project
            </Button>
            <Button onClick={() => setShowOnboarding(true)}>
              <UserCircle2 className="mr-2 h-4 w-4" /> Onboarding
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open" className="w-full">
        <TabsList>
          <TabsTrigger value="open">Open Projects</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing Projects</TabsTrigger>
          <TabsTrigger value="completed">Completed Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="open">
          <Card>
            <CardHeader>
              <CardTitle>Open Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No open projects at the moment.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="ongoing">
          <Card>
            <CardHeader>
              <CardTitle>Ongoing Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No ongoing projects at the moment.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle>Completed Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <p>No completed projects yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showPostProject} onOpenChange={setShowPostProject}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Post a New Project</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-title" className="text-right">
                Title
              </Label>
              <Input id="project-title" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-description" className="text-right">
                Description
              </Label>
              <Input id="project-description" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="project-budget" className="text-right">
                Budget
              </Label>
              <Input id="project-budget" className="col-span-3" type="number" />
            </div>
          </div>
          <Button onClick={() => setShowPostProject(false)}>Post Project</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Freelancer Onboarding</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="freelancer-name" className="text-right">
                Name
              </Label>
              <Input id="freelancer-name" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="freelancer-skills" className="text-right">
                Skills
              </Label>
              <Input id="freelancer-skills" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="freelancer-rate" className="text-right">
                Hourly Rate
              </Label>
              <Input id="freelancer-rate" className="col-span-3" type="number" />
            </div>
          </div>
          <Button onClick={() => setShowOnboarding(false)}>Complete Onboarding</Button>
        </DialogContent>
      </Dialog>

      <Dialog open={showSmartContract} onOpenChange={setShowSmartContract}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Smart Contract Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="escrow-amount" className="text-right">
                Amount
              </Label>
              <Input id="escrow-amount" className="col-span-3" type="number" />
            </div>
          </div>
          <Button onClick={() => {
            const amount = (document.getElementById('escrow-amount') as HTMLInputElement).value
            handleEscrowDeposit(amount)
            setShowSmartContract(false)
          }}>
            <DollarSign className="mr-2 h-4 w-4" /> Fund Escrow
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  )
}