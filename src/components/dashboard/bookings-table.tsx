"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Check, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { bookingsApi } from "@/lib/bookings-api"
import type { Booking, BookingStatus } from "@/types/booking"

const STATUS_LABELS: Record<BookingStatus, string> = {
  PENDIENTE_PAGO: "Pendiente",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
  COMPLETADA: "Completada",
  NO_ASISTIO: "No asistió",
}

const STATUS_VARIANTS: Record<BookingStatus, "default" | "secondary" | "outline" | "destructive"> = {
  PENDIENTE_PAGO: "secondary",
  CONFIRMADA: "default",
  CANCELADA: "destructive",
  COMPLETADA: "outline",
  NO_ASISTIO: "destructive",
}

const ITEMS_PER_PAGE = 10

export function BookingsTable() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchBookings = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await bookingsApi.list()
      setBookings(data)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message) ? err.message[0] : err.message
          : "Error al cargar citas"
      setError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  async function handleAction(id: string, action: "confirm" | "cancel" | "complete") {
    setActionId(id)
    try {
      if (action === "confirm") await bookingsApi.confirm(id)
      else if (action === "cancel") await bookingsApi.cancel(id)
      else await bookingsApi.complete(id)
      await fetchBookings()
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message) ? err.message[0] : err.message
          : "Error"
      alert(String(msg))
    } finally {
      setActionId(null)
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "numeric", month: "short", year: "numeric",
    })
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-CO", {
      hour: "2-digit", minute: "2-digit", hour12: true,
    })
  }

  const totalPages = Math.max(1, Math.ceil(bookings.length / ITEMS_PER_PAGE))
  const paged = bookings.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchBookings}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (paged.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">
          Aún no tienes citas agendadas.
        </p>
        <Button
          className="mt-4"
          size="sm"
          nativeButton={false}
          render={<a href="/agendar">Agendar mi primer ritual</a>}
        />
      </div>
    )
  }

  return (
    <div>
      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Cliente</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Servicio</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Fecha</th>
              <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Hora</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paged.map((b) => (
              <tr key={b.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">
                    {b.user?.firstName} {b.user?.lastName}
                  </p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {b.service?.name || "—"}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                  {formatDate(b.startTime)}
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {formatTime(b.startTime)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_VARIANTS[b.status]}>
                    {STATUS_LABELS[b.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {b.status === "PENDIENTE_PAGO" && (
                      <Button
                        variant="ghost" size="icon-sm"
                        disabled={actionId === b.id}
                        onClick={() => handleAction(b.id, "confirm")}
                        title="Confirmar"
                      >
                        {actionId === b.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" strokeWidth={1.5} />
                        )}
                      </Button>
                    )}
                    {b.status === "CONFIRMADA" && (
                      <Button
                        variant="ghost" size="icon-sm"
                        disabled={actionId === b.id}
                        onClick={() => handleAction(b.id, "complete")}
                        title="Completar"
                      >
                        {actionId === b.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <Check className="size-4" strokeWidth={1.5} />
                        )}
                      </Button>
                    )}
                    {b.status !== "CANCELADA" && b.status !== "COMPLETADA" && (
                      <Button
                        variant="ghost" size="icon-sm"
                        disabled={actionId === b.id}
                        onClick={() => handleAction(b.id, "cancel")}
                        title="Cancelar"
                      >
                        {actionId === b.id ? (
                          <Loader2 className="size-4 animate-spin" />
                        ) : (
                          <X className="size-4" strokeWidth={1.5} />
                        )}
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>{bookings.length} cita{bookings.length !== 1 && "s"}</span>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
              <ChevronLeft className="size-4" strokeWidth={1.5} />
            </Button>
            <span>{page} de {totalPages}</span>
            <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
              <ChevronRight className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
