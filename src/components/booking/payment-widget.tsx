"use client"

import { useState } from "react"
import { Loader2, CheckCircle, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface PaymentWidgetProps {
  serviceName: string
  depositAmount: number
  onPaymentComplete: () => void
  onCancel: () => void
}

export function PaymentWidget({
  serviceName,
  depositAmount,
  onPaymentComplete,
  onCancel,
}: PaymentWidgetProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  function handlePay() {
    setIsProcessing(true)
    // Simula 2 seg de procesamiento - se reemplaza con Wompi real
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <CheckCircle className="mx-auto size-12 text-primary" strokeWidth={1.5} />
        <p className="mt-4 font-heading text-2xl font-semibold">¡Pago confirmado!</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Tu cita para {serviceName} ha sido agendada exitosamente.
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
          <p className="font-heading text-lg font-semibold">Pago del abono</p>
          <p className="text-xs text-muted-foreground">
            Wompi — PSE, Nequi, tarjetas
          </p>
        </div>
      </div>

      <Separator className="my-4" />

      <div className="mb-6 rounded-xl bg-muted/30 p-6 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
          Total a pagar ahora
        </p>
        <p className="mt-1 font-heading text-3xl font-semibold">{formatPrice(depositAmount)}</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="flex-1" onClick={onCancel} disabled={isProcessing}>
          Cancelar
        </Button>
        <Button className="flex-1" size="lg" onClick={handlePay} disabled={isProcessing}>
          {isProcessing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <>
              <CreditCard
                data-slot="icon"
                data-icon="inline-start"
                className="size-4"
                strokeWidth={1.5}
              />
              Pagar {formatPrice(depositAmount)}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
