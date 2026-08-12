"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ordersApi, type Order, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS } from "@/lib/orders-api"

export function MyOrders({ showTitle = true }: { showTitle?: boolean }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setIsLoading(true)
    try { setOrders((await ordersApi.listMy()).data) }
    catch {}
    finally { setIsLoading(false) }
  }, [])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const formatPrice = (p: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })

  if (isLoading) return <div className="flex items-center justify-center py-12"><Loader2 className="size-5 animate-spin text-muted-foreground" /></div>

  return (
    <div className={showTitle ? "mt-8" : ""}>
      {showTitle && <h2 className="font-heading text-lg font-semibold mb-4">Mis pedidos</h2>}
      {orders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-8 text-center">
          <Package className="mx-auto size-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">Aún no has realizado ningún pedido.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <div key={o.id} className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-xs text-muted-foreground">Pedido #{o.id.slice(0, 8)} · {formatDate(o.createdAt)}</p>
                  <p className="font-semibold">{formatPrice(o.total)}</p>
                </div>
                <Badge variant={ORDER_STATUS_VARIANTS[o.status]}>{ORDER_STATUS_LABELS[o.status]}</Badge>
              </div>
              <div className="space-y-1 border-t border-border pt-3">
                {o.items.map((i) => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span>{i.name} <span className="text-muted-foreground">x{i.quantity}</span></span>
                    <span className="text-muted-foreground">{formatPrice(i.price * i.quantity)}</span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Envío: {o.shippingAddress}, {o.shippingCity}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
