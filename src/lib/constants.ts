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
} as const

export const TOKEN_KEYS = {
  ACCESS: "kamerinos_access_token",
  REFRESH: "kamerinos_refresh_token",
  USER: "kamerinos_user",
} as const
