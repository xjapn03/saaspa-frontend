export interface Coupon {
  id: string
  code: string
  discount: number
  isActive: boolean
  maxUses: number | null
  usedCount: number
  perUserLimit: number
  expiresAt: string
  userId: string | null
  createdAt: string
  user?: { firstName: string; lastName: string; email: string }
}

export interface CreateCouponRequest {
  code: string
  discount: number
  expiresAt: string
  maxUses?: number
  perUserLimit?: number
  userId?: string
}

export interface ValidateCouponResponse {
  id: string
  code: string
  discount: number
  valid: boolean
}
