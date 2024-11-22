import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectsOverview } from "@/components/projects-overview"
import { BalanceCard } from "@/components/balance-card"
import { EscrowCard } from "@/components/escrow-card"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <ProjectsOverview />
          <div className="space-y-6">
            <BalanceCard />
            <EscrowCard />
          </div>
        </div>
      </main>
    </div>
  )
}

