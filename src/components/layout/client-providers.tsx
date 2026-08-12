"use client"

import { AuthProvider } from "@/context/auth-provider"
import { CartProviderWithAuth } from "@/context/cart-provider-with-auth"
import { ToastProvider } from "@/context/toast-provider"
import { ToastContainer } from "@/components/layout/toast-container"
import type { ReactNode } from "react"

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProviderWithAuth>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </CartProviderWithAuth>
    </AuthProvider>
  )
}
