import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { ProductsTable } from "@/components/dashboard/products-table"
import type { Product } from "@/types/product"

vi.mock("@/context/toast-provider", () => ({
  useToast: () => ({ toast: vi.fn(), success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}))

vi.mock("@/lib/products-api", () => ({
  productsApi: { list: vi.fn(), remove: vi.fn() },
}))

import { productsApi } from "@/lib/products-api"

const mockProducts: Product[] = [
  { id: "1", name: "Crema", slug: "crema", description: null, price: 50000, compareAtPrice: null, stock: 5, sku: null, mainImage: null, carouselImages: null, sponsor: "Loreal", isActive: true, isFeatured: false, categoryId: null, createdAt: "", updatedAt: "" },
  { id: "2", name: "Serum", slug: "serum", description: null, price: 80000, compareAtPrice: null, stock: 0, sku: null, mainImage: null, carouselImages: null, sponsor: null, isActive: false, isFeatured: false, categoryId: null, createdAt: "", updatedAt: "" },
]

describe("ProductsTable", () => {
  const onEdit = vi.fn()
  const onNew = vi.fn()

  it("should render products with name and price", async () => {
    vi.mocked(productsApi.list).mockResolvedValue({ data: mockProducts, total: 2, page: 1, limit: 20, totalPages: 1 })
    render(<ProductsTable onEdit={onEdit} onNew={onNew} refreshKey={0} />)
    await screen.findByText("Crema")
    expect(screen.getByText("Serum")).toBeInTheDocument()
  })

  it("should render active/inactive badges", async () => {
    vi.mocked(productsApi.list).mockResolvedValue({ data: mockProducts, total: 2, page: 1, limit: 20, totalPages: 1 })
    render(<ProductsTable onEdit={onEdit} onNew={onNew} refreshKey={0} />)
    await screen.findByText("Activo")
    expect(screen.getByText("Inactivo")).toBeInTheDocument()
  })

  it("should show error state", async () => {
    vi.mocked(productsApi.list).mockRejectedValue(new Error("Fail"))
    render(<ProductsTable onEdit={onEdit} onNew={onNew} refreshKey={0} />)
    await screen.findByText("Error al cargar productos")
  })
})
