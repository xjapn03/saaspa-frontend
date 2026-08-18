"use client"

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { LoginRequest, RegisterRequest, User } from "@/types/auth"
import { auth } from "@/lib/auth"
import { completeRegistration } from "@/lib/meta-pixel"

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthState | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const profile = await auth.getProfile()
      setUser(profile)
      if (typeof window !== "undefined") {
        localStorage.setItem("kamerinos_user", JSON.stringify(profile))
      }
    } catch {
      setUser(null)
      auth.clearStoredUser()
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      setUser(auth.getStoredUser())
      try {
        const profile = await auth.getProfile()
        setUser(profile)
        if (typeof window !== "undefined") {
          localStorage.setItem("kamerinos_user", JSON.stringify(profile))
        }
      } catch {
        setUser(null)
        auth.clearStoredUser()
      }
      setIsLoading(false)
    }
    init()
  }, [])

  const login = useCallback(async (credentials: LoginRequest) => {
    const response = await auth.login(credentials)
    setUser(response.user)
  }, [])

  const register = useCallback(async (data: RegisterRequest) => {
    await auth.register(data)
    try {
      completeRegistration("email")
    } catch {
      // El evento de pixel no debe romper el registro ya completado
    }
  }, [])

  const logout = useCallback(async () => {
    await auth.logout()
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return ctx
}
