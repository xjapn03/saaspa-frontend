import type {
  AuthResponse,
  RefreshResponse,
  ApiErrorResponse,
} from "@/types/auth"
import { API_BASE_URL, ENDPOINTS, TOKEN_KEYS } from "./constants"

class ApiClient {
  private _accessToken: string | null = null
  private _refreshToken: string | null = null
  private refreshPromise: Promise<boolean> | null = null

  constructor() {
    if (typeof window !== "undefined") {
      this._accessToken = localStorage.getItem(TOKEN_KEYS.ACCESS)
      this._refreshToken = localStorage.getItem(TOKEN_KEYS.REFRESH)
    }
  }

  get accessToken() {
    return this._accessToken
  }

  get isAuthenticated() {
    return !!this._accessToken
  }

  setTokens(accessToken: string, refreshToken: string) {
    this._accessToken = accessToken
    this._refreshToken = refreshToken
    if (typeof window !== "undefined") {
      localStorage.setItem(TOKEN_KEYS.ACCESS, accessToken)
      localStorage.setItem(TOKEN_KEYS.REFRESH, refreshToken)
    }
  }

  clearTokens() {
    this._accessToken = null
    this._refreshToken = null
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOKEN_KEYS.ACCESS)
      localStorage.removeItem(TOKEN_KEYS.REFRESH)
      localStorage.removeItem(TOKEN_KEYS.USER)
    }
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this._refreshToken) return false

    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: this._refreshToken }),
      })

      if (!res.ok) {
        this.clearTokens()
        return false
      }

      const data: RefreshResponse = await res.json()
      this.setTokens(data.accessToken, data.refreshToken)
      return true
    } catch {
      this.clearTokens()
      return false
    }
  }

  private async queueRefresh(): Promise<boolean> {
    if (!this.refreshPromise) {
      this.refreshPromise = this.refreshAccessToken().finally(() => {
        this.refreshPromise = null
      })
    }
    return this.refreshPromise
  }

  private async request<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    }

    if (this._accessToken) {
      headers["Authorization"] = `Bearer ${this._accessToken}`
    }

    let res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
    })

    if (res.status === 401 && this._refreshToken) {
      const refreshed = await this.queueRefresh()
      if (refreshed) {
        headers["Authorization"] = `Bearer ${this._accessToken}`
        res = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
        })
      }
    }

    if (!res.ok) {
      const error: ApiErrorResponse = await res.json().catch(() => ({
        statusCode: res.status,
        message: "Error de conexión",
      }))
      throw error
    }

    if (res.status === 204) {
      return undefined as T
    }

    return res.json()
  }

  async get<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: "GET" })
  }

  async post<T>(url: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async patch<T>(
    url: string,
    body?: unknown,
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    })
  }

  async delete<T>(url: string, options?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...options, method: "DELETE" })
  }
}

export const api = new ApiClient()
