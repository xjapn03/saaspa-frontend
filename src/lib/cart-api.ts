import { api } from "./api"
import { ENDPOINTS } from "./constants"

export interface CartItemResponse {
  id: string
  userId: string
  productId: string
  quantity: number
  createdAt: string
  updatedAt: string
  product?: { id: string; name: string; price: number; mainImage: string | null }
}

export const cartApi = {
  async get(): Promise<CartItemResponse[]> {
    return api.get<CartItemResponse[]>(ENDPOINTS.CART.LIST)
  },

  async addItem(productId: string, quantity: number = 1): Promise<CartItemResponse> {
    return api.post<CartItemResponse>(ENDPOINTS.CART.ITEMS, { productId, quantity })
  },

  async updateQuantity(productId: string, quantity: number): Promise<CartItemResponse | { removed: boolean }> {
    return api.patch<CartItemResponse | { removed: boolean }>(ENDPOINTS.CART.ITEM(productId), { quantity })
  },

  async removeItem(productId: string): Promise<{ removed: boolean }> {
    return api.delete<{ removed: boolean }>(ENDPOINTS.CART.ITEM(productId))
  },

  async clear(): Promise<{ cleared: boolean }> {
    return api.delete<{ cleared: boolean }>(ENDPOINTS.CART.LIST)
  },

  async merge(items: { productId: string; quantity: number }[]): Promise<CartItemResponse[]> {
    return api.post<CartItemResponse[]>(ENDPOINTS.CART.MERGE, { items })
  },
}
