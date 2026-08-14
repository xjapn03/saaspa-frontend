"use client"

import { useState, useEffect } from "react"
import { X, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { bookingsApi } from "@/lib/bookings-api"
import type { User } from "@/types/auth"
import type { Booking } from "@/types/booking"

interface UserDetailDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDrawer({ user, open, onOpenChange }: UserDetailDrawerProps) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user && open) {
      setLoading(true)
      bookingsApi.list({ status: undefined, limit: 100 }).then((result) => {
        setBookings(result.data.filter((b) => b.userId === user.id).slice(0, 10))
      }).catch(() => {}).finally(() => setLoading(false))
    }
  }, [user, open])

  if (!user || !open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-xl max-h-[80vh] overflow-y-auto">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold">
            {user.firstName} {user.lastName}
          </h3>
          <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)}>
            <X className="size-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Información</p>
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span>{user.email}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Teléfono</span><span>{user.phone || "—"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Rol</span><Badge variant="outline">{user.role}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Estado</span><Badge variant={user.isActive ? "outline" : "secondary"}>{user.isActive ? "Activo" : "Inactivo"}</Badge></div>
              {user.birthday && <div className="flex justify-between"><span className="text-muted-foreground">Cumpleaños</span><span>{new Date(user.birthday).toLocaleDateString("es-CO")}</span></div>}
            </div>
          </div>

          {user.description && (
            <div>
              <Separator className="my-3" />
              <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Descripción</p>
              <p className="mt-2 text-sm text-muted-foreground">{user.description}</p>
            </div>
          )}

          <Separator />

          <div>
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">Historial de citas ({bookings.length})</p>
            {loading ? (
              <p className="mt-2 text-sm text-muted-foreground">Cargando...</p>
            ) : bookings.length === 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">Sin citas registradas</p>
            ) : (
              <div className="mt-2 space-y-2">
                {bookings.map((b) => (
                  <div key={b.id} className="flex items-center justify-between rounded-lg border border-border p-2 text-xs">
                    <div>
                      <p className="font-medium">{b.service?.name}</p>
                      <p className="text-muted-foreground">{new Date(b.startTime).toLocaleDateString("es-CO")}</p>
                    </div>
                    <Badge variant="outline">{b.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
