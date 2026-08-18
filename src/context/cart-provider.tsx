"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import type { Product } from "@/types/product"
import { cartApi } from "@/lib/cart-api"

export interface CartItem {
  productId: string
  name: string
  price: number
  mainImage: string | null
  quantity: number
  maxQuantity?: number
}

interface CartState {
  items: CartItem[]
  subtotal: number
  discount: number
  total: number
  couponCode: string | null
  couponId: string | null
  couponDiscount: number | null
  itemCount: number
  addItem: (product: Product) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  applyCoupon: (code: string, id: string, discountPercent: number) => void
  removeCoupon: () => void
  clearCart: () => void
}

const CartContext = createContext<CartState | null>(null)

function getGuestKey(): string {
  return "kamerinos_guest_cart"
}

function loadGuestCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(getGuestKey())
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

function saveGuestCart(items: CartItem[]) {
  localStorage.setItem(getGuestKey(), JSON.stringify(items))
}

function calcSubtotal(items: CartItem[]): number {
  return Math.round(items.reduce((sum, i) => sum + i.price * i.quantity, 0) * 100) / 100
}

export function CartProvider({ children, userId }: { children: ReactNode; userId?: string }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [couponCode, setCouponCode] = useState<string | null>(null)
  const [couponId, setCouponId] = useState<string | null>(null)
  const [couponDiscount, setCouponDiscount] = useState<number | null>(null)
  const [discount, setDiscount] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (userId) {
      cartApi.get().then((serverItems) => {
        const mapped: CartItem[] = serverItems.map((si) => ({
          productId: si.productId,
          name: si.product?.name || "",
          price: si.product?.price || 0,
          mainImage: si.product?.mainImage || null,
          quantity: si.quantity,
        }))
        const guestItems = loadGuestCart()
        if (guestItems.length > 0) {
          const merged = [...mapped]
          for (const gi of guestItems) {
            const existing = merged.find((m) => m.productId === gi.productId)
            if (existing) { existing.quantity += gi.quantity }
            else { merged.push(gi) }
          }
          setItems(merged)
          cartApi.merge(guestItems.map((gi) => ({ productId: gi.productId, quantity: gi.quantity }))).catch(() => {})
          localStorage.removeItem(getGuestKey())
        } else {
          setItems(mapped)
        }
      }).catch(() => {
        setItems(loadGuestCart())
      })
    } else {
      setItems(loadGuestCart())
    }
  }, [userId])

  useEffect(() => {
    if (mounted && !userId) saveGuestCart(items)
  }, [items, userId, mounted])

  const subtotal = calcSubtotal(items)
  const total = Math.round(Math.max(0, (subtotal - discount)) * 100) / 100
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  const addItem = useCallback((product: Product) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id)
      if (existing) {
        const maxQty = product.stock
        if (existing.quantity >= maxQty) return prev
        const newQty = existing.quantity + 1
        if (userId) cartApi.addItem(product.id, newQty).catch(() => {})
        return prev.map((i) => i.productId === product.id ? { ...i, quantity: newQty } : i)
      }
      if (userId) cartApi.addItem(product.id, 1).catch(() => {})
      return [...prev, { productId: product.id, name: product.name, price: product.price, mainImage: product.mainImage, quantity: 1, maxQuantity: product.stock }]
    })
  }, [userId])

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId))
    if (userId) cartApi.removeItem(productId).catch(() => {})
  }, [userId])

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) => prev.map((i) => {
      if (i.productId !== productId) return i
      const capped = Math.min(quantity, i.maxQuantity || 999)
      return { ...i, quantity: capped }
    }))
    if (userId) cartApi.updateQuantity(productId, quantity).catch(() => {})
  }, [userId, removeItem])

  const applyCoupon = useCallback((code: string, id: string, discountPercent: number) => {
    setCouponCode(code)
    setCouponId(id)
    setCouponDiscount(discountPercent)
    setDiscount(Math.round(subtotal * discountPercent * 100) / 100)
  }, [subtotal])

  const removeCoupon = useCallback(() => {
    setCouponCode(null)
    setCouponId(null)
    setCouponDiscount(null)
    setDiscount(0)
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCouponCode(null)
    setCouponId(null)
    setCouponDiscount(null)
    setDiscount(0)
    localStorage.removeItem(getGuestKey())
    if (userId) cartApi.clear().catch(() => {})
  }, [userId])

  return (
    <CartContext.Provider value={{ items, subtotal, discount, total, couponCode, couponId, couponDiscount, itemCount, addItem, removeItem, updateQuantity, applyCoupon, removeCoupon, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartState {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
