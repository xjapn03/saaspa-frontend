import { beforeEach, afterEach, describe, expect, it, vi } from "vitest"

describe("meta-pixel", () => {
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "production")
    vi.stubEnv("NEXT_PUBLIC_META_PIXEL_ID", "123456789")
    vi.stubGlobal("window", { fbq: vi.fn() })
    vi.resetModules()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it("trackPurchase envía datos de compra e-commerce con eventID", async () => {
    const { trackPurchase } = await import("@/lib/meta-pixel")
    trackPurchase(
      {
        value: 90000,
        currency: "COP",
        contentName: "Carrito",
        contentType: "product",
        numItems: 2,
        contentIds: ["prod-1", "prod-2"],
      },
      "evt-1",
    )

    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "Purchase",
      expect.objectContaining({
        content_name: "Carrito",
        content_type: "product",
        num_items: 2,
        content_ids: ["prod-1", "prod-2"],
        value: 90000,
        currency: "COP",
      }),
      { eventID: "evt-1" },
    )
  })

  it("trackPurchase mantiene compatibilidad con pagos de citas (serviceName)", async () => {
    const { trackPurchase } = await import("@/lib/meta-pixel")
    trackPurchase({ serviceName: "Facial", value: 30000, currency: "COP" }, "evt-2")

    expect(window.fbq).toHaveBeenCalledWith(
      "track",
      "Purchase",
      expect.objectContaining({ content_name: "Facial", value: 30000 }),
      { eventID: "evt-2" },
    )
  })

  it("pageView dispara evento PageView", async () => {
    const { pageView } = await import("@/lib/meta-pixel")
    pageView()

    expect(window.fbq).toHaveBeenCalledWith("track", "PageView")
  })
})