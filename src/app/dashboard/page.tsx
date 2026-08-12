"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"
import { Calendar, Clock, DollarSign, Sparkles, Users } from "lucide-react"
import { StatsCard } from "@/components/dashboard/stats-card"
import { TipsCard } from "@/components/dashboard/tips-card"
import { MyOrders } from "@/components/dashboard/my-orders"
import { bookingsApi } from "@/lib/bookings-api"
import { users as usersApi } from "@/lib/users"
import { paymentsApi } from "@/lib/payments-api"
import { useAuth } from "@/context/auth-provider"
import type { User } from "@/types/auth"
import type { Booking } from "@/types/booking"

function todayStr() {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`
}

export default function DashboardPage() {
  const { user } = useAuth()
  const isClient = user?.role === "CLIENTE"

  const [citasTotales, setCitasTotales] = useState<number | null>(null)
  const [proximaCita, setProximaCita] = useState<Booking | null>(null)
  const [citasHoy, setCitasHoy] = useState<number | null>(null)
  const [clientesActivos, setClientesActivos] = useState<number | null>(null)
  const [ingresosMes, setIngresosMes] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        if (isClient) {
          const result = await bookingsApi.list()
          const allBookings = result.data
          setCitasTotales(allBookings.length)
          const next = allBookings
            .filter(b => b.status === "CONFIRMADA" || b.status === "PENDIENTE_PAGO")
            .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0] || null
          setProximaCita(next)
        } else {
          const [todayResult, allResult, usersList, revenue] = await Promise.all([
            bookingsApi.list({ date: todayStr() }),
            bookingsApi.list(),
            usersApi.list(),
            paymentsApi.getRevenue(todayStr().slice(0, 7)),
          ])
          setCitasHoy(todayResult.data.length)
          setClientesActivos(usersList.data.filter((u: User) => u.isActive).length)
          setIngresosMes(revenue.total)
        }
      } catch { /* graceful */ } finally { setIsLoading(false) }
    }
    fetchStats()
  }, [isClient])

  useEffect(() => {
    if (isLoading || !gridRef.current) return
    gsap.fromTo(gridRef.current.querySelectorAll(".stats-card"), { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power3.out" })
  }, [isLoading])

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  if (isClient) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            Hola, {user?.firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bienvenida a tu panel personal de Kamerinos SPA
          </p>
        </div>

        <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard title="Total de citas" value={isLoading ? "—" : String(citasTotales ?? "—")} subtitle="Desde tu registro" icon={Calendar} className="stats-card" />
          <StatsCard title="Próxima cita" value={isLoading ? "—" : proximaCita ? formatDate(proximaCita.startTime) : "—"} subtitle={proximaCita ? `${formatTime(proximaCita.startTime)} · ${proximaCita.service?.name || ""}` : "Sin citas pendientes"} icon={Clock} className="stats-card" />
          <StatsCard title="Citas completadas" value={isLoading ? "—" : String(citasTotales ?? "—")} subtitle="Rituales vividos" icon={Sparkles} className="stats-card" />
          <TipsCard className="stats-card" />
        </div>
        <MyOrders />
      </div>
    )
  }



  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Resumen</h1>
        <p className="mt-1 text-sm text-muted-foreground">Bienvenida al panel de Kamerinos SPA</p>
      </div>
      <div ref={gridRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Citas hoy" value={isLoading ? "—" : String(citasHoy ?? "—")} subtitle="Agendadas para hoy" icon={Calendar} className="stats-card" />
        <StatsCard title="Clientes activos" value={isLoading ? "—" : String(clientesActivos ?? "—")} subtitle="Registrados en la plataforma" icon={Users} className="stats-card" />
        <StatsCard title="Servicios" value="6" subtitle="Activos" icon={Sparkles} className="stats-card" />
        <StatsCard title="Ingresos del mes" value={isLoading ? "—" : ingresosMes != null ? `$${ingresosMes.toLocaleString("es-CO")}` : "—"} subtitle="Pagos netos recibidos" icon={DollarSign} className="stats-card" />
      </div>
    </div>
  )
}
