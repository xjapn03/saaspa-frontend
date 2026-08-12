"use client"

import { useState, useEffect, useCallback } from "react"
import Script from "next/script"
import { Loader2, ChevronLeft, ChevronRight, MessageCircle, CalendarDays, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { bookingsApi } from "@/lib/bookings-api"
import { paymentsApi } from "@/lib/payments-api"
import type { Booking, BookingStatus } from "@/types/booking"
import type { BalanceResponse } from "@/types/payment"

const STATUS_VARIANTS: Record<BookingStatus, "default" | "secondary" | "outline" | "destructive"> = {
  PENDIENTE_PAGO: "secondary",
  CONFIRMADA: "default",
  CANCELADA: "destructive",
  COMPLETADA: "outline",
  NO_ASISTIO: "destructive",
}

const WA_PHONE = "573041338567"

export function ClientBookingCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [balances, setBalances] = useState<Record<string, BalanceResponse | null>>({})
  const [payingId, setPayingId] = useState<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)

  const fetchBookings = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const data = await bookingsApi.list()
      setBookings(data.filter((b) => b.status !== "CANCELADA" && b.status !== "COMPLETADA"))
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray(err.message) ? err.message[0] : err.message
        : "Error al cargar citas"
      setError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  useEffect(() => {
    bookings.forEach((b) => {
      if (b.status === "CONFIRMADA" && !balances[b.id]) {
        bookingsApi.getBalance(b.id).then((bal) => {
          setBalances((prev) => ({ ...prev, [b.id]: bal }))
        }).catch(() => {})
      }
    })
  }, [bookings, balances])

  async function handlePayRemaining(bookingId: string) {
    if (!scriptReady) return
    setPayingId(bookingId)
    try {
      const config = await paymentsApi.init(bookingId, "SALDO")
      const widget = new window.WidgetCheckout({
        public_key: config.publicKey,
        currency: config.currency,
        amount_in_cents: config.amountInCents,
        reference: config.reference,
        signature: { integrity: config.signature },
      } as any)
      widget.open(async (result: unknown) => {
        const tx = (result as any)?.transaction
        if (tx?.status === "APPROVED") {
          const bal = await bookingsApi.getBalance(bookingId)
          setBalances((prev) => ({ ...prev, [bookingId]: bal }))
        }
      })
    } catch { /* gracefully handled by widget */ }
    finally { setPayingId(null) }
  }

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startOffset = firstDay.getDay()
  const daysInMonth = lastDay.getDate()

  const bookingsByDay = new Map<number, Booking[]>()
  bookings.forEach((b) => {
    const d = new Date(b.startTime)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!bookingsByDay.has(day)) bookingsByDay.set(day, [])
      bookingsByDay.get(day)!.push(b)
    }
  })

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  const monthLabel = new Date(year, month).toLocaleDateString("es-CO", { month: "long", year: "numeric" })

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
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchBookings}>Reintentar</Button>
      </div>
    )
  }

  return (
    <div>
      <Script src="https://checkout.wompi.co/widget.js" onReady={() => setScriptReady(true)} />
      <div className="mb-4 flex items-center justify-between">
        <Button variant="outline" size="icon-sm" onClick={() => { setMonth(m => m === 0 ? (setYear(y => y - 1), 11) : m - 1) }}>
          <ChevronLeft className="size-4" strokeWidth={1.5} />
        </Button>
        <p className="font-heading text-lg font-semibold capitalize">{monthLabel}</p>
        <Button variant="outline" size="icon-sm" onClick={() => { setMonth(m => m === 11 ? (setYear(y => y + 1), 0) : m + 1) }}>
          <ChevronRight className="size-4" strokeWidth={1.5} />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-2xl border border-border bg-muted/50">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="bg-card px-2 py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
        ))}
        {Array.from({ length: startOffset }).map((_, i) => (
          <div key={`empty-${i}`} className="bg-card" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const dayBookings = bookingsByDay.get(day) || []
          return (
            <div key={day} className="bg-card px-1 py-2 min-h-[54px] text-center">
              <p className="text-xs font-medium text-foreground mb-0.5">{day}</p>
              {dayBookings.slice(0, 2).map((b) => (
                <div key={b.id} className="mb-0.5 truncate rounded px-1 py-px text-[9px]" title={`${b.service?.name} ${formatTime(b.startTime)}`}>
                  <Badge variant={STATUS_VARIANTS[b.status]} className="px-1 py-0 text-[9px] leading-tight">
                    {formatTime(b.startTime)}
                  </Badge>
                </div>
              ))}
              {dayBookings.length > 2 && (
                <p className="text-[9px] text-muted-foreground">+{dayBookings.length - 2}</p>
              )}
            </div>
          )
        })}
      </div>

      {bookings.length === 0 && (
        <div className="mt-8 rounded-2xl border border-border bg-card p-8 text-center">
          <CalendarDays className="mx-auto size-8 text-muted-foreground" strokeWidth={1.5} />
          <p className="mt-3 text-sm text-muted-foreground">Aún no tienes citas activas.</p>
          <Button className="mt-4" size="sm" nativeButton={false} render={<a href="/agendar">Agendar mi primer ritual</a>} />
        </div>
      )}

      {bookings.length > 0 && (
        <div className="mt-8">
          <p className="mb-3 text-sm font-medium text-foreground">Próximas citas</p>
          <div className="space-y-2">
            {bookings
              .filter((b) => b.status !== "CANCELADA" && b.status !== "COMPLETADA")
              .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())
              .slice(0, 5)
              .map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-border bg-card p-3 text-sm">
                  <div>
                    <p className="font-medium">{b.service?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(b.startTime).toLocaleDateString("es-CO", { day: "numeric", month: "short" })} · {formatTime(b.startTime)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANTS[b.status]}>
                      {b.status === "PENDIENTE_PAGO" ? "Pendiente" : b.status === "CONFIRMADA" ? "Confirmada" : b.status}
                    </Badge>
                    {b.status === "CONFIRMADA" && balances[b.id] && balances[b.id]!.remaining > 0 && (
                      <Button
                        variant="default"
                        size="sm"
                        disabled={payingId === b.id || !scriptReady}
                        onClick={() => handlePayRemaining(b.id)}
                        title={`Pagar saldo: $${balances[b.id]!.remaining.toLocaleString("es-CO")}`}
                      >
                        {payingId === b.id ? <Loader2 className="size-3 animate-spin" /> : <CreditCard className="size-3" />}
                        <span className="ml-1 hidden sm:inline">Pagar</span>
                      </Button>
                    )}
                    {b.status !== "CANCELADA" && b.status !== "COMPLETADA" && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        nativeButton={false}
                        render={
                          <a
                            href={`https://wa.me/${WA_PHONE}?text=${encodeURIComponent(`Hola, quiero cancelar o reagendar mi cita del ${new Date(b.startTime).toLocaleDateString("es-CO")} a las ${formatTime(b.startTime)}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="size-4" strokeWidth={1.5} />
                          </a>
                        }
                        title="Cancelar o reagendar por WhatsApp"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
