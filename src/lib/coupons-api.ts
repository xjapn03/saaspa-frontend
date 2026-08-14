import type { Coupon, CreateCouponRequest, ValidateCouponResponse } from "@/types/coupon"
import type { PaginatedResult } from "@/types/paginated"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const couponsApi = {
  async list(): Promise<PaginatedResult<Coupon>> {
    return api.get<PaginatedResult<Coupon>>(ENDPOINTS.COUPONS.LIST)
  },

  async getById(id: string): Promise<Coupon> {
    return api.get<Coupon>(ENDPOINTS.COUPONS.BY_ID(id))
  },

  async create(data: CreateCouponRequest): Promise<Coupon> {
    return api.post<Coupon>(ENDPOINTS.COUPONS.LIST, data)
  },

  async validate(code: string): Promise<ValidateCouponResponse> {
    return api.post<ValidateCouponResponse>(ENDPOINTS.COUPONS.VALIDATE, { code })
  },

  async remove(id: string): Promise<void> {
    return api.delete(ENDPOINTS.COUPONS.BY_ID(id))
  },
}
