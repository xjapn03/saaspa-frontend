import type { Banner, CreateBannerRequest, UpdateBannerRequest } from "@/types/banner"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const bannersApi = {
  async list(): Promise<Banner[]> {
    return api.get<Banner[]>(ENDPOINTS.BANNERS.LIST)
  },

  async listPublic(position?: string): Promise<Banner[]> {
    const qs = position ? `?position=${position}` : ""
    return api.get<Banner[]>(`${ENDPOINTS.BANNERS.PUBLIC}${qs}`)
  },

  async create(data: CreateBannerRequest): Promise<Banner> {
    return api.post<Banner>(ENDPOINTS.BANNERS.LIST, data)
  },

  async update(id: string, data: UpdateBannerRequest): Promise<Banner> {
    return api.patch<Banner>(ENDPOINTS.BANNERS.BY_ID(id), data)
  },

  async remove(id: string): Promise<void> {
    return api.delete(ENDPOINTS.BANNERS.BY_ID(id))
  },
}
