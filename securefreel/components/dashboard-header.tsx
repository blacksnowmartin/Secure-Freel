import { Bell, Lock, Shield, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { ConnectWallet } from "@/components/connect-wallet"

export function DashboardHeader() {
  return (
    <header className="border-b">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
          <h1 className="text-lg sm:text-2xl font-bold truncate">SecureFreel</h1>
          <div className="hidden sm:flex space-x-2">
            <Shield className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
            <Lock className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
            <User className="w-4 sm:w-5 h-4 sm:h-5 text-primary flex-shrink-0" />
          </div>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 md:space-x-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <ConnectWallet />
          <Button variant="ghost" size="sm" className="hidden md:block">Martin Kitonga</Button>
        </div>
      </div>
    </header>
  )
}

