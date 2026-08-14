"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus } from "lucide-react"
import { useAuth } from "@/context/auth-provider"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { ClientBookingCalendar } from "@/components/dashboard/client-booking-calendar"
import { AdminCreateBooking } from "@/components/dashboard/admin-create-booking"
import { Button } from "@/components/ui/button"
import { users as usersApi } from "@/lib/users"
import { servicesApi } from "@/lib/services-api"
import type { User } from "@/types/auth"
import type { Service } from "@/types/service"

export default function CitasPage() {
  const { user } = useAuth()
  const isClient = user?.role === "CLIENTE"
  const isAdmin = user?.role === "ADMIN" || user?.role === "EMPLEADO"
  const [showCreate, setShowCreate] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [refresh, setRefresh] = useState(0)

  const fetchData = useCallback(async () => {
    if (!isAdmin) return
    try {
      const [u, s] = await Promise.all([usersApi.list(), servicesApi.list()])
      setUsers(u.data)
      setServices(s.data)
    } catch { /* graceful */ }
  }, [isAdmin])

  useEffect(() => { fetchData() }, [fetchData])

  function handleCreated() { setRefresh(r => r + 1) }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {isClient ? "Mis citas" : "Citas"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {isClient
              ? "Tu calendario de rituales. Para cancelar o reagendar, escríbenos por WhatsApp."
              : "Gestión de reservas. Confirma, completa, reagenda o cancela citas."}
          </p>
        </div>
        {isAdmin && (
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="mr-1 size-3" strokeWidth={1.5} />
            Nueva cita
          </Button>
        )}
      </div>

      {isClient ? (
        <ClientBookingCalendar key={refresh} />
      ) : (
        <BookingsTable key={refresh} />
      )}

      <AdminCreateBooking
        open={showCreate}
        onOpenChange={setShowCreate}
        onCreated={handleCreated}
        users={users}
        services={services}
      />
    </div>
  )
}
