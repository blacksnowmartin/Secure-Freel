import { DashboardHeader } from "@/components/dashboard-header"
import { ProjectsOverview } from "@/components/projects-overview"
import { ProjectsOverview as EscrowProjects } from "@/components/escrow-projects"
import { BalanceCard } from "@/components/balance-card"
import { EscrowCard } from "@/components/escrow-card"
import { ReputationProfile } from "@/components/reputation-profile"

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader />
      <main className="flex-1 container mx-auto px-3 sm:px-4 py-4 sm:py-8 w-full">
        {/* Reputation and Balance Cards */}
        <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 mb-6 sm:mb-8">
          <ReputationProfile />
          <div className="space-y-4 sm:space-y-6">
            <BalanceCard />
            <EscrowCard />
          </div>
        </div>

        {/* Smart Contract Projects */}
        <div className="mb-6 sm:mb-8">
          <EscrowProjects />
        </div>

        {/* Legacy Projects */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Other Projects</h2>
          <ProjectsOverview />
        </div>
      </main>
    </div>
  )
}

