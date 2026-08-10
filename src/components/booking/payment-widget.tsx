"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Script from "next/script"
import { Loader2, CheckCircle, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/context/auth-provider"
import { paymentsApi } from "@/lib/payments-api"

declare global {
  interface Window {
    WidgetCheckout: new (config: unknown) => { open: (cb: (result: unknown) => void) => void }
  }
}

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [wompiConfig, setWompiConfig] = useState<{
    publicKey: string
    reference: string
    amountInCents: number
    currency: string
    signature: string
  } | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !wompiConfig || !scriptReady) return

    const checkout = new window.WidgetCheckout({
      currency: wompiConfig.currency,
      amountInCents: wompiConfig.amountInCents,
      reference: wompiConfig.reference,
      publicKey: wompiConfig.publicKey,
      signature: { integrity: wompiConfig.signature },
    })

    checkout.open(function (result: any) {
      const transaction = result?.transaction
      if (transaction?.status === "APPROVED") {
        setPaymentSuccess(true)
      } else if (transaction) {
        setError(`Pago ${transaction.status === "DECLINED" ? "rechazado" : "con error"}. Intenta de nuevo.`)
      }
    })
  }, [isAuthenticated, wompiConfig, scriptReady])

  async function handleStartPayment() {
    setError("")
    setIsLoading(true)
    try {
      const booking = await import("@/lib/bookings-api").then(m =>
        m.bookingsApi.create({ serviceId, startTime })
      )
      setBookingId(booking.id)

      const config = await paymentsApi.init(booking.id)
      setWompiConfig(config)
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray(err.message) ? err.message[0] : err.message
        : "Error al iniciar el pago"
      setError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <LogIn className="mx-auto size-10 text-muted-foreground" strokeWidth={1.5} />
        <p className="mt-4 font-heading text-xl font-semibold">Inicia sesión para pagar</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Necesitas una cuenta para confirmar tu cita con el abono del 30%.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button variant="outline" nativeButton={false} render={<Link href="/registro">Crear cuenta</Link>} />
          <Button nativeButton={false} render={<Link href="/login?redirect=/agendar">Iniciar sesión</Link>} />
        </div>
      </div>
    )
  }

  if (paymentSuccess) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <CheckCircle className="mx-auto size-12 text-primary" strokeWidth={1.5} />
        <p className="mt-4 font-heading text-2xl font-semibold">¡Pago exitoso!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu cita para {serviceName} ha sido confirmada. Te esperamos.
        </p>
        <Button className="mt-6" size="lg" onClick={onPaymentComplete}>
          Ver mis citas
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <Script
        src="https://checkout.wompi.co/widget.js"
        onReady={() => setScriptReady(true)}
      />

      <p className="mb-2 font-heading text-lg font-semibold">Confirmar y pagar abono</p>
      <p className="mb-4 text-xs text-muted-foreground">
        Se abrirá el widget de Wompi para pagar con PSE, Nequi o tarjeta.
      </p>

      <Separator className="my-4" />

      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="mb-6 rounded-xl bg-muted/30 p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Abono del 30%
        </p>
        <p className="mt-1 font-heading text-3xl font-semibold">{formatPrice(depositAmount)}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Wompi — PSE, Nequi, tarjetas de crédito/débito
        </p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isLoading}>
          Volver
        </Button>
        <Button className="flex-1" size="lg" onClick={handleStartPayment} disabled={isLoading}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : `Pagar ${formatPrice(depositAmount)}`}
        </Button>
      </div>
    </div>
  )
}
