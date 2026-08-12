"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, Loader2, ChevronLeft, ChevronRight, Receipt } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  paymentsApi,
  type PaymentTransaction,
  PAYMENT_STATUS_LABELS,
  PAYMENT_STATUS_VARIANTS,
  PAYMENT_TYPE_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_METHOD_VARIANTS,
} from "@/lib/payments-api"

const ITEMS_PER_PAGE = 10

const PAYMENT_TYPES = ["", "ABONO", "SALDO"]
const PAYMENT_STATUSES = ["", "PENDIENTE", "APROBADO", "RECHAZADO", "REEMBOLSADO"]

export function PaymentsTable() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [page, setPage] = useState(1)

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true); setError("")
    try {
      const data = await paymentsApi.listTransactions({
        search: search || undefined,
        type: typeFilter || undefined,
        status: statusFilter || undefined,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      })
      setTransactions(data)
    } catch {
      setError("Error al cargar transacciones")
    } finally {
      setIsLoading(false)
    }
  }, [search, typeFilter, statusFilter, dateFrom, dateTo])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE))
  const paged = transactions.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  const formatPrice = (p: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)
  const formatDate = (iso: string) => new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })

  function getConcept(p: PaymentTransaction): string {
    if (p.booking?.service?.name) {
      return p.booking.service.name
    }
    if (p.order?.id) {
      return `Pedido #${p.order.id.slice(0, 8)}`
    }
    if (p.metadata?.items?.length) {
      return `Compra — ${p.metadata.items.length} producto(s)`
    }
    return "—"
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o referencia..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(1) }}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {PAYMENT_TYPES.map((t) => (
            <option key={t} value={t}>{t ? PAYMENT_TYPE_LABELS[t] : "Todos los tipos"}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
          className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          {PAYMENT_STATUSES.map((s) => (
            <option key={s} value={s}>{s ? PAYMENT_STATUS_LABELS[s] : "Todos los estados"}</option>
          ))}
        </select>
        <div className="flex items-center gap-2">
          <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }} className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          <span className="text-xs text-muted-foreground">a</span>
          <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }} className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
      </div>

      {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>}
      {error && !isLoading && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={fetchTransactions}>Reintentar</Button>
        </div>
      )}
      {!isLoading && !error && transactions.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <Receipt className="mx-auto size-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">
            {search || typeFilter || statusFilter || dateFrom || dateTo ? "No se encontraron transacciones con esos filtros." : "No hay transacciones registradas."}
          </p>
        </div>
      )}
      {!isLoading && !error && transactions.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Cliente</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Concepto</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Tipo</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Monto</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Método</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Ref. Wompi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-xs">
                      <p className="text-foreground">{formatDate(p.createdAt)}</p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <p className="text-foreground">{p.user?.firstName} {p.user?.lastName}</p>
                      <p className="text-xs text-muted-foreground">{p.user?.email}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground text-xs">{getConcept(p)}</p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.type === "ABONO" ? "default" : "secondary"}>{PAYMENT_TYPE_LABELS[p.type] || p.type}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{formatPrice(p.amount)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={PAYMENT_STATUS_VARIANTS[p.status]}>{PAYMENT_STATUS_LABELS[p.status]}</Badge>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge variant={PAYMENT_METHOD_VARIANTS[p.paymentMethod || "WOMAPI"]}>
                        {PAYMENT_METHOD_LABELS[p.paymentMethod || "WOMAPI"]}
                      </Badge>
                    </td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <p className="font-mono text-xs text-muted-foreground">{p.wompiReference || "—"}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>{transactions.length} transacciones</span>
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
