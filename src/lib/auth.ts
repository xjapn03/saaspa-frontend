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
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEYS.USER, JSON.stringify(response.user))
    }
    return response
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data)
    return response
  },

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT, undefined)
    } catch {
      // Incluso si falla el endpoint, limpiamos localmente
    } finally {
      this.clearStoredUser()
    }
  },

  clearStoredUser(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEYS.USER)
    }
  },

  async getProfile(): Promise<User> {
    return api.get<User>(ENDPOINTS.USERS.ME)
  },

  async requestEmailChange(newEmail: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(ENDPOINTS.AUTH.EMAIL_CHANGE_REQUEST, { newEmail })
  },

  async confirmEmailChange(code: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(ENDPOINTS.AUTH.EMAIL_CHANGE_CONFIRM, { code })
  },

  async resendVerification(email: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(ENDPOINTS.AUTH.RESEND_VERIFICATION, { email })
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    return api.post<{ message: string }>(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword })
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
}
