import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProjectsOverview() {
  const projects = [
    { id: 1, title: "Web3 Marketplace System Development", status: "open" },
    { id: 2, title: "DeFi Dashboard Improvement", status: "ongoing" },
    { id: 3, title: "NFT Gallery Website Development", status: "completed" },
    { id: 4, title: "Crypto Wallet Assistance", status: "ongoing"},
    { id: 5, title: "P2P Trader needed for 1 Week Project", status: "open"},
    { id: 6, title: "Blockchain-based Supply Chain Management", status: "open" },
    { id: 7, title: "Smart Contract Development for Gaming", status: "ongoing" },
    { id: 8, title: "Decentralized Finance (DeFi) Lending Platform", status: "completed" },
    { id: 9, title: "Cryptocurrency Trading Bot Development", status: "ongoing" },
    { id: 10, title: "Non-Fungible Token (NFT) Marketplace Development", status: "open" },
    { id: 11, title: "Cross-chain Bridge Implementation", status: "open" },
    { id: 12, title: "DAO Governance Platform Development", status: "ongoing" },
    { id: 13, title: "Zero-Knowledge Proof Integration", status: "completed" },
    { id: 14, title: "Metaverse Asset Management System", status: "open" },
    { id: 15, title: "Layer 2 Scaling Solution Development", status: "ongoing" },
    { id: 16, title: "Decentralized Identity System", status: "completed" },
    { id: 17, title: "Tokenization Platform for Real Estate", status: "open" },
    { id: 18, title: "Web3 Social Media Platform", status: "ongoing" },
    { id: 19, title: "Blockchain Analytics Dashboard", status: "completed" },
    { id: 20, title: "DeFi Yield Aggregator Development", status: "open" }
  ]

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Projects Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {["Open Projects", "Ongoing Projects", "Completed Projects"].map((section) => (
            <div key={section}>
              <h3 className="font-semibold mb-2">{section}</h3>
              <div className="space-y-2">
                {projects
                  .filter((project) => project.status === section.split(" ")[0].toLowerCase())
                  .map((project) => (
                    <div key={project.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                      <span>{project.title}</span>
                      <Badge variant={project.status === "open" ? "default" : project.status === "ongoing" ? "secondary" : "outline"}>
                        {project.status}
                      </Badge>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

