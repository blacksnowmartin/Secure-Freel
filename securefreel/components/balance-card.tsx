import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function BalanceCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl sm:text-3xl font-bold mb-2">2.5 ETH</div>
        <div className="text-xs sm:text-sm text-muted-foreground mb-4">≈ $4,250.00 USD</div>
        <div className="flex gap-2 w-full">
          <Button variant="outline" size="sm" className="flex-1">Withdraw</Button>
          <Button variant="outline" size="sm" className="flex-1">Deposit</Button>
        </div>
      </CardContent>
    </Card>
  )
}

