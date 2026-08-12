"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { auditApi, type AuditLogEntry } from "@/lib/audit-api"

const ENTITY_LABELS: Record<string, string> = {
  users: "Usuarios",
  services: "Servicios",
  products: "Productos",
  categories: "Categorías",
  coupons: "Cupones",
  bookings: "Citas",
  payments: "Pagos",
  orders: "Pedidos",
  cart: "Carrito",
}

const ACTION_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  POST: "default",
  PATCH: "secondary",
  PUT: "secondary",
  DELETE: "destructive",
}

export default function AuditoriaPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchLogs = useCallback(async (p: number) => {
    setIsLoading(true)
    setError("")
    try {
      const result = await auditApi.list({ page: p, limit: 50 })
      setLogs(result.data)
      setTotal(result.total)
      setTotalPages(result.totalPages)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message) ? err.message[0] : err.message
          : "Error al cargar auditoría"
      setError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchLogs(page) }, [fetchLogs, page])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleString("es-CO", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    })
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <ShieldCheck className="size-5 text-primary" strokeWidth={1.5} />
        <div>
          <h1 className="font-heading text-xl font-semibold">Auditoría</h1>
          <p className="text-sm text-muted-foreground">Registro de acciones realizadas por admin y empleados.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-4" onClick={() => fetchLogs(page)}>Reintentar</Button>
        </div>
      ) : logs.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">Aún no hay registros de auditoría.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Fecha</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Usuario</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Acción</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Entidad</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                      {formatDate(log.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      {log.actorEmail || "Sistema"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ACTION_VARIANTS[log.action] || "outline"}>{log.action}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {ENTITY_LABELS[log.entity] || log.entity}
                    </td>
                    <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground md:table-cell">
                      {log.entityId || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>{total} registros</span>
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="size-4" />
                </Button>
                <span>{page} de {totalPages}</span>
                <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
