import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function ProjectsOverview() {
  const projects = [
    { id: 1, title: "Web3 Marketplace System Development", status: "open" },
    { id: 2, title: "DeFi Dashboard Improvement", status: "ongoing" },
    { id: 3, title: "NFT Gallery Website Development", status: "completed" },
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

