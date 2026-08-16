"use client"

import { useState } from "react"
import { ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-provider"
import { addToCart } from "@/lib/meta-pixel"
import type { Product } from "@/types/product"

interface AddToCartButtonProps {
  product: Product
  disabled?: boolean
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)
  const existingItem = items.find((i) => i.productId === product.id)
  const inCart = existingItem ? existingItem.quantity : 0
  const atMax = inCart >= product.stock
  const outOfStock = product.stock === 0

  function handleAdd() {
    if (atMax) return
    addItem(product)
    addToCart({
      contentName: product.name,
      value: product.price,
      contentIds: [product.id],
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const buttonLabel = outOfStock
    ? "Agotado"
    : atMax
      ? "Stock máximo alcanzado"
      : added
        ? "Agregado!"
        : "Agregar al carrito"

  return (
    <div className="flex items-center gap-2">
      {inCart > 0 && (
        <span className="text-sm font-medium text-muted-foreground">
          {inCart} {atMax ? `/ ${product.stock}` : ""} en carrito
        </span>
      )}
      <Button
        onClick={handleAdd}
        disabled={disabled || outOfStock || atMax}
        size="lg"
        className="flex-1 transition-all"
      >
        <ShoppingBag className="mr-2 size-5" />
        {buttonLabel}
      </Button>
    </div>
  )
}
