import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BalanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold mb-2">2.5 ETH</div>
        <div className="text-sm text-muted-foreground mb-4">≈ $4,250.00 USD</div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">Withdraw</Button>
          <Button variant="outline" size="sm">Deposit</Button>
        </div>
      </CardContent>
    </Card>
  )
}

