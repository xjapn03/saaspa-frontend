"use client"

import { useState, useEffect, useCallback } from "react"
import Script from "next/script"
import { Loader2, Check, X, ChevronLeft, ChevronRight, RefreshCw, CreditCard, Banknote } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { bookingsApi } from "@/lib/bookings-api"
import { paymentsApi } from "@/lib/payments-api"
import { useToast } from "@/context/toast-provider"
import { SlotPicker } from "@/components/booking/slot-picker"
import type { Booking, BookingStatus } from "@/types/booking"
import type { BalanceResponse } from "@/types/payment"

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

function PaymentBadge({ balance }: { balance: BalanceResponse | null; isLoading: boolean }) {
  if (!balance) return <Badge variant="outline">—</Badge>

  const { total, paid, remaining } = balance
  if (remaining <= 0 && paid > 0) return <Badge variant="default">Pagado</Badge>
  if (paid > 0 && remaining > 0) return <Badge variant="secondary">Falta ${remaining.toLocaleString("es-CO")}</Badge>
  if (paid === 0 && total > 0) return <Badge variant="outline">Sin abono</Badge>
  return <Badge variant="outline">—</Badge>
}

export function BookingsTable() {
  const { error: showError } = useToast()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [actionId, setActionId] = useState<string | null>(null)
  const [rescheduleBooking, setRescheduleBooking] = useState<Booking | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState("")
  const [rescheduleTime, setRescheduleTime] = useState("")
  const [rescheduleError, setRescheduleError] = useState("")
  const [rescheduling, setRescheduling] = useState(false)
  const [balances, setBalances] = useState<Record<string, BalanceResponse | null>>({})
  const [loadingBalances, setLoadingBalances] = useState<Set<string>>(new Set())
  const [payingRemaining, setPayingRemaining] = useState<Set<string>>(new Set())
  const [scriptReady, setScriptReady] = useState(false)
  const [manualPayment, setManualPayment] = useState<Booking | null>(null)
  const [manualMethod, setManualMethod] = useState("EFECTIVO")
  const [manualLoading, setManualLoading] = useState(false)
  const [manualError, setManualError] = useState("")

  const fetchBookings = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await bookingsApi.list({ limit: 1000 })
      setBookings(result.data)
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

  const fetchBalance = useCallback(async (bookingId: string) => {
    setLoadingBalances((prev) => new Set(prev).add(bookingId))
    try {
      const balance = await bookingsApi.getBalance(bookingId)
      setBalances((prev) => ({ ...prev, [bookingId]: balance }))
    } catch {
      setBalances((prev) => ({ ...prev, [bookingId]: null }))
    } finally {
      setLoadingBalances((prev) => {
        const next = new Set(prev)
        next.delete(bookingId)
        return next
      })
    }
  }, [])

  useEffect(() => {
    if (bookings.length > 0) {
      bookings.forEach((b) => {
        if (!balances[b.id]) {
          fetchBalance(b.id)
        }
      })
    }
  }, [bookings, balances, fetchBalance])

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
      showError(String(msg))
    } finally {
      setActionId(null)
    }
  }

  async function handlePayRemaining(bookingId: string) {
    setPayingRemaining((prev) => new Set(prev).add(bookingId))
    try {
      const config = await paymentsApi.init(bookingId, "SALDO")
      const widget = new window.WidgetCheckout({
        publicKey: config.publicKey,
        currency: config.currency,
        amountInCents: config.amountInCents,
        reference: config.reference,
        signature: { integrity: config.signature },
      } as any)
      widget.open(async (result: unknown) => {
        document.body.style.overflow = ""
        const transaction = (result as Record<string, unknown>)?.transaction as Record<string, string> | undefined
        if (transaction?.status === "APPROVED") {
          await fetchBalance(bookingId)
        }
      })
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray((err as Record<string, unknown>).message) ? ((err as Record<string, unknown>).message as string[])[0] : (err as Record<string, unknown>).message
        : "Error al iniciar pago"
      showError(String(msg))
    } finally {
      setPayingRemaining((prev) => {
        const next = new Set(prev)
        next.delete(bookingId)
        return next
      })
    }
  }

  function openReschedule(booking: Booking) {
    setRescheduleBooking(booking)
    setRescheduleDate("")
    setRescheduleTime("")
    setRescheduleError("")
  }

  function closeReschedule() {
    setRescheduleBooking(null)
    setRescheduleDate("")
    setRescheduleTime("")
    setRescheduleError("")
  }

  async function confirmReschedule() {
    if (!rescheduleBooking || !rescheduleTime) return
    setRescheduling(true)
    setRescheduleError("")
    try {
      await bookingsApi.reschedule(rescheduleBooking.id, rescheduleTime)
      closeReschedule()
      await fetchBookings()
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message) ? err.message[0] : err.message
          : "Error al reagendar"
      setRescheduleError(String(msg))
    } finally {
      setRescheduling(false)
    }
  }

  async function handleManualPayment() {
    if (!manualPayment) return
    setManualLoading(true)
    setManualError("")
    try {
      await paymentsApi.manual(manualPayment.id, manualMethod)
      await fetchBalance(manualPayment.id)
      setManualPayment(null)
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray((err as any).message) ? (err as any).message[0] : (err as any).message
        : "Error al registrar pago"
      setManualError(String(msg))
    } finally {
      setManualLoading(false)
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
    <>
    <Script src="https://checkout.wompi.co/widget.js" onReady={() => setScriptReady(true)} />
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
              <th className="px-4 py-3 font-medium text-muted-foreground">Pago</th>
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
                <td className="px-4 py-3">
                  <PaymentBadge balance={balances[b.id] ?? null} isLoading={loadingBalances.has(b.id)} />
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
                      <>
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
                        {balances[b.id] && balances[b.id]!.remaining > 0 && (
                          <Button
                            variant="ghost" size="sm"
                            disabled={payingRemaining.has(b.id)}
                            onClick={() => handlePayRemaining(b.id)}
                            title={`Cobrar saldo: $${balances[b.id]!.remaining.toLocaleString("es-CO")}`}
                          >
                            {payingRemaining.has(b.id) ? (
                              <Loader2 className="mr-1 size-3 animate-spin" />
                            ) : (
                              <CreditCard className="mr-1 size-3" strokeWidth={1.5} />
                            )}
                            Cobrar
                          </Button>
                        )}
                        {balances[b.id] && balances[b.id]!.remaining > 0 && (
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => { setManualPayment(b); setManualMethod("EFECTIVO"); }}
                            title={`Pago en local: $${balances[b.id]!.remaining.toLocaleString("es-CO")}`}
                          >
                            <Banknote className="mr-1 size-3" strokeWidth={1.5} />
                            Local
                          </Button>
                        )}
                      </>
                    )}
                    {b.status !== "CANCELADA" && b.status !== "COMPLETADA" && (
                      <>
                        <Button
                          variant="ghost" size="icon-sm"
                          disabled={actionId === b.id}
                          onClick={() => openReschedule(b)}
                          title="Reagendar"
                        >
                          <RefreshCw className="size-4" strokeWidth={1.5} />
                        </Button>
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
                      </>
                    )}
                    {b.status === "COMPLETADA" && balances[b.id] && balances[b.id]!.remaining > 0 && (
                      <Button
                        variant="ghost" size="sm"
                        disabled={payingRemaining.has(b.id)}
                        onClick={() => handlePayRemaining(b.id)}
                        title={`Cobrar saldo: $${balances[b.id]!.remaining.toLocaleString("es-CO")}`}
                      >
                        {payingRemaining.has(b.id) ? (
                          <Loader2 className="mr-1 size-3 animate-spin" />
                        ) : (
                          <CreditCard className="mr-1 size-3" strokeWidth={1.5} />
                        )}
                        Cobrar
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

      {rescheduleBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold">Reagendar cita</h3>
                <p className="text-sm text-muted-foreground">
                  {rescheduleBooking.user?.firstName} {rescheduleBooking.user?.lastName} — {rescheduleBooking.service?.name}
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={closeReschedule} title="Cerrar">
                <X className="size-4" strokeWidth={1.5} />
              </Button>
            </div>

            {rescheduleError && (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {rescheduleError}
              </div>
            )}

            <SlotPicker
              serviceId={rescheduleBooking.serviceId}
              duration={rescheduleBooking.service?.duration || 60}
              onSelect={(date, time) => {
                setRescheduleDate(date)
                setRescheduleTime(time)
              }}
              selectedDate={rescheduleDate}
              selectedTime={rescheduleTime}
            />

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={closeReschedule} disabled={rescheduling}>
                Cancelar
              </Button>
              <Button size="sm" onClick={confirmReschedule} disabled={!rescheduleTime || rescheduling}>
                {rescheduling ? (
                  <>
                    <Loader2 className="mr-1 size-3 animate-spin" />
                    Reagendando...
                  </>
                ) : (
                  "Confirmar reagendamiento"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {manualPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="font-heading text-lg font-semibold">Pago en local</h3>
                <p className="text-sm text-muted-foreground">
                  {manualPayment.user?.firstName} — {manualPayment.service?.name}
                </p>
              </div>
              <Button variant="ghost" size="icon-sm" onClick={() => { setManualPayment(null); setManualError(""); }} title="Cerrar">
                <X className="size-4" strokeWidth={1.5} />
              </Button>
            </div>

            {manualError && (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                {manualError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <p className="text-2xl font-semibold">
                  ${balances[manualPayment.id]?.remaining.toLocaleString("es-CO") || "—"}
                </p>
                <p className="text-xs text-muted-foreground">Saldo pendiente por cobrar</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Método de pago</label>
                <select
                  value={manualMethod}
                  onChange={(e) => setManualMethod(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="EFECTIVO">Efectivo</option>
                  <option value="TRANSFERENCIA">Transferencia</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => { setManualPayment(null); setManualError(""); }} disabled={manualLoading}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleManualPayment} disabled={manualLoading}>
                {manualLoading ? <Loader2 className="mr-1 size-3 animate-spin" /> : <Banknote className="mr-1 size-3" />}
                Confirmar pago
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
