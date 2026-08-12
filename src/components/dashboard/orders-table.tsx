"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ordersApi, type Order, ORDER_STATUS_LABELS, ORDER_STATUS_VARIANTS } from "@/lib/orders-api"
import { useToast } from "@/context/toast-provider"

const ITEMS_PER_PAGE = 10

const VALID_TRANSITIONS: Record<string, string[]> = {
  PENDIENTE: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["ENVIADO", "CANCELADO"],
  ENVIADO: ["ENTREGADO"],
  ENTREGADO: [],
  CANCELADO: [],
}

const ORDER_STATUSES = ["", "PENDIENTE", "CONFIRMADO", "ENVIADO", "ENTREGADO", "CANCELADO"]

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState<string | null>(null)
  const { success: showSuccess, error: showError } = useToast()

  const fetchOrders = useCallback(async () => {
    setIsLoading(true); setError("")
    try {
      const data = await ordersApi.list({
        search: search || undefined,
        status: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      })
      setOrders(data)
    } catch {
      setError("Error al cargar pedidos")
    } finally {
      setIsLoading(false)
    }
  }, [search, statusFilter, dateFrom, dateTo])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  async function handleStatusChange(id: string, newStatus: string) {
    setActionId(id)
    try {
      await ordersApi.updateStatus(id, newStatus)
      showSuccess(`Pedido actualizado a ${ORDER_STATUS_LABELS[newStatus]}`)
      await fetchOrders()
    } catch {
      showError("Error al actualizar estado")
    } finally {
      setActionId(null)
    }
  }

  const totalPages = Math.max(1, Math.ceil(orders.length / ITEMS_PER_PAGE))
  const paged = orders.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const formatPrice = (p: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>{s ? ORDER_STATUS_LABELS[s] : "Todos los estados"}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <span className="text-xs text-muted-foreground">a</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
            className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
      {error && !isLoading && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchOrders}>Reintentar</Button>
        </div>
      )}
      {!isLoading && !error && orders.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search || statusFilter || dateFrom || dateTo ? "No se encontraron pedidos con esos filtros." : "No hay pedidos registrados."}
          </p>
        </div>
      )}
      {!isLoading && !error && orders.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Pedido</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Cliente</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Fecha</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Envío</th>
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
                      <td className="hidden px-4 py-3 sm:table-cell">
                        <p className="text-foreground">{o.shippingName}</p>
                        <p className="text-xs text-muted-foreground">{o.shippingEmail}</p>
                      </td>
                      <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{formatDate(o.createdAt)}</td>
                      <td className="px-4 py-3 font-medium">{formatPrice(o.total)}</td>
                      <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                        {o.shippingCity ? `${o.shippingCity}` : "—"}
                        <br /><span className="text-xs">{o.shippingPhone || "—"}</span>
                      </td>
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
        </>
      )}
    </div>
  )
}
