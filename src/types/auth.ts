export type Role = "CLIENTE" | "EMPLEADO" | "ADMIN"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone: string | null
  birthday: string | null
  description: string | null
  role: Role
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  birthday?: string
  description?: string
  role?: Role
}

export interface AuthResponse {
  user: User
  accessToken: string
  refreshToken: string
}

export interface RefreshResponse {
  accessToken: string
  refreshToken: string
}

export interface ApiErrorResponse {
  statusCode: number
  message: string | string[]
  error?: string
}
