import { describe, it, expect, vi } from "vitest"
import { render, screen, fireEvent } from "@testing-library/react"
import { CartItemRow } from "@/components/layout/cart-item-row"
import type { CartItem } from "@/context/cart-provider"

const mockItem: CartItem = {
  productId: "prod-1", name: "Crema Hidratante", price: 50000, mainImage: null, quantity: 2,
}

describe("CartItemRow", () => {
  const onUpdateQuantity = vi.fn()
  const onRemove = vi.fn()

  it("should render item name, price, and quantity", () => {
    render(<CartItemRow item={mockItem} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />)
    expect(screen.getByText("Crema Hidratante")).toBeInTheDocument()
    expect(screen.getByText("2")).toBeInTheDocument()
  })

  it("should call onRemove when X clicked", () => {
    render(<CartItemRow item={mockItem} onUpdateQuantity={onUpdateQuantity} onRemove={onRemove} />)
    const removeBtn = screen.getByTitle("Eliminar")
    fireEvent.click(removeBtn)
    expect(onRemove).toHaveBeenCalledWith("prod-1")
  })
})
