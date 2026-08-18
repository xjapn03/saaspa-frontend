import { describe, it, expect, vi, afterEach } from "vitest"
import { openPaymentWidget } from "@/lib/payment-provider"
import type { PaymentWidgetResult } from "@/lib/payment-provider"
import type { PaymentInitResponse } from "@/types/payment"

const config: PaymentInitResponse = {
  publicKey: "pub_test_123",
  reference: "kamerinos-abc-1xyz",
  amountInCents: 500000,
  currency: "COP",
  signature: "a".repeat(64),
}

const widgetWindow = window as unknown as { WidgetCheckout?: unknown }

describe("openPaymentWidget", () => {
  afterEach(() => {
    delete widgetWindow.WidgetCheckout
  })

  it("instantiates the widget with the mapped Wompi config", () => {
    const openMock = vi.fn()
    const WidgetCtor = vi.fn(function (this: { open: unknown }) {
      this.open = openMock
    })
    widgetWindow.WidgetCheckout = WidgetCtor

    openPaymentWidget(config, () => {})

    expect(WidgetCtor).toHaveBeenCalledWith({
      currency: "COP",
      amountInCents: 500000,
      reference: "kamerinos-abc-1xyz",
      publicKey: "pub_test_123",
      signature: { integrity: "a".repeat(64) },
    })
    expect(openMock).toHaveBeenCalled()
  })

  it("forwards the widget result to the callback", () => {
    let captured: ((result: PaymentWidgetResult) => void) | undefined
    const WidgetCtor = vi.fn(function (this: { open: (cb: (result: PaymentWidgetResult) => void) => void }) {
      this.open = (cb: (result: PaymentWidgetResult) => void) => {
        captured = cb
      }
    })
    widgetWindow.WidgetCheckout = WidgetCtor

    const onResult = vi.fn()
    openPaymentWidget(config, onResult)

    const result = { transaction: { status: "APPROVED" } }
    captured!(result)
    expect(onResult).toHaveBeenCalledWith(result)
  })

  it("throws when the widget script is not loaded", () => {
    expect(() => openPaymentWidget(config, () => {})).toThrow(
      "El widget de pago aún no está cargado",
    )
  })
})
