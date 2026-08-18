import type { PaymentInitResponse } from "@/types/payment"

export interface PaymentWidgetConfig {
  publicKey: string
  reference: string
  amountInCents: number
  currency: string
  signature: { integrity: string }
}

export interface PaymentWidgetResult {
  transaction?: {
    status?: string
  } | null
}

declare global {
  interface Window {
    WidgetCheckout: new (config: PaymentWidgetConfig) => {
      open: (callback: (result: PaymentWidgetResult) => void) => void
    }
  }
}

export function openPaymentWidget(
  config: PaymentInitResponse,
  onResult: (result: PaymentWidgetResult) => void,
): void {
  if (typeof window === "undefined" || !window.WidgetCheckout) {
    throw new Error("El widget de pago aún no está cargado")
  }
  const widget = new window.WidgetCheckout({
    currency: config.currency,
    amountInCents: config.amountInCents,
    reference: config.reference,
    publicKey: config.publicKey,
    signature: { integrity: config.signature },
  })
  widget.open(onResult)
}
