import Script from "next/script"

export function PaymentWidgetScript({ onReady }: { onReady?: () => void }) {
  return <Script src="https://checkout.wompi.co/widget.js" onReady={onReady} />
}
