"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { bookingsApi } from "@/lib/bookings-api"
import { users as usersApi } from "@/lib/users"
import { SlotPicker } from "@/components/booking/slot-picker"
import type { User } from "@/types/auth"
import type { Service } from "@/types/service"

interface AdminCreateBookingProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: () => void
  users: User[]
  services: Service[]
}

export function AdminCreateBooking({ open, onOpenChange, onCreated, users, services }: AdminCreateBookingProps) {
  const router = useRouter()
  const [step, setStep] = useState<"user" | "service" | "slot" | "confirm">("user")
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [userSearchFocused, setUserSearchFocused] = useState(false)

  const filteredUsers = users.filter(u =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  )

  const steps = ["Cliente", "Servicio", "Horario", "Confirmar"]
  const currentStepIndex = ["user", "service", "slot", "confirm"].indexOf(step)

  function reset() { setStep("user"); setSearch(""); setSelectedUser(null); setSelectedService(null); setSelectedDate(""); setSelectedTime(""); setError("") }

  function handleClose() { reset(); onOpenChange(false) }

  async function handleCreate() {
    if (!selectedUser || !selectedService || !selectedTime) return
    setError("")
    setIsSubmitting(true)
    try {
      await bookingsApi.createForUser(selectedUser.id, {
        serviceId: selectedService.id,
        startTime: selectedTime,
      })
      reset()
      onCreated()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (Array.isArray(err.message) ? err.message[0] : err.message) : "Error al crear cita"
      setError(String(msg))
    } finally { setIsSubmitting(false) }
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })
  }
  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", hour12: true })
  }

  return (
    <Modal open={open} onOpenChange={handleClose} title="Nueva cita" description="Agenda una cita para un cliente desde mostrador">
      {error && (<div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>)}

      <div className="mb-6 flex gap-1">
        {steps.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={`h-1 rounded-full transition-colors ${i <= currentStepIndex ? "bg-primary" : "bg-muted"}`} />
            <p className={`mt-1 text-xs text-center ${i <= currentStepIndex ? "text-primary font-medium" : "text-muted-foreground"}`}>{s}</p>
          </div>
        ))}
      </div>

      {step === "user" && (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              onFocus={() => setUserSearchFocused(true)} onBlur={() => setTimeout(() => setUserSearchFocused(false), 200)}
              placeholder="Buscar cliente por nombre o email..."
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredUsers.slice(0, 12).map(u => (
              <button key={u.id} onClick={() => { setSelectedUser(u); setSearch(`${u.firstName} ${u.lastName}`); setStep("service") }}
                className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-sm transition-colors ${selectedUser?.id === u.id ? "bg-primary/10 text-primary" : "hover:bg-muted"}`}>
                <div className="text-left"><span className="font-medium">{u.firstName} {u.lastName}</span><span className="ml-2 text-xs text-muted-foreground">{u.email}</span></div>
                {selectedUser?.id === u.id && <Check className="size-4 text-primary" strokeWidth={1.5} />}
              </button>
            ))}
            {filteredUsers.length === 0 && (<p className="py-4 text-center text-sm text-muted-foreground">Sin resultados</p>)}
          </div>
        </div>
      )}

      {step === "service" && (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {services.map(s => (
            <button key={s.id} onClick={() => { setSelectedService(s); setStep("slot") }}
              className={`w-full rounded-xl border px-4 py-3 text-left transition-colors ${selectedService?.id === s.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
              <div className="flex items-center justify-between"><span className="font-medium text-sm">{s.name}</span><Badge variant="secondary">{s.category || "General"}</Badge></div>
              <p className="mt-1 text-xs text-muted-foreground">{s.duration} min — ${s.price.toLocaleString("es-CO")}</p>
            </button>
          ))}
        </div>
      )}

      {step === "slot" && selectedService && (
        <SlotPicker serviceId={selectedService.id} duration={selectedService.duration} onSelect={(date, time) => { setSelectedDate(date); setSelectedTime(time); setStep("confirm") }} selectedDate={selectedDate} selectedTime={selectedTime} />
      )}

      {step === "confirm" && selectedUser && selectedService && selectedTime && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Cliente</span><span className="text-sm font-medium">{selectedUser.firstName} {selectedUser.lastName}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Servicio</span><span className="text-sm font-medium">{selectedService.name}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Fecha</span><span className="text-sm font-medium">{formatDate(selectedTime)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Hora</span><span className="text-sm font-medium">{formatTime(selectedTime)}</span></div>
            <div className="flex justify-between"><span className="text-sm text-muted-foreground">Duración</span><span className="text-sm font-medium">{selectedService.duration} min</span></div>
            <div className="flex justify-between border-t border-border pt-2"><span className="text-sm font-medium">Precio</span><span className="font-heading text-lg font-semibold">${selectedService.price.toLocaleString("es-CO")}</span></div>
          </div>
          <Button className="w-full" size="lg" onClick={handleCreate} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <>Crear cita<ArrowRight data-slot="icon" data-icon="inline-end" className="size-4" strokeWidth={1.5} /></>}
          </Button>
        </div>
      )}
    </Modal>
  )
}
