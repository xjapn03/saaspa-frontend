import type {
  Service,
  CreateServiceRequest,
  UpdateServiceRequest,
} from "@/types/service"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const servicesApi = {
  async list(): Promise<Service[]> {
    return api.get<Service[]>(ENDPOINTS.SERVICES.LIST)
  },

  async listPublic(): Promise<Service[]> {
    return api.get<Service[]>(ENDPOINTS.SERVICES.PUBLIC)
  },

  async getById(id: string): Promise<Service> {
    return api.get<Service>(ENDPOINTS.SERVICES.BY_ID(id))
  },

  async create(data: CreateServiceRequest): Promise<Service> {
    return api.post<Service>(ENDPOINTS.SERVICES.LIST, data)
  },

  async update(id: string, data: UpdateServiceRequest): Promise<Service> {
    return api.patch<Service>(ENDPOINTS.SERVICES.BY_ID(id), data)
  },

  async remove(id: string): Promise<void> {
    return api.delete(ENDPOINTS.SERVICES.BY_ID(id))
  },
}
