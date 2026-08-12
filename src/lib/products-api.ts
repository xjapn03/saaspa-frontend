import type { Product } from "@/types/product"
import type { PaginatedResult } from "@/types/paginated"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const productsApi = {
  async list(params?: Record<string, string | number | boolean>): Promise<PaginatedResult<Product>> {
    const qs = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([k, v]) => { if (v !== undefined) qs.set(k, String(v)) })
    }
    const query = qs.toString()
    return api.get<PaginatedResult<Product>>(`${ENDPOINTS.PRODUCTS.LIST}${query ? `?${query}` : ""}`)
  },
  async getBySlug(slug: string): Promise<Product> { return api.get<Product>(ENDPOINTS.PRODUCTS.BY_SLUG(slug)) },
  async create(data: Record<string, unknown>): Promise<Product> { return api.post<Product>(ENDPOINTS.PRODUCTS.LIST, data) },
  async update(id: string, data: Partial<Product>): Promise<Product> { return api.patch<Product>(ENDPOINTS.PRODUCTS.BY_ID(id), data) },
  async remove(id: string): Promise<void> { return api.delete<void>(ENDPOINTS.PRODUCTS.BY_ID(id)) },
}
