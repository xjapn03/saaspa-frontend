"use client"

import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-provider"
import { CartItemRow } from "./cart-item-row"
import { CouponInput } from "./coupon-input"

interface CartIconProps {
  onCheckout?: () => void
}

export function CartIcon({ onCheckout }: CartIconProps) {
  const { items, subtotal, discount, total, couponCode, itemCount, updateQuantity, removeItem, removeCoupon, applyCoupon, clearCart } = useCart()
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon-sm" className="relative">
            <ShoppingBag className="size-5" strokeWidth={1.5} />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
            <span className="sr-only">Carrito</span>
          </Button>
        }
      />

      <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <SheetTitle className="font-heading text-lg font-semibold">Tu carrito</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center p-8 text-center">
            <div>
              <ShoppingBag className="mx-auto size-12 text-muted-foreground/30" strokeWidth={1} />
              <p className="mt-3 text-sm text-muted-foreground">Tu carrito está vacío</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {items.map((item) => (
                <CartItemRow
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="border-t border-border px-6 py-4 space-y-3">
              <CouponInput
                currentCode={couponCode}
                onApply={applyCoupon}
                onRemove={removeCoupon}
              />

              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400">
                    <span>Descuento ({couponCode})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-border pt-2 font-semibold text-foreground">
                  <span>Total</span>
                  <span>{formatPrice(Math.max(0, total))}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={clearCart} className="flex-1">
                  Vaciar
                </Button>
                <Button size="sm" className="flex-1" onClick={onCheckout}>
                  Finalizar compra
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
