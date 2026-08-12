"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, Trash2, Tag, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { couponsApi } from "@/lib/coupons-api"
import type { Coupon } from "@/types/coupon"
import { CreateCouponDialog } from "./create-coupon-dialog"

export function CouponsTable() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showCreate, setShowCreate] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await couponsApi.list()
      setCoupons(result.data)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message) ? err.message[0] : err.message
          : "Error al cargar cupones"
      setError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchCoupons() }, [fetchCoupons])

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este cupón?")) return
    setActionId(id)
    try {
      await couponsApi.remove(id)
      await fetchCoupons()
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray(err.message) ? err.message[0] : err.message
        : "Error"
      alert(String(msg))
    } finally {
      setActionId(null)
    }
  }

  async function handleMarkUsed(id: string) {
    setActionId(id)
    try {
      await couponsApi.markAsUsed(id)
      await fetchCoupons()
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray(err.message) ? err.message[0] : err.message
        : "Error"
      alert(String(msg))
    } finally {
      setActionId(null)
    }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", {
      day: "numeric", month: "short", year: "numeric",
    })
  }

  function formatDiscount(d: number) {
    return `${Math.round(d * 100)}%`
  }

  function isExpired(expiresAt: string) {
    return new Date(expiresAt) < new Date()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchCoupons}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {coupons.length} cupón{coupons.length !== 1 && "es"}
        </span>
        <Button size="sm" onClick={() => setShowCreate(true)}>
          <Tag className="mr-1 size-3" strokeWidth={1.5} />
          Nuevo cupón
        </Button>
      </div>

      {coupons.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            Aún no hay cupones creados.
          </p>
          <Button size="sm" className="mt-4" onClick={() => setShowCreate(true)}>
            Crear primer cupón
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-4 py-3 font-medium text-muted-foreground">Código</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Descuento</th>
                <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Expira</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {coupons.map((c) => (
                <tr key={c.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <p className="font-mono text-sm font-medium">{c.code}</p>
                    {c.user && (
                      <p className="text-xs text-muted-foreground">
                        {c.user.firstName} {c.user.lastName}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-primary">
                    {formatDiscount(c.discount)}
                  </td>
                  <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                    {formatDate(c.expiresAt)}
                  </td>
                  <td className="px-4 py-3">
                    {c.isUsed ? (
                      <Badge variant="secondary">Usado</Badge>
                    ) : isExpired(c.expiresAt) ? (
                      <Badge variant="destructive">Expirado</Badge>
                    ) : (
                      <Badge variant="default">Válido</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {!c.isUsed && !isExpired(c.expiresAt) && (
                        <Button
                          variant="ghost" size="icon-sm"
                          disabled={actionId === c.id}
                          onClick={() => handleMarkUsed(c.id)}
                          title="Marcar como usado"
                        >
                          {actionId === c.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Check className="size-4" strokeWidth={1.5} />
                          )}
                        </Button>
                      )}
                      <Button
                        variant="ghost" size="icon-sm"
                        disabled={actionId === c.id}
                        onClick={() => handleDelete(c.id)}
                        title="Eliminar"
                      >
                        <Trash2 className="size-4" strokeWidth={1.5} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CreateCouponDialog
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={fetchCoupons}
      />
    </div>
  )
}
