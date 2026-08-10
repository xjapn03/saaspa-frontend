import type { User, UpdateUserRequest } from "@/types/auth"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const users = {
  async list(): Promise<User[]> {
    return api.get<User[]>(ENDPOINTS.USERS.LIST)
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
