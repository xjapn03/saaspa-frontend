"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ServicePicker } from "@/components/booking/service-picker"
import { SlotPicker } from "@/components/booking/slot-picker"
import { DepositSummary } from "@/components/booking/deposit-summary"
import { PaymentWidget } from "@/components/booking/payment-widget"
import { Button } from "@/components/ui/button"
import type { Service } from "@/types/service"

type Step = "service" | "slot" | "summary" | "payment"

const STEP_LABELS: Record<Step, string> = {
  service: "Elige tu ritual",
  slot: "Fecha y hora",
  summary: "Resumen",
  payment: "Pago",
}

export default function AgendarPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")

  const steps: Step[] = ["service", "slot", "summary", "payment"]
  const currentIdx = steps.indexOf(step)

  const handleServiceSelect = useCallback((svc: Service) => {
    setSelectedService(svc)
    setSelectedDate("")
    setSelectedTime("")
    setStep("slot")
  }, [])

  const handleSlotSelect = useCallback((date: string, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setStep("summary")
  }, [])

  const handlePaymentComplete = useCallback(() => {
    router.push("/dashboard/citas")
  }, [router])

  const deposit = selectedService ? Math.round(selectedService.price * 0.3) : 0

  return (
    <section className="pt-28 pb-24 md:pt-36 md:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-8">
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Paso {currentIdx + 1} de {steps.length}
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {STEP_LABELS[step]}
          </h1>
        </div>

        <div className="mb-8 flex gap-2">
          {steps.map((s, i) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i <= currentIdx ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {step === "service" && (
          <ServicePicker
            onSelect={handleServiceSelect}
            selectedId={selectedService?.id}
          />
        )}

        {step === "slot" && selectedService && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => setStep("service")}
            >
              ← Cambiar servicio
            </Button>
            <SlotPicker
              serviceId={selectedService.id}
              duration={selectedService.duration}
              onSelect={handleSlotSelect}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
            />
          </div>
        )}

        {step === "summary" && selectedService && selectedDate && selectedTime && (
          <div>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={() => setStep("slot")}
            >
              ← Cambiar horario
            </Button>
            <DepositSummary
              service={selectedService}
              date={selectedDate}
              time={selectedTime}
            />
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setStep("slot")}
              >
                Volver
              </Button>
              <Button
                className="flex-1"
                size="lg"
                onClick={() => setStep("payment")}
              >
                Ir a pagar
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && selectedService && (
          <PaymentWidget
            serviceName={selectedService.name}
            depositAmount={deposit}
            onPaymentComplete={handlePaymentComplete}
            onCancel={() => setStep("summary")}
          />
        )}
      </div>
    </section>
  )
}
