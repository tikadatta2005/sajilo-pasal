import { useState, useEffect } from "react"
import { getSales, getInventory } from "@/lib/storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, DollarSign, Package } from "lucide-react"

export default function DashboardPage() {
  const [sales, setSales] = useState([])
  const [inventory, setInventory] = useState([])

  useEffect(() => {
    setSales(getSales())
    setInventory(getInventory())
  }, [])

  const totalSalesAmount = sales.reduce((sum, s) => sum + (s.total_amount || 0), 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Overview of your business</p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{sales.length}</p>
            <p className="text-xs text-muted-foreground mt-1">transactions recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">Rs. {totalSalesAmount.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-1">across all sales</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Inventory Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-foreground">{inventory.length}</p>
            <p className="text-xs text-muted-foreground mt-1">products in stock</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
