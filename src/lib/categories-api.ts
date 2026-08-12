import { api } from "./api"
import { ENDPOINTS } from "./constants"

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  parentId: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
  parent?: Category | null
  children?: Category[]
}

export const categoriesApi = {
  async list(): Promise<Category[]> {
    return api.get<Category[]>(ENDPOINTS.CATEGORIES.LIST)
  },
  async tree(): Promise<Category[]> {
    return api.get<Category[]>(ENDPOINTS.CATEGORIES.TREE)
  },
  async create(data: { name: string; slug: string; description?: string; imageUrl?: string; parentId?: string }): Promise<Category> {
    return api.post<Category>(ENDPOINTS.CATEGORIES.LIST, data)
  },
  async update(id: string, data: { name?: string; slug?: string; description?: string; imageUrl?: string; parentId?: string | null; isActive?: boolean }): Promise<Category> {
    return api.patch<Category>(ENDPOINTS.CATEGORIES.BY_ID(id), data)
  },
  async remove(id: string): Promise<void> {
    return api.delete(ENDPOINTS.CATEGORIES.BY_ID(id))
  },
}
