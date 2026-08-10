import { BookingsTable } from "@/components/dashboard/bookings-table"

export default function CitasPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Citas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestión de reservas. Confirma, completa o cancela citas.
        </p>
      </div>

      <BookingsTable />
    </div>
  )
}
