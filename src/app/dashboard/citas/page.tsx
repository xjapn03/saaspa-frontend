"use client"

import { useAuth } from "@/context/auth-provider"
import { BookingsTable } from "@/components/dashboard/bookings-table"
import { ClientBookingCalendar } from "@/components/dashboard/client-booking-calendar"

export default function CitasPage() {
  const { user } = useAuth()
  const isClient = user?.role === "CLIENTE"

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {isClient ? "Mis citas" : "Citas"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {isClient
            ? "Tu calendario de rituales. Para cancelar o reagendar, escríbenos por WhatsApp."
            : "Gestión de reservas. Confirma, completa, reagenda o cancela citas."}
        </p>
      </div>

      {isClient ? <ClientBookingCalendar /> : <BookingsTable />}
    </div>
  )
}
