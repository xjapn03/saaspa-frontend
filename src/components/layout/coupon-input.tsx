"use client"

import { useState } from "react"
import { X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { couponsApi } from "@/lib/coupons-api"

interface CouponInputProps {
  currentCode: string | null
  onApply: (code: string, id: string, discountPercent: number) => void
  onRemove: () => void
}

export function CouponInput({ currentCode, onApply, onRemove }: CouponInputProps) {
  const [input, setInput] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleApply() {
    if (!input.trim()) return
    setLoading(true)
    setError("")
    try {
      const result = await couponsApi.validate(input.trim().toUpperCase())
      if (result.valid) {
        onApply(result.code, result.id, result.discount)
        setInput("")
      } else {
        setError("Cupón inválido o expirado")
      }
    } catch {
      setError("Error al validar cupón")
    } finally {
      setLoading(false)
    }
  }

  if (currentCode) {
    return (
      <div className="flex items-center justify-between rounded-xl bg-green-50 px-3 py-2 text-sm dark:bg-green-950">
        <div className="flex items-center gap-2">
          <Check className="size-4 text-green-600" />
          <span className="font-medium text-green-700 dark:text-green-400">{currentCode}</span>
        </div>
        <Button variant="ghost" size="icon-xs" onClick={onRemove}><X className="size-3" /></Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Código de cupón"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError("") }}
          className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary"
        />
        <Button variant="outline" size="sm" onClick={handleApply} disabled={loading || !input.trim()}>
          Aplicar
        </Button>
      </div>
      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
