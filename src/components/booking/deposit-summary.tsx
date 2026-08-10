"use client"

import { Clock, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { Service } from "@/types/service"

interface DepositSummaryProps {
  service: Service
  date: string
  time: string
}

export function DepositSummary({ service, date, time }: DepositSummaryProps) {
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  const deposit = Math.round(service.price * 0.3)
  const remaining = service.price - deposit

  const dateLabel = new Date(date + "T00:00:00").toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const timeLabel = new Date(time).toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Resumen de tu cita
        </p>
        <p className="font-heading text-xl font-semibold">{service.name}</p>
      </div>

      <div className="space-y-3 text-sm">
        <div className="flex items-center gap-3">
          <Clock className="size-4 text-muted-foreground" strokeWidth={1.5} />
          <div>
            <p className="font-medium">{dateLabel}</p>
            <p className="text-muted-foreground">
              {timeLabel} · {service.duration} min
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-5" />

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Valor del servicio</span>
          <span className="font-medium">{formatPrice(service.price)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Abono (30%)</span>
          <span className="font-medium text-primary">{formatPrice(deposit)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between">
          <span className="text-muted-foreground">Saldo a pagar en el spa</span>
          <span className="font-medium">{formatPrice(remaining)}</span>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-muted/50 p-4 text-xs text-muted-foreground">
        <p className="flex items-start gap-2">
          <Check className="mt-0.5 size-3 shrink-0 text-primary" strokeWidth={2} />
          El abono del 30% garantiza tu reserva. Si no asistes sin cancelar con 24h de anticipación, pierdes el abono.
        </p>
      </div>
    </div>
  )
}
