import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { CartIcon } from "@/components/layout/cart-icon"

const mockUseCart = vi.fn()
const mockUseAuth = vi.fn()

vi.mock("@/context/cart-provider", () => ({
  useCart: () => mockUseCart(),
}))

vi.mock("@/context/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
}))

vi.mock("@/lib/payments-api", () => ({
  paymentsApi: { initCart: vi.fn() },
}))

describe("CartIcon", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAuth.mockReturnValue({ isAuthenticated: true, user: null, login: vi.fn(), logout: vi.fn(), register: vi.fn() })
  })

  it("should render cart badge button", () => {
    mockUseCart.mockReturnValue({
      items: [], subtotal: 0, discount: 0, total: 0,
      couponCode: null, couponId: null, itemCount: 0,
      addItem: vi.fn(), removeItem: vi.fn(), updateQuantity: vi.fn(),
      applyCoupon: vi.fn(), removeCoupon: vi.fn(), clearCart: vi.fn(),
    })
    render(<CartIcon />)
    expect(screen.getByText("Carrito")).toBeInTheDocument()
  })

  it("should show badge with item count", () => {
    mockUseCart.mockReturnValue({
      items: [{ productId: "1", name: "A", price: 1000, mainImage: null, quantity: 3 }],
      subtotal: 3000, discount: 0, total: 3000,
      couponCode: null, couponId: null, itemCount: 3,
      addItem: vi.fn(), removeItem: vi.fn(), updateQuantity: vi.fn(),
      applyCoupon: vi.fn(), removeCoupon: vi.fn(), clearCart: vi.fn(),
    })
    render(<CartIcon />)
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("should show '9+' for large counts", () => {
    mockUseCart.mockReturnValue({
      items: [],
      subtotal: 0, discount: 0, total: 0,
      couponCode: null, couponId: null, itemCount: 10,
      addItem: vi.fn(), removeItem: vi.fn(), updateQuantity: vi.fn(),
      applyCoupon: vi.fn(), removeCoupon: vi.fn(), clearCart: vi.fn(),
    })
    render(<CartIcon />)
    expect(screen.getByText("9+")).toBeInTheDocument()
  })

  it("should not show counter badge when cart is empty", () => {
    mockUseCart.mockReturnValue({
      items: [], subtotal: 0, discount: 0, total: 0,
      couponCode: null, couponId: null, itemCount: 0,
      addItem: vi.fn(), removeItem: vi.fn(), updateQuantity: vi.fn(),
      applyCoupon: vi.fn(), removeCoupon: vi.fn(), clearCart: vi.fn(),
    })
    render(<CartIcon />)
    expect(screen.queryByText("0")).not.toBeInTheDocument()
  })
})
