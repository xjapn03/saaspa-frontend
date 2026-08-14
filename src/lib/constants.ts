export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export const API_PREFIX = "/api"

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
    FORGOT_PASSWORD: `${API_PREFIX}/auth/forgot-password`,
    RESET_PASSWORD: `${API_PREFIX}/auth/reset-password`,
    VERIFY_EMAIL: (token: string) => `${API_PREFIX}/auth/verify-email/${token}`,
  },
  USERS: {
    ME: `${API_PREFIX}/users/me`,
    LIST: `${API_PREFIX}/users`,
    BY_ID: (id: string) => `${API_PREFIX}/users/${id}`,
  },
  SERVICES: {
    PUBLIC: `${API_PREFIX}/services/public`,
    PUBLIC_SLUG: (slug: string) => `${API_PREFIX}/services/public/${slug}`,
    LIST: `${API_PREFIX}/services`,
    BY_ID: (id: string) => `${API_PREFIX}/services/${id}`,
  },
  BOOKINGS: {
    LIST: `${API_PREFIX}/bookings`,
    SLOTS: `${API_PREFIX}/bookings/slots`,
    BY_ID: (id: string) => `${API_PREFIX}/bookings/${id}`,
    BALANCE: (id: string) => `${API_PREFIX}/bookings/${id}/balance`,
    CANCEL: (id: string) => `${API_PREFIX}/bookings/${id}/cancel`,
    CONFIRM: (id: string) => `${API_PREFIX}/bookings/${id}/confirm`,
    COMPLETE: (id: string) => `${API_PREFIX}/bookings/${id}/complete`,
    REOPEN: (id: string) => `${API_PREFIX}/bookings/${id}/reopen`,
    RESCHEDULE: (id: string) => `${API_PREFIX}/bookings/${id}/reschedule`,
    ADMIN_CREATE: `${API_PREFIX}/bookings/admin`,
  },
  COUPONS: {
    LIST: `${API_PREFIX}/coupons`,
    BY_ID: (id: string) => `${API_PREFIX}/coupons/${id}`,
    VALIDATE: `${API_PREFIX}/coupons/validate`,
    USE: (id: string) => `${API_PREFIX}/coupons/${id}/use`,
  },
  PRODUCTS: {
    LIST: `${API_PREFIX}/products`,
    ADMIN: `${API_PREFIX}/products/admin/all`,
    BY_SLUG: (slug: string) => `${API_PREFIX}/products/${slug}`,
    BY_ID: (id: string) => `${API_PREFIX}/products/${id}`,
  },
  CART: {
    LIST: `${API_PREFIX}/cart`,
    ITEMS: `${API_PREFIX}/cart/items`,
    ITEM: (productId: string) => `${API_PREFIX}/cart/items/${productId}`,
    MERGE: `${API_PREFIX}/cart/merge`,
  },
  CATEGORIES: {
    LIST: `${API_PREFIX}/categories`,
    TREE: `${API_PREFIX}/categories/tree`,
    BY_SLUG: (slug: string) => `${API_PREFIX}/categories/${slug}`,
    BY_ID: (id: string) => `${API_PREFIX}/categories/${id}`,
  },
  ORDERS: {
    LIST: `${API_PREFIX}/orders`,
    MY: `${API_PREFIX}/orders/my`,
    BY_ID: (id: string) => `${API_PREFIX}/orders/${id}`,
    STATUS: (id: string) => `${API_PREFIX}/orders/${id}/status`,
  },
  PAYMENTS: {
    INIT: `${API_PREFIX}/payments/init`,
    INIT_CART: `${API_PREFIX}/payments/init-cart`,
    TRANSACTIONS: `${API_PREFIX}/payments/transactions`,
    REVENUE: `${API_PREFIX}/payments/revenue`,
    MANUAL: `${API_PREFIX}/payments/manual`,
  },
} as const

export const TOKEN_KEYS = {
  ACCESS: "kamerinos_access_token",
  REFRESH: "kamerinos_refresh_token",
  USER: "kamerinos_user",
} as const
