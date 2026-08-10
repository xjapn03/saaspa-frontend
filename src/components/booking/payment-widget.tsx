"use client"

import { useState } from "react"
import Link from "next/link"
import { Loader2, CheckCircle, CreditCard, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-provider"
import { bookingsApi } from "@/lib/bookings-api"

interface PaymentWidgetProps {
  serviceId: string
  startTime: string
  serviceName: string
  depositAmount: number
  onPaymentComplete: () => void
  onCancel: () => void
}

export function PaymentWidget({
  serviceId,
  startTime,
  serviceName,
  depositAmount,
  onPaymentComplete,
  onCancel,
}: PaymentWidgetProps) {
  const { isAuthenticated } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  async function handlePay() {
    if (!isAuthenticated) return
    setError("")
    setIsProcessing(true)
    try {
      await bookingsApi.create({ serviceId, startTime })
      setIsSuccess(true)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al crear la cita"
      setError(String(msg))
    } finally {
      setIsProcessing(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <LogIn className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="mt-4 font-heading text-xl font-semibold">Inicia sesión para continuar</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Necesitas una cuenta para agendar tu cita. Es rápido y gratuito.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            variant="outline"
            nativeButton={false}
            render={<Link href="/registro">Crear cuenta</Link>}
          />
          <Button
            nativeButton={false}
            render={<Link href="/login?redirect=/agendar">Iniciar sesión</Link>}
          />
        </div>
      </div>
    )
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <CheckCircle className="mx-auto size-12 text-primary" strokeWidth={1.5} />
        <p className="mt-4 font-heading text-2xl font-semibold">¡Cita agendada!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu cita para {serviceName} ha sido reservada. El estado es <strong>pendiente de pago</strong>.
        </p>
        <Button className="mt-6" size="lg" onClick={onPaymentComplete}>
          Ver mis citas
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="mb-4 flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
          <CreditCard className="size-5 text-primary" strokeWidth={1.5} />
        </div>
        <div>
          <p className="font-heading text-lg font-semibold">Confirmar reserva</p>
          <p className="text-xs text-muted-foreground">
            Se creará con estado pendiente de pago
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-xl bg-muted/30 p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Abono requerido (30%)
        </p>
        <p className="mt-1 font-heading text-3xl font-semibold">{formatPrice(depositAmount)}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Paga en el spa el día de tu cita
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button className="flex-1" size="lg" onClick={handlePay} disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            "Confirmar reserva"
          )}
        </Button>
      </div>
    </div>
  )
}
