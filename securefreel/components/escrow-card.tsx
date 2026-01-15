import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EscrowCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Escrow</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs sm:text-sm text-muted-foreground mb-4">
          Securely fund projects using smart contracts
        </div>
        <Button className="w-full text-xs sm:text-sm">Fund Project</Button>
      </CardContent>
    </Card>
  )
}

