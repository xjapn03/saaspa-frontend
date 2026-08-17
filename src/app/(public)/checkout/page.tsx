"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { Loader2, CheckCircle, ArrowLeft, ShoppingBag, CreditCard, User, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-provider"
import { useAuth } from "@/context/auth-provider"
import { paymentsApi } from "@/lib/payments-api"
import { useToast } from "@/context/toast-provider"
import { initiateCheckout } from "@/lib/meta-pixel"
import { getAllDepartments, getCitiesByDepartment } from "@/lib/colombia"

declare global { interface Window { WidgetCheckout: new (c: unknown) => { open: (cb: (r: unknown) => void) => void } } }

type Step = "info" | "payment"

interface BillingInfo {
  name: string
  email: string
  phone: string
  address: string
  state: string
  city: string
  nit: string
  notes: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, discount, total, couponCode, couponId, removeCoupon, clearCart, itemCount } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { error: showError } = useToast()

  const [step, setStep] = useState<Step>("info")
  const [info, setInfo] = useState<BillingInfo>({
    name: user ? `${user.firstName} ${user.lastName}` : "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    state: "",
    city: "",
    nit: "",
    notes: "",
  })
  
  const departments = getAllDepartments()
  const availableCities = getCitiesByDepartment(info.state)
  const [scriptReady, setScriptReady] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [wompiConfig, setWompiConfig] = useState<{ publicKey: string; amountInCents: number; currency: string; reference: string; signature: string } | null>(null)

  useEffect(() => {
    // Scroll automatically to top on step change or success
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 50)
    
    if (items.length === 0 || paymentSuccess) return
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [items.length, paymentSuccess, step])

  const formatPrice = (p: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)

  function handleInfoChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    if (name === "state") {
      setInfo((prev) => ({ ...prev, state: value, city: "" }))
    } else {
      setInfo((prev) => ({ ...prev, [name]: value }))
    }
  }

  function canProceed() {
    return info.name.trim() && info.email.trim() && info.phone.trim() && info.address.trim() && info.state.trim() && info.city.trim() && info.nit.trim()
  }

  async function handleStartPayment() {
    if (!canProceed()) {
      showError("Completa todos los campos requeridos")
      return
    }
    setCheckoutLoading(true)
    setCheckoutError("")
    try {
      const config = await paymentsApi.initCart(
        items.map((i) => ({ productId: i.productId, name: i.name, price: i.price, quantity: i.quantity })),
        couponCode || undefined,
        couponId || undefined,
        {
          shippingName: info.name,
          shippingEmail: info.email,
          shippingPhone: info.phone,
          shippingAddress: info.address,
          shippingState: info.state,
          shippingCity: info.city,
          shippingNit: info.nit,
          shippingNotes: info.notes || undefined,
        },
      )
      setWompiConfig(config)
      setStep("payment")
      initiateCheckout({
        value: Math.max(0, total),
        numItems: itemCount,
      })
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (err as any).message : "Error al iniciar el pago"
      setCheckoutError(String(msg))
    } finally {
      setCheckoutLoading(false)
    }
  }

  function handlePaymentResult(result: any) {
    document.body.style.overflow = ""
    const tx = result?.transaction
    if (tx?.status === "APPROVED") {
      setPaymentSuccess(true)
      clearCart()
    } else if (tx) {
      setCheckoutError(`Pago ${tx.status === "DECLINED" ? "rechazado" : "con error"}. Intenta de nuevo.`)
    }
  }

  if (paymentSuccess) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center px-6 pt-28 pb-24">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-12 text-center">
          <CheckCircle className="mx-auto size-14 text-primary" strokeWidth={1.5} />
          <p className="mt-4 font-heading text-2xl font-semibold">¡Pago exitoso!</p>
          <p className="mt-2 text-sm text-muted-foreground">Gracias por tu compra. Recibirás un comprobante por correo.</p>
          <div className="mt-8 flex flex-col gap-3">
            <Button size="lg" onClick={() => router.push("/dashboard")}>Ver mis pedidos</Button>
            <Button variant="outline" size="lg" onClick={() => router.push("/shop")}>Seguir comprando</Button>
          </div>
        </div>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className="flex min-h-[80vh] items-center justify-center px-6 pt-28 pb-24">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-12 text-center">
          <ShoppingBag className="mx-auto size-12 text-muted-foreground/30" strokeWidth={1} />
          <p className="mt-4 font-heading text-xl font-semibold">Tu carrito está vacío</p>
          <p className="mt-2 text-sm text-muted-foreground">Agrega productos antes de continuar al checkout.</p>
          <Button className="mt-6" size="lg" onClick={() => router.push("/shop")}>Ir a la tienda</Button>
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-6 pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <span className={step === "info" ? "text-primary" : ""}>Datos</span>
          <span className="text-muted-foreground/40">→</span>
          <span className={step === "payment" ? "text-primary" : ""}>Pago</span>
        </div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {step === "info" ? "Checkout" : "Finalizar pago"}
        </h1>
      </div>

      <div className="mb-8 flex gap-2">
        <div className={`h-1 flex-1 rounded-full transition-colors ${step === "info" || step === "payment" ? "bg-primary" : "bg-muted"}`} />
        <div className={`h-1 flex-1 rounded-full transition-colors ${step === "payment" ? "bg-primary" : "bg-muted"}`} />
      </div>

      {step === "info" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><User className="size-4" /></span>
              <div><p className="font-medium text-foreground">Datos de facturación</p><p className="text-xs text-muted-foreground">Información para el comprobante y envío</p></div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Nombre completo *</label>
                <input name="name" value={info.name} onChange={handleInfoChange} placeholder="Ej: María Gómez" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email *</label>
                  <input name="email" type="email" value={info.email} onChange={handleInfoChange} placeholder="correo@ejemplo.com" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Teléfono *</label>
                  <input name="phone" value={info.phone} onChange={handleInfoChange} placeholder="3001234567" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><MapPin className="size-4" /></span>
              <div><p className="font-medium text-foreground">Dirección de envío</p><p className="text-xs text-muted-foreground">Dónde quieres recibir tu pedido</p></div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Departamento *</label>
                  <select name="state" value={info.state} onChange={handleInfoChange} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
                    <option value="">Selecciona...</option>
                    {departments.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Ciudad *</label>
                  <select name="city" value={info.city} onChange={handleInfoChange} disabled={!info.state} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-50">
                    <option value="">Selecciona...</option>
                    {availableCities.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dirección exacta *</label>
                <input name="address" value={info.address} onChange={handleInfoChange} placeholder="Calle 123 #45-67, Apto 101" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Cédula o NIT (Facturación) *</label>
                <input name="nit" value={info.nit} onChange={handleInfoChange} placeholder="123456789" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Notas adicionales</label>
                <textarea name="notes" value={info.notes} onChange={handleInfoChange} rows={2} placeholder="Indicaciones para la entrega, horario preferido..." className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => router.back()}><ArrowLeft className="mr-2 size-4" /> Volver</Button>
            <Button className="flex-1" size="lg" onClick={handleStartPayment} disabled={checkoutLoading}>
              {checkoutLoading ? <Loader2 className="size-4 animate-spin" /> : "Continuar al pago"}
            </Button>
          </div>
        </div>
      )}

      {step === "payment" && (
        <div className="space-y-6">
          <Script src="https://checkout.wompi.co/widget.js" onReady={() => setScriptReady(true)} />

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><CreditCard className="size-4" /></span>
              <div><p className="font-medium text-foreground">Resumen del pedido</p><p className="text-xs text-muted-foreground">{items.length} producto(s) en tu carrito</p></div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-muted/30 text-xs text-muted-foreground">{item.quantity}x</div>
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{formatPrice(item.price)} c/u</p>
                    </div>
                  </div>
                  <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>

            <Separator className="my-4" />

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Descuento {couponCode && `(${couponCode})`}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-semibold text-base"><span>Total</span><span>{formatPrice(Math.max(0, total))}</span></div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary"><User className="size-4" /></span>
              <div><p className="font-medium text-foreground">Envío a</p><p className="text-xs text-muted-foreground">{info.address}, {info.city}, {info.state}</p></div>
            </div>
            <p className="text-sm text-muted-foreground">{info.name} · CC/NIT: {info.nit} · {info.phone} · {info.email}</p>
          </div>

          {checkoutError && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{checkoutError}</div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" size="lg" onClick={() => setStep("info")}><ArrowLeft className="mr-2 size-4" /> Volver</Button>
            <Button
              className="flex-1"
              size="lg"
              onClick={() => {
                if (wompiConfig && scriptReady) {
                  new window.WidgetCheckout({
                    currency: wompiConfig.currency,
                    amountInCents: wompiConfig.amountInCents,
                    reference: wompiConfig.reference,
                    publicKey: wompiConfig.publicKey,
                    signature: { integrity: wompiConfig.signature },
                  } as any).open(handlePaymentResult)
                }
              }}
              disabled={!scriptReady || !wompiConfig}
            >
              {!scriptReady ? <Loader2 className="size-4 animate-spin" /> : <><CreditCard className="mr-2 size-4" />Pagar {formatPrice(Math.max(0, total))}</>}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}
