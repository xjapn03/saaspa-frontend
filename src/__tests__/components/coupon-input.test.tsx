import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { CouponInput } from "@/components/layout/coupon-input"

vi.mock("@/lib/coupons-api", () => ({
  couponsApi: {
    validate: vi.fn(),
    list: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    use: vi.fn(),
  },
}))

import { couponsApi } from "@/lib/coupons-api"

describe("CouponInput", () => {
  const onApply = vi.fn()
  const onRemove = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should render input and apply button when no coupon applied", () => {
    render(<CouponInput currentCode={null} onApply={onApply} onRemove={onRemove} />)
    expect(screen.getByPlaceholderText("Código de cupón")).toBeInTheDocument()
    expect(screen.getByText("Aplicar")).toBeInTheDocument()
  })

  it("should show applied coupon code and remove button", () => {
    render(<CouponInput currentCode="DESC20" onApply={onApply} onRemove={onRemove} />)
    expect(screen.getByText("DESC20")).toBeInTheDocument()
  })

  it("should call onRemove when remove clicked", () => {
    render(<CouponInput currentCode="DESC20" onApply={onApply} onRemove={onRemove} />)
    const removeBtns = screen.getAllByRole("button")
    const removeBtn = removeBtns.find((b) => b.querySelector("svg"))
    if (removeBtn) fireEvent.click(removeBtn)
    expect(onRemove).toHaveBeenCalled()
  })

  it("should validate coupon and call onApply on success", async () => {
    vi.mocked(couponsApi.validate).mockResolvedValue({ valid: true, code: "DESC10", id: "coupon-1", discount: 0.1 })
    render(<CouponInput currentCode={null} onApply={onApply} onRemove={onRemove} />)
    fireEvent.change(screen.getByPlaceholderText("Código de cupón"), { target: { value: "DESC10" } })
    fireEvent.click(screen.getByText("Aplicar"))
    await waitFor(() => {
      expect(onApply).toHaveBeenCalledWith("DESC10", "coupon-1", 0.1)
    })
  })
})
