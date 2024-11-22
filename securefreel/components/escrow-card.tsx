import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EscrowCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Escrow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          Securely fund projects using smart contracts
        </div>
        <Button className="w-full">Fund Project</Button>
      </CardContent>
    </Card>
  )
}

