import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, act, renderHook } from "@testing-library/react"
import { CartProvider, useCart, type CartItem } from "@/context/cart-provider"
import type { Product } from "@/types/product"

const mockProduct: Product = {
  id: "prod-1", name: "Crema", slug: "crema", description: null,
  price: 50000, compareAtPrice: null, stock: 10, sku: null,
  mainImage: null, carouselImages: null, sponsor: null,
  isActive: true, isFeatured: false, categoryId: null,
  createdAt: "", updatedAt: "",
}

describe("CartProvider", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  function renderCart() {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <CartProvider>{children}</CartProvider>
    )
    const { result } = renderHook(() => useCart(), { wrapper })
    return result
  }

  it("should start with empty cart", () => {
    const result = renderCart()
    expect(result.current.items).toHaveLength(0)
    expect(result.current.itemCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
    expect(result.current.total).toBe(0)
  })

  it("should add new item to cart", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].productId).toBe("prod-1")
    expect(result.current.items[0].quantity).toBe(1)
    expect(result.current.itemCount).toBe(1)
    expect(result.current.subtotal).toBe(50000)
  })

  it("should increment quantity on duplicate addItem", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.addItem(mockProduct) })
    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.itemCount).toBe(2)
    expect(result.current.subtotal).toBe(100000)
  })

  it("should remove item from cart", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.removeItem("prod-1") })
    expect(result.current.items).toHaveLength(0)
    expect(result.current.itemCount).toBe(0)
  })

  it("should update item quantity", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.updateQuantity("prod-1", 5) })
    expect(result.current.items[0].quantity).toBe(5)
    expect(result.current.itemCount).toBe(5)
  })

  it("should remove item when quantity is 0", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.updateQuantity("prod-1", 0) })
    expect(result.current.items).toHaveLength(0)
  })

  it("should apply and remove coupon", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.applyCoupon("DESC10", "coupon-1", 0.1) })
    expect(result.current.couponCode).toBe("DESC10")
    expect(result.current.couponId).toBe("coupon-1")
    expect(result.current.couponDiscount).toBe(0.1)
    expect(result.current.discount).toBe(5000)
    expect(result.current.total).toBe(45000)

    act(() => { result.current.removeCoupon() })
    expect(result.current.couponCode).toBeNull()
    expect(result.current.couponDiscount).toBeNull()
    expect(result.current.discount).toBe(0)
    expect(result.current.total).toBe(50000)
  })

  it("should clear cart", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    act(() => { result.current.applyCoupon("DESC10", "coupon-1", 0.1) })
    act(() => { result.current.clearCart() })
    expect(result.current.items).toHaveLength(0)
    expect(result.current.couponCode).toBeNull()
    expect(result.current.couponDiscount).toBeNull()
    expect(result.current.discount).toBe(0)
  })

  it("should persist guest cart to localStorage", () => {
    const result = renderCart()
    act(() => { result.current.addItem(mockProduct) })
    const stored = localStorage.getItem("kamerinos_guest_cart")
    expect(stored).toBeTruthy()
    const parsed: CartItem[] = JSON.parse(stored!)
    expect(parsed).toHaveLength(1)
  })
})
