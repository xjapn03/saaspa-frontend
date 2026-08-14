const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || ""

declare global {
  interface Window {
    fbq?: (...args: any[]) => void
    _fbq?: (...args: any[]) => void
  }
}

export function getPixelId(): string {
  return PIXEL_ID
}

export function isPixelEnabled(): boolean {
  return PIXEL_ID.length > 0
}

export function pageView(): void {
  if (!isPixelEnabled()) return
  window.fbq?.("track", "PageView")
}

export function track(eventName: string, params?: Record<string, unknown>): void {
  if (!isPixelEnabled()) return
  window.fbq?.("track", eventName, params)
}

export function trackSchedule(bookingData: {
  serviceName?: string
  value?: number
  currency?: string
  bookingId?: string
}): void {
  track("Schedule", {
    content_name: bookingData.serviceName,
    value: bookingData.value,
    currency: bookingData.currency || "COP",
    booking_id: bookingData.bookingId,
  })
}

export function trackPurchase(paymentData: {
  serviceName?: string
  value?: number
  currency?: string
}): void {
  track("Purchase", {
    content_name: paymentData.serviceName,
    value: paymentData.value,
    currency: paymentData.currency || "COP",
  })
}
