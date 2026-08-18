import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { CartIcon } from "@/components/layout/cart-icon"

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn() }),
}))

const mockUseCart = vi.fn()
const mockUseAuth = vi.fn()

vi.mock("@/context/cart-provider", () => ({
  useCart: () => mockUseCart(),
}))

vi.mock("@/context/auth-provider", () => ({
  useAuth: () => mockUseAuth(),
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

  it("should show coupon discount percent in the cart sheet", () => {
    mockUseCart.mockReturnValue({
      items: [{ productId: "1", name: "A", price: 50000, mainImage: null, quantity: 1 }],
      subtotal: 50000, discount: 5000, total: 45000,
      couponCode: "DESC10", couponId: "coupon-1", couponDiscount: 0.1, itemCount: 1,
      addItem: vi.fn(), removeItem: vi.fn(), updateQuantity: vi.fn(),
      applyCoupon: vi.fn(), removeCoupon: vi.fn(), clearCart: vi.fn(),
    })
    render(<CartIcon />)
    fireEvent.click(screen.getByText("Carrito"))
    expect(screen.getByText(/Descuento \(DESC10 · 10%\)/)).toBeInTheDocument()
  })
})
