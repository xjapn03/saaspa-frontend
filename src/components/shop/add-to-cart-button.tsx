"use client"

import { useState } from "react"
import { ShoppingBag, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-provider"
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

  function handleAdd() {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="flex items-center gap-2">
      {inCart > 0 ? (
        <div className="flex items-center gap-2 rounded-xl border border-border px-2 py-1">
          <span className="text-sm font-medium">{inCart} en carrito</span>
        </div>
      ) : null}
      <Button
        onClick={handleAdd}
        disabled={disabled || product.stock === 0}
        size="lg"
        className="flex-1 transition-all"
      >
        <ShoppingBag className="mr-2 size-5" />
        {added ? "Agregado!" : product.stock > 0 ? "Agregar al carrito" : "Agotado"}
      </Button>
    </div>
  )
}
