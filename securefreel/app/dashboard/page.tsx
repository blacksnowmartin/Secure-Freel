import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectsOverview } from "@/components/projects-overview"
import { BalanceCard } from "@/components/balance-card"
import { EscrowCard } from "@/components/escrow-card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8 w-full">
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <ProjectsOverview />
          <div className="space-y-4 sm:space-y-6 md:col-span-1 lg:col-span-1">
            <BalanceCard />
            <EscrowCard />
          </div>
        </div>
      </main>
    </div>
  )
}

