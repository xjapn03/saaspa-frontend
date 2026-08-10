"use client"

import { AuthProvider } from "@/context/auth-provider"
import { ToastContainer } from "@/components/layout/toast-container"
import type { ReactNode } from "react"

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ToastContainer />
    </AuthProvider>
  )
}
