"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ordersApi, type Order, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS } from "@/lib/orders-api"

const ITEMS_PER_PAGE = 10

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDIENTE: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["ENVIADO", "CANCELADO"],
  ENVIADO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
}

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true); setError("")
    try { setOrders(await ordersApi.list()) }
    catch { setError("Error al cargar pedidos") }
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function handleStatusChange(id: string, newStatus: string) {
    setActionId(id)
    try { await ordersApi.updateStatus(id, newStatus); await fetchOrders() }
    catch { alert("Error al actualizar estado") }
    finally { setActionId(null) }
  }

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE))
  const paged = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const formatPrice = (p: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
  if (error) return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center"><p className="text-sm text-destructive">{error}</p></div>
  if (orders.length === 0) return <div className="rounded-2xl border border-border bg-card p-12 text-center"><p className="text-sm text-muted-foreground">No hay pedidos registrados.</p></div>

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Pedido</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Cliente</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Fecha</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((o) => {
              const transitions = VALID_TRANSITIONS[o.status] || []
              return (
                <tr key={o.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-medium text-foreground">#{o.id.slice(0, 8)}</p>
                    <p className="text-xs text-muted-foreground">{o.items.length} producto(s)</p>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {o.shippingName}<br /><span className="text-xs">{o.shippingEmail}</span>
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{formatDate(o.createdAt)}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3"><Badge variant={ORDER_STATUS_VARIANTS[o.status]}>{ORDER_STATUS_LABELS[o.status]}</Badge></td>
                  <td className="px-4 py-3 text-right">
                    {transitions.length > 0 && (
                      <div className="flex items-center justify-end gap-1">
                        {transitions.map((ns) => (
                          <Button key={ns} variant="ghost" size="sm" disabled={actionId === o.id} onClick={() => handleStatusChange(o.id, ns)}>
                            {actionId === o.id ? <Loader2 className="size-3 animate-spin" /> : ORDER_STATUS_LABELS[ns]}
                          </Button>
                        ))}
                      </div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{orders.length} pedidos</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="size-4" /></Button>
            <span>{page} de {totalPages}</span>
            <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="size-4" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
