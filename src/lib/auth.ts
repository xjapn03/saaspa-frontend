import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "@/types/auth"
import { api } from "./api"
import { ENDPOINTS, TOKEN_KEYS } from "./constants"

export const auth = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials)
    api.setTokens(response.accessToken, response.refreshToken)
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(response.user))
    }
    return response
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data)
    api.setTokens(response.accessToken, response.refreshToken)
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(response.user))
    }
    return response
  },

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT, {
        refreshToken: api["_refreshToken"],
      })
    } catch {
      // Incluso si falla el endpoint, limpiamos localmente
    } finally {
      api.clearTokens()
    }
  },

  async refreshToken(): Promise<boolean> {
    return api["refreshAccessToken"]()
  },

  async getProfile(): Promise<User> {
    return api.get<User>(ENDPOINTS.USERS.ME)
  },

  getStoredUser(): User | null {
    if (typeof window === "undefined") return null
    const raw = localStorage.getItem(TOKEN_KEYS.USER)
    if (!raw) return null
    try {
      return JSON.parse(raw) as User
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return api.isAuthenticated
  },
}
