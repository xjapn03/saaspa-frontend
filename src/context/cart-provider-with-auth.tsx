"use client"

import { type ReactNode } from "react"
import { CartProvider } from "@/context/cart-provider"
import { useAuth } from "@/context/auth-provider"

export function CartProviderWithAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  return <CartProvider userId={user?.id}>{children}</CartProvider>
}
