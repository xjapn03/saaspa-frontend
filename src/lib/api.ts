import type { ApiErrorResponse } from "@/types/auth"
import { API_BASE_URL, ENDPOINTS } from "./constants"

class ApiClient {
  private refreshPromise: Promise<boolean> | null = null

  private async refreshAccessToken(): Promise<boolean> {
    try {
      const res = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTH.REFRESH}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
      return res.ok
    } catch {
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

    let res = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers,
      credentials: "include",
    })

    if (res.status === 401) {
      const refreshed = await this.queueRefresh()
      if (refreshed) {
        res = await fetch(`${API_BASE_URL}${url}`, {
          ...options,
          headers,
          credentials: "include",
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
