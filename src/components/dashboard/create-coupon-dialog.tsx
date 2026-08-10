"use client"

import { useState } from "react"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { couponsApi } from "@/lib/coupons-api"

interface CreateCouponDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
}

export function CreateCouponDialog({ open, onOpenChange, onCreated }: CreateCouponDialogProps) {
  const [code, setCode] = useState("")
  const [discount, setDiscount] = useState("")
  const [expiresAt, setExpiresAt] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!open) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    const discountNum = parseFloat(discount) / 100
    if (isNaN(discountNum) || discountNum <= 0 || discountNum > 1) {
      setError("El descuento debe ser entre 1% y 100%")
      return
    }

    setIsSubmitting(true)
    try {
      await couponsApi.create({
        code,
        discount: discountNum,
        expiresAt,
      })
      setCode("")
      setDiscount("")
      setExpiresAt("")
      onOpenChange(false)
      onCreated()
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message) ? err.message[0] : err.message
          : "Error al crear cupón"
      setError(String(msg))
    } finally {
      setIsSubmitting(false)
    }
  }

  function close() {
    if (!isSubmitting) {
      setError("")
      onOpenChange(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">Nuevo cupón</h3>
          <Button variant="ghost" size="icon-sm" onClick={close} title="Cerrar">
            <X className="size-4" strokeWidth={1.5} />
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Código
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              placeholder="BIENVENIDA15"
              maxLength={30}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Descuento (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              placeholder="15"
              min={1}
              max={100}
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-muted-foreground">
              Fecha de expiración
            </label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
              required
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={close} disabled={isSubmitting} type="button">
              Cancelar
            </Button>
            <Button size="sm" type="submit" disabled={isSubmitting || !code || !discount || !expiresAt}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1 size-3 animate-spin" />
                  Creando...
                </>
              ) : (
                "Crear cupón"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
