import { useState, useEffect } from "react"
import { getSales, setSales, getInventory } from "@/lib/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Pencil, Trash2, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

function newLineItem() {
  return { _key: Date.now() + Math.random(), item_id: "", item_name: "", quantity: 1, price: 0 }
}

function calcTotal(lines) {
  return lines.reduce((sum, l) => sum + (l.quantity || 0) * (l.price || 0), 0)
}

export default function SalesPage() {
  const [sales, setSalesState] = useState([])
  const [inventory, setInventory] = useState([])
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [editing, setEditing] = useState(null)
  const [lines, setLines] = useState([newLineItem()])
  const [formError, setFormError] = useState("")

  useEffect(() => {
    setSalesState(getSales())
    setInventory(getInventory())
  }, [])

  function persistSales(next) {
    setSalesState(next)
    setSales(next)
  }

  function openAdd() {
    setEditing(null)
    setLines([newLineItem()])
    setFormError("")
    setDialogOpen(true)
  }

  function openEdit(sale) {
    setEditing(sale)
    setLines(sale.items.map((i) => ({ ...i, _key: Math.random() })))
    setFormError("")
    setDialogOpen(true)
  }

  function selectInventoryItem(lineKey, itemId) {
    const invItem = inventory.find((i) => i.item_id === itemId)
    setLines((prev) =>
      prev.map((l) =>
        l._key === lineKey
          ? { ...l, item_id: invItem?.item_id || "", item_name: invItem?.item_name || "", price: invItem?.price || 0 }
          : l
      )
    )
  }

  function updateQty(lineKey, qty) {
    setLines((prev) =>
      prev.map((l) => (l._key === lineKey ? { ...l, quantity: Math.max(1, parseInt(qty) || 1) } : l))
    )
  }

  function removeLine(lineKey) {
    setLines((prev) => prev.filter((l) => l._key !== lineKey))
  }

  function addLine() {
    setLines((prev) => [...prev, newLineItem()])
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (lines.length === 0) return setFormError("Add at least one item.")
    for (const l of lines) {
      if (!l.item_id) return setFormError("Select an item for every row.")
      if (l.quantity < 1) return setFormError("Quantity must be at least 1.")
    }
    setFormError("")

    const cleanLines = lines.map(({ _key, ...rest }) => rest)
    const total_amount = calcTotal(lines)

    if (editing) {
      persistSales(
        sales.map((s) =>
          s.sale_id === editing.sale_id ? { ...s, items: cleanLines, total_amount } : s
        )
      )
    } else {
      const saleNum = String(sales.length + 1).padStart(3, "0")
      const newSale = { sale_id: `SALE${saleNum}`, items: cleanLines, total_amount }
      persistSales([...sales, newSale])
    }
    setDialogOpen(false)
  }

  function handleDelete() {
    persistSales(sales.filter((s) => s.sale_id !== deleteId))
    setDeleteId(null)
  }

  const total = calcTotal(lines)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Sales</h1>
          <p className="text-sm text-muted-foreground">Track and manage your transactions</p>
        </div>
        <Button onClick={openAdd} size="sm" disabled={inventory.length === 0}>
          <Plus className="mr-2 h-4 w-4" />
          Add Sale
        </Button>
      </div>

      {inventory.length === 0 && (
        <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          Add products to your Inventory first before creating sales.
        </div>
      )}

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Sale ID</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Items</th>
              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  No sales recorded yet.
                </td>
              </tr>
            ) : (
              sales.map((sale) => (
                <tr key={sale.sale_id} className="border-b border-border last:border-0 hover:bg-muted/30">
                  <td className="px-4 py-3 font-mono text-xs font-medium text-muted-foreground">{sale.sale_id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {sale.items.map((item, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {item.item_name} × {item.quantity}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">
                    Rs. {sale.total_amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(sale)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setDeleteId(sale.sale_id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? `Edit ${editing.sale_id}` : "New Sale"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-3">
              <Label>Items</Label>
              {lines.map((line) => (
                <div key={line._key} className="flex items-center gap-2">
                  <Select value={line.item_id} onValueChange={(v) => selectInventoryItem(line._key, v)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select item" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventory.map((inv) => (
                        <SelectItem key={inv.item_id} value={inv.item_id}>
                          {inv.item_name} — Rs. {inv.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    min="1"
                    className="w-20"
                    value={line.quantity}
                    onChange={(e) => updateQty(line._key, e.target.value)}
                  />
                  <span className="w-24 text-right text-sm text-muted-foreground">
                    Rs. {((line.quantity || 0) * (line.price || 0)).toLocaleString()}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeLine(line._key)}
                    disabled={lines.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={addLine}>
                <Plus className="mr-1 h-3 w-3" />
                Add Row
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-4 py-2">
              <span className="text-sm font-medium text-muted-foreground">Total Amount</span>
              <span className="text-base font-bold text-foreground">Rs. {total.toLocaleString()}</span>
            </div>

            {formError && <p className="text-sm text-destructive">{formError}</p>}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">{editing ? "Save Changes" : "Record Sale"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Sale</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this sale record? This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
