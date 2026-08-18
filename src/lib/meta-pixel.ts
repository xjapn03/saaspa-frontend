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
  return process.env.NODE_ENV === "production" && PIXEL_ID.length > 0
}

export function pageView(): void {
  if (!isPixelEnabled()) return
  window.fbq?.("track", "PageView")
}

export function track(eventName: string, params?: Record<string, unknown>, eventId?: string): void {
  if (!isPixelEnabled()) return
  if (eventId) {
    window.fbq?.("track", eventName, params, { eventID: eventId })
  } else {
    window.fbq?.("track", eventName, params)
  }
}

export function trackSchedule(
  bookingData: {
    serviceName?: string
    value?: number
    currency?: string
    bookingId?: string
  },
  eventId?: string,
): void {
  track(
    "Schedule",
    {
      content_name: bookingData.serviceName,
      value: bookingData.value,
      currency: bookingData.currency || "COP",
      booking_id: bookingData.bookingId,
    },
    eventId,
  )
}

export function trackPurchase(
  paymentData: {
    serviceName?: string
    value?: number
    currency?: string
    contentName?: string
    contentType?: string
    numItems?: number
    contentIds?: string[]
  },
  eventId?: string,
): void {
  track(
    "Purchase",
    {
      content_name: paymentData.contentName || paymentData.serviceName,
      content_type: paymentData.contentType,
      value: paymentData.value,
      currency: paymentData.currency || "COP",
      num_items: paymentData.numItems,
      content_ids: paymentData.contentIds,
    },
    eventId,
  )
}

export function viewContent(data: {
  contentName?: string
  contentCategory?: string
  contentType?: string
  value?: number
  currency?: string
}): void {
  track("ViewContent", {
    content_name: data.contentName,
    content_category: data.contentCategory,
    content_type: data.contentType,
    value: data.value,
    currency: data.currency || "COP",
  })
}

export function initiateCheckout(data: {
  contentName?: string
  value?: number
  currency?: string
  numItems?: number
}): void {
  track("InitiateCheckout", {
    content_name: data.contentName,
    value: data.value,
    currency: data.currency || "COP",
    num_items: data.numItems,
  })
}

export function addToCart(data: {
  contentName?: string
  value?: number
  currency?: string
  contentIds?: string[]
}): void {
  track("AddToCart", {
    content_name: data.contentName,
    value: data.value,
    currency: data.currency || "COP",
    content_ids: data.contentIds,
  })
}

export function completeRegistration(method?: string): void {
  track("CompleteRegistration", { method })
}

export function contactOrLead(data?: { contentName?: string }): void {
  track("Contact", {
    content_name: data?.contentName,
  })
}
