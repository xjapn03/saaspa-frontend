import type { User, UpdateUserRequest } from "@/types/auth"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const users = {
  async list(params?: { role?: string; sortBy?: string; order?: string }): Promise<User[]> {
    const qs = new URLSearchParams()
    if (params?.role) qs.set("role", params.role)
    if (params?.sortBy) qs.set("sortBy", params.sortBy)
    if (params?.order) qs.set("order", params.order)
    const query = qs.toString()
    return api.get<User[]>(`${ENDPOINTS.USERS.LIST}${query ? `?${query}` : ""}`)
  },

  async create(data: { firstName: string; lastName: string; email: string; password: string; phone?: string; role?: string }): Promise<User> {
    return api.post<User>(ENDPOINTS.USERS.LIST, data)
  },

  async getById(id: string): Promise<User> {
    return api.get<User>(ENDPOINTS.USERS.BY_ID(id))
  },

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return api.patch<User>(ENDPOINTS.USERS.BY_ID(id), data)
  },

  async remove(id: string): Promise<void> {
    return api.delete(ENDPOINTS.USERS.BY_ID(id))
  },

  async getProfile(): Promise<User> {
    return api.get<User>(ENDPOINTS.USERS.ME)
  },

  async updateProfile(data: UpdateUserRequest): Promise<User> {
    return api.patch<User>(ENDPOINTS.USERS.ME, data)
  },
}
