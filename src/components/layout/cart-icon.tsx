"use client"

import { useState, useRef } from "react"
import Script from "next/script"
import { ShoppingBag, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/context/cart-provider"
import { useAuth } from "@/context/auth-provider"
import { paymentsApi } from "@/lib/payments-api"
import { CartItemRow } from "./cart-item-row"
import { CouponInput } from "./coupon-input"

declare global { interface Window { WidgetCheckout: new (c: unknown) => { open: (cb: (r: unknown) => void) => void } } }

export function CartIcon() {
  const { items, subtotal, discount, total, couponCode, couponId, itemCount, updateQuantity, removeItem, removeCoupon, applyCoupon, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)
  const formatPrice = (p: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)

  async function handleCheckout() {
    if (!isAuthenticated || !scriptReady) return
    setCheckoutLoading(true)
    setCheckoutError("")
    try {
      const config = await paymentsApi.initCart(
        items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
        couponCode || undefined,
        couponId || undefined,
      )
      const widget = new window.WidgetCheckout({
        currency: config.currency,
        amountInCents: config.amountInCents,
        reference: config.reference,
        publicKey: config.publicKey,
        signature: { integrity: config.signature },
      })
      widget.open((result: unknown) => {
        const tx = (result as Record<string, unknown>)?.transaction as Record<string, string> | undefined
        if (tx?.status === "APPROVED") {
          setPaymentSuccess(true)
          clearCart()
        } else if (tx) {
          setCheckoutError(`Pago ${tx.status === "DECLINED" ? "rechazado" : "con error"}. Intenta de nuevo.`)
        }
      })
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (err as Record<string, unknown>).message : "Error al iniciar pago"
      setCheckoutError(String(msg))
    } finally {
      setCheckoutLoading(false)
    }
  }

  return (
    <>
      <Script src="https://checkout.wompi.co/widget.js" onReady={() => setScriptReady(true)} />
      <Sheet>
        <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="relative"><ShoppingBag className="size-5" strokeWidth={1.5} />{itemCount > 0 && <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">{itemCount > 9 ? "9+" : itemCount}</span>}<span className="sr-only">Carrito</span></Button>} />

        <SheetContent side="right" className="flex w-full max-w-md flex-col p-0">
          <SheetHeader className="border-b border-border px-6 py-4">
            <SheetTitle className="font-heading text-lg font-semibold">Tu carrito</SheetTitle>
          </SheetHeader>

          {paymentSuccess ? (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <CheckCircle className="mx-auto size-12 text-primary" strokeWidth={1.5} />
                <p className="mt-4 font-heading text-xl font-semibold">¡Pago exitoso!</p>
                <p className="mt-2 text-sm text-muted-foreground">Gracias por tu compra. Recibirás un comprobante por correo.</p>
              </div>
            </div>
          ) : items.length === 0 ? (
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
                  <CartItemRow key={item.productId} item={item} onUpdateQuantity={updateQuantity} onRemove={removeItem} />
                ))}
              </div>
              <div className="border-t border-border px-6 py-4 space-y-3">
                <CouponInput currentCode={couponCode} onApply={applyCoupon} onRemove={removeCoupon} />
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
                  {discount > 0 && <div className="flex justify-between text-green-600"><span>Descuento ({couponCode})</span><span>-{formatPrice(discount)}</span></div>}
                  <div className="flex justify-between border-t border-border pt-2 font-semibold"><span>Total</span><span>{formatPrice(Math.max(0, total))}</span></div>
                </div>
                {checkoutError && <p className="text-xs text-destructive">{checkoutError}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearCart} className="flex-1">Vaciar</Button>
                  <Button size="sm" className="flex-1" onClick={handleCheckout} disabled={checkoutLoading || !isAuthenticated || !scriptReady}>
                    {checkoutLoading ? <Loader2 className="size-4 animate-spin" /> : isAuthenticated ? "Finalizar compra" : "Inicia sesión"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}
