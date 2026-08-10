"use client"

import { useAuth } from "@/context/auth-provider"

export function useAuthGuard() {
  const { isAuthenticated, isLoading, user } = useAuth()
  return { isAuthenticated, isLoading, user }
}
