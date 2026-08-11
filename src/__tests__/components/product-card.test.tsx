import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ProductCard } from "@/components/marketing/product-card"

const mockProduct = {
  id: "prod-1",
  name: "Crema Hidratante",
  slug: "crema-hidratante",
  description: "Crema premium",
  price: 85000,
  compareAtPrice: 120000,
  stock: 10,
  sku: "SKU-001",
  mainImage: null,
  carouselImages: [],
  sponsor: "Loreal",
  isActive: true,
  isFeatured: true,
  categoryId: "cat-1",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
  category: { id: "cat-1", name: "Cremas", slug: "cremas" },
}

describe("ProductCard", () => {
  it("should render product name", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("Crema Hidratante")).toBeDefined()
  })

  it("should render sponsor brand", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("Loreal")).toBeDefined()
  })

  it("should render category badge", () => {
    render(<ProductCard product={mockProduct} />)
    expect(screen.getByText("Cremas")).toBeDefined()
  })

  it("should show compareAtPrice as strikethrough", () => {
    render(<ProductCard product={mockProduct} />)
    const priceEl = screen.getByText("$120.000")
    expect(priceEl.className).toContain("line-through")
  })

  it("should link to product detail page", () => {
    render(<ProductCard product={mockProduct} />)
    const link = screen.getByRole("link")
    expect(link.getAttribute("href")).toBe("/shop/crema-hidratante")
  })
})
