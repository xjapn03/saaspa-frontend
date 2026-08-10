"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { bookingsApi } from "@/lib/bookings-api"

interface SlotPickerProps {
  serviceId: string
  duration: number
  onSelect: (date: string, time: string) => void
  selectedDate?: string
  selectedTime?: string
}

function formatDate(d: Date) {
  return d.toISOString().split("T")[0]
}

function formatSlotTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })
}

function getNextDays(count: number): Date[] {
  const today = new Date()
  const days: Date[] = []
  for (let i = 0; i < count; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    days.push(d)
  }
  return days
}

export function SlotPicker({ serviceId, duration, onSelect, selectedDate, selectedTime }: SlotPickerProps) {
  const today = formatDate(new Date())
  const days = getNextDays(14)
  const [activeDate, setActiveDate] = useState(selectedDate || today)
  const [slots, setSlots] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchSlots = useCallback(async (date: string) => {
    setIsLoading(true)
    setError("")
    try {
      const data = await bookingsApi.getSlots(serviceId, date)
      setSlots(data)
    } catch {
      setError("Error al cargar disponibilidad")
    } finally {
      setIsLoading(false)
    }
  }, [serviceId])

  useEffect(() => {
    fetchSlots(activeDate)
  }, [activeDate, fetchSlots])

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-2">
        {days.map((d) => {
          const ds = formatDate(d)
          const isActive = ds === activeDate
          const dayName = d.toLocaleDateString("es-CO", { weekday: "short" })
          const dayNum = d.getDate()
          return (
            <button
              key={ds}
              onClick={() => setActiveDate(ds)}
              disabled={ds < today}
              className={`shrink-0 rounded-xl border px-4 py-2 text-center text-sm transition-all disabled:opacity-30 ${
                isActive
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <p className="text-xs capitalize">{dayName}</p>
              <p className="font-semibold">{dayNum}</p>
            </button>
          )
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={() => fetchSlots(activeDate)}>
            Reintentar
          </Button>
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No hay horarios disponibles para esta fecha.</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
          {slots.map((slot) => {
            const isSelected = selectedDate === activeDate && selectedTime === slot
            return (
              <button
                key={slot}
                onClick={() => onSelect(activeDate, slot)}
                className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                {formatSlotTime(slot)}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
