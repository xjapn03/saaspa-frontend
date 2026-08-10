import { Calendar, Users, Sparkles, DollarSign } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"

export default function DashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Resumen
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Bienvenida al panel de Kamerinos SPA
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Citas hoy"
          value="—"
          subtitle="Próximamente"
          icon={Calendar}
        />
        <StatsCard
          title="Clientes activos"
          value="—"
          subtitle="Próximamente"
          icon={Users}
        />
        <StatsCard
          title="Servicios"
          value="6"
          subtitle="Activos"
          icon={Sparkles}
        />
        <StatsCard
          title="Ingresos del mes"
          value="—"
          subtitle="Próximamente"
          icon={DollarSign}
        />
      </div>
    </div>
  )
}
