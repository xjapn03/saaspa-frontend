import type { Product } from "@/types/product"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const productsApi = {
  async list(params?: {
    categorySlug?: string
    categoryId?: string
    featured?: boolean
    search?: string
    page?: number
    limit?: number
  }): Promise<Product[]> {
    const qs = new URLSearchParams()
    if (params?.categorySlug) qs.set("categorySlug", params.categorySlug)
    if (params?.categoryId) qs.set("categoryId", params.categoryId)
    if (params?.featured) qs.set("featured", "true")
    if (params?.search) qs.set("search", params.search)
    if (params?.page) qs.set("page", String(params.page))
    if (params?.limit) qs.set("limit", String(params.limit))
    const query = qs.toString()
    return api.get<Product[]>(`${ENDPOINTS.PRODUCTS.LIST}${query ? `?${query}` : ""}`)
  },

  async getBySlug(slug: string): Promise<Product> {
    return api.get<Product>(ENDPOINTS.PRODUCTS.BY_SLUG(slug))
  },

  async create(data: {
    name: string
    slug: string
    price: number
    description?: string
    compareAtPrice?: number
    stock?: number
    sku?: string
    mainImage?: string
    carouselImages?: string[]
    sponsor?: string
    isFeatured?: boolean
    categoryId?: string
  }): Promise<Product> {
    return api.post<Product>(ENDPOINTS.PRODUCTS.ADMIN, data)
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    return api.patch<Product>(ENDPOINTS.PRODUCTS.BY_ID(id), data)
  },

  async remove(id: string): Promise<void> {
    return api.delete<void>(ENDPOINTS.PRODUCTS.BY_ID(id))
  },
}
