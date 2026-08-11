import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import type { Product } from "@/types/product"

const mockAddItem = vi.fn()
const mockUseCart = vi.fn()

vi.mock("@/context/cart-provider", () => ({
  useCart: () => mockUseCart(),
}))

const mockProduct: Product = {
  id: "prod-1", name: "Crema Hidratante", slug: "crema", description: null,
  price: 85000, compareAtPrice: null, stock: 10, sku: null,
  mainImage: null, carouselImages: null, sponsor: null,
  isActive: true, isFeatured: false, categoryId: null,
  createdAt: "", updatedAt: "",
}

describe("AddToCartButton", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseCart.mockReturnValue({
      addItem: mockAddItem,
      items: [],
    })
  })

  it("should render 'Agregar al carrito' text", () => {
    render(<AddToCartButton product={mockProduct} />)
    expect(screen.getByText("Agregar al carrito")).toBeInTheDocument()
  })

  it("should call addItem and show 'Agregado!' on click", async () => {
    render(<AddToCartButton product={mockProduct} />)
    fireEvent.click(screen.getByText("Agregar al carrito"))
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct)
    expect(screen.getByText("Agregado!")).toBeInTheDocument()
  })

  it("should show cart quantity when item already in cart", () => {
    mockUseCart.mockReturnValue({
      addItem: mockAddItem,
      items: [{ productId: "prod-1", name: "", price: 0, mainImage: null, quantity: 3 }],
    })
    render(<AddToCartButton product={mockProduct} />)
    expect(screen.getByText("3 en carrito")).toBeInTheDocument()
  })

  it("should disable when stock is 0", () => {
    const outOfStock = { ...mockProduct, stock: 0 }
    render(<AddToCartButton product={outOfStock} />)
    expect(screen.getByText("Agotado")).toBeInTheDocument()
  })
})
