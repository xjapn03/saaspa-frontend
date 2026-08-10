export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export const API_PREFIX = "/api"

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_PREFIX}/auth/login`,
    REGISTER: `${API_PREFIX}/auth/register`,
    REFRESH: `${API_PREFIX}/auth/refresh`,
    LOGOUT: `${API_PREFIX}/auth/logout`,
  },
  USERS: {
    ME: `${API_PREFIX}/users/me`,
    LIST: `${API_PREFIX}/users`,
    BY_ID: (id: string) => `${API_PREFIX}/users/${id}`,
  },
  SERVICES: {
    PUBLIC: `${API_PREFIX}/services/public`,
    LIST: `${API_PREFIX}/services`,
    BY_ID: (id: string) => `${API_PREFIX}/services/${id}`,
  },
  BOOKINGS: {
    LIST: `${API_PREFIX}/bookings`,
    SLOTS: `${API_PREFIX}/bookings/slots`,
    BY_ID: (id: string) => `${API_PREFIX}/bookings/${id}`,
    CANCEL: (id: string) => `${API_PREFIX}/bookings/${id}/cancel`,
    CONFIRM: (id: string) => `${API_PREFIX}/bookings/${id}/confirm`,
    COMPLETE: (id: string) => `${API_PREFIX}/bookings/${id}/complete`,
    RESCHEDULE: (id: string) => `${API_PREFIX}/bookings/${id}/reschedule`,
  },
} as const

export const TOKEN_KEYS = {
  ACCESS: "kamerinos_access_token",
  REFRESH: "kamerinos_refresh_token",
  USER: "kamerinos_user",
} as const
