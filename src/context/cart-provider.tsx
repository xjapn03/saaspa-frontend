"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Product } from "@/types/product"

export interface CartItem {
  productId: string
  name: string
  price: number
  mainImage: string | null
  quantity: number
}

interface CartState {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  couponCode: string | null
  couponId: string | null
  itemCount: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  applyCoupon: (code: string, id: string, discountPercent: number) => void
  removeCoupon: () => void
  clearCart: () => void
}

const CartContext = createContext<CartState | null>(null)

function getStorageKey(userId?: string): string {
  return userId ? `kamerinos_user_cart_${userId}` : "kamerinos_guest_cart"
}

function loadCart(key: string): CartItem[] {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveCart(key: string, items: CartItem[]) {
  localStorage.setItem(key, JSON.stringify(items))
}

function calcSubtotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100
}

export function CartProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponId, setCouponId] = useState<string | null>(null)
  const [discount, setDiscount] = useState(0)
  const [mounted, setMounted] = useState(false)

  const storageKey = getStorageKey(userId)

  useEffect(() => {
    setMounted(true)
    const guestItems = loadCart("kamerinos_guest_cart")

    if (userId) {
      const userItems = loadCart(storageKey)
      const merged = [...userItems]
      for (const gi of guestItems) {
        const existing = merged.find((i) => i.productId === gi.productId)
        if (existing) {
          existing.quantity += gi.quantity
        } else {
          merged.push(gi)
        }
      }
      setItems(merged)
      saveCart(storageKey, merged)
      localStorage.removeItem("kamerinos_guest_cart")
    } else {
      setItems(guestItems)
    }
  }, [userId, storageKey])

  useEffect(() => {
    if (mounted) saveCart(storageKey, items)
  }, [items, storageKey, mounted])

  const subtotal = calcSubtotal(items)
  const total = Math.round((subtotal - discount) * 100) / 100
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          mainImage: product.mainImage,
          quantity: 1,
        },
      ]
    })
  }, [])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
  }, [])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.productId !== productId))
      return
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, quantity } : i))
    )
  }, [])

  const applyCoupon = useCallback((code: string, id: string, discountPercent: number) => {
    setCouponCode(code)
    setCouponId(id)
    setDiscount(Math.round(subtotal * discountPercent * 100) / 100)
  }, [subtotal])

  const removeCoupon = useCallback(() => {
    setCouponCode(null)
    setCouponId(null)
    setDiscount(0)
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCouponCode(null)
    setCouponId(null)
    setDiscount(0)
    localStorage.removeItem(storageKey)
  }, [storageKey])

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        discount,
        total,
        couponCode,
        couponId,
        itemCount,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
