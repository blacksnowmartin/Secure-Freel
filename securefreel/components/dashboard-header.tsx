import { Bell, Lock, Shield, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold">SecureFreel</h1>
          <div className="flex space-x-2">
            <Shield className="w-5 h-5 text-primary" />
            <Lock className="w-5 h-5 text-primary" />
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="w-5 h-5" />
          </Button>
          <ConnectWallet />
          <Button variant="ghost" size="sm">Martin Kitonga</Button>
        </div>
      </div>
    </header>
  )
}

