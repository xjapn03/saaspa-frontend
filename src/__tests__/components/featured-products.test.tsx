import { describe, it, expect, vi, beforeEach } from "vitest"
import { render, screen, cleanup } from "@testing-library/react"
import { FeaturedProducts } from "@/components/marketing/featured-products"

vi.mock("@/lib/products-api", () => ({
  productsApi: { list: vi.fn() },
}))

vi.mock("@/components/layout/animated-grid", () => ({
  AnimatedGrid: ({ children, ...props }: any) => <div {...props}>{children}</div>,
}))

import { productsApi } from "@/lib/products-api"
import type { Product } from "@/types/product"

const mockProducts: Product[] = [
  { id: "1", name: "Crema", slug: "crema", description: null, price: 50000, compareAtPrice: null, stock: 5, sku: null, mainImage: null, carouselImages: null, sponsor: "Loreal", isActive: true, isFeatured: true, categoryId: null, createdAt: "", updatedAt: "" },
  { id: "2", name: "Serum", slug: "serum", description: null, price: 80000, compareAtPrice: 120000, stock: 3, sku: null, mainImage: null, carouselImages: null, sponsor: null, isActive: true, isFeatured: true, categoryId: null, createdAt: "", updatedAt: "" },
]

const emptyResult = { data: [] as Product[], total: 0, page: 1, limit: 20, totalPages: 0 }

describe("FeaturedProducts", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should show loading skeletons while fetching", () => {
    vi.mocked(productsApi.list).mockReturnValue(new Promise(() => {}))
    render(<FeaturedProducts />)
    expect(screen.getByText("Productos destacados")).toBeInTheDocument()
    expect(screen.getByText("Shop")).toBeInTheDocument()
    cleanup()
  })

  it("should render products after data loads", async () => {
    vi.mocked(productsApi.list).mockResolvedValue({ data: mockProducts, total: 2, page: 1, limit: 20, totalPages: 1 })
    render(<FeaturedProducts />)
    await screen.findByText("Crema")
    expect(screen.getByText("Serum")).toBeInTheDocument()
  })

  it("should render nothing when no featured products", async () => {
    vi.mocked(productsApi.list).mockResolvedValue(emptyResult)
    const { container } = render(<FeaturedProducts />)
    await vi.waitFor(() => {
      expect(container.firstChild).toBeNull()
    }, { timeout: 3000 })
  })
})
