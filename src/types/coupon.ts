export interface Coupon {
  id: string
  code: string
  discount: number
  isUsed: boolean
  expiresAt: string
  userId: string | null
  createdAt: string
  user?: { firstName: string; lastName: string; email: string }
}

export interface CreateCouponRequest {
  code: string
  discount: number
  expiresAt: string
  userId?: string
}

export interface ValidateCouponResponse {
  id: string
  code: string
  discount: number
  valid: boolean
}
