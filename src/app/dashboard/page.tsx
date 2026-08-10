"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { Calendar, Users, Sparkles, DollarSign } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { bookingsApi } from "@/lib/bookings-api"
import { users as usersApi } from "@/lib/users"
import { countUp } from "@/lib/animations"
import type { User } from "@/types/auth"

function todayStr() {
  return new Date().toISOString().split("T")[0]
}

export default function DashboardPage() {
  const [citasHoy, setCitasHoy] = useState<number | null>(null)
  const [clientesActivos, setClientesActivos] = useState<number | null>(null)
  const [ingresosMes, setIngresosMes] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)
  const revenueRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [bookingsToday, allBookings, usersList] = await Promise.all([
          bookingsApi.list({ date: todayStr() }),
          bookingsApi.list(),
          usersApi.list(),
        ])

        setCitasHoy(bookingsToday.length)
        setClientesActivos(usersList.filter((u: User) => u.isActive).length)

        const now = new Date()
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthBookings = allBookings.filter((b) => {
          const d = new Date(b.startTime)
          return d >= monthStart && (b.status === "CONFIRMADA" || b.status === "COMPLETADA")
        })
        const revenue = monthBookings.reduce((sum, b) => sum + (b.service?.price || 0), 0)
        setIngresosMes(revenue)
      } catch {
        setCitasHoy(0)
        setClientesActivos(0)
        setIngresosMes(0)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  useEffect(() => {
    if (isLoading) return
    if (gridRef.current) {
      gsap.fromTo(
        gridRef.current.querySelectorAll(".stats-card"),
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" }
      )
    }
    if (revenueRef.current && ingresosMes != null && ingresosMes > 0) {
      countUp(revenueRef.current, ingresosMes, { prefix: "$", duration: 1.5 })
    }
  }, [isLoading, ingresosMes])

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

      <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Citas hoy"
          value={isLoading ? "—" : String(citasHoy ?? "—")}
          subtitle="Agendadas para hoy"
          icon={Calendar}
          className="stats-card"
        />
        <StatsCard
          title="Clientes activos"
          value={isLoading ? "—" : String(clientesActivos ?? "—")}
          subtitle="Registrados en la plataforma"
          icon={Users}
          className="stats-card"
        />
        <StatsCard
          title="Servicios"
          value="6"
          subtitle="Activos"
          icon={Sparkles}
          className="stats-card"
        />
        <StatsCard
          title="Ingresos del mes"
          value={
            isLoading
              ? "—"
              : ingresosMes != null
                ? `$${ingresosMes.toLocaleString("es-CO")}`
                : "—"
          }
          subtitle="Confirmados / completados"
          icon={DollarSign}
          className="stats-card"
        />
      </div>
    </div>
  )
}
