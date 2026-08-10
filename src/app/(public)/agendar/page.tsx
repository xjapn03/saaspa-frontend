"use client"

import { useState, useCallback, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { ServicePicker } from "@/components/booking/service-picker"
import { SlotPicker } from "@/components/booking/slot-picker"
import { DepositSummary } from "@/components/booking/deposit-summary"
import { PaymentWidget } from "@/components/booking/payment-widget"
import { Button } from "@/components/ui/button"
import { servicesApi } from "@/lib/services-api"
import type { Service } from "@/types/service"

type Step = "service" | "slot" | "summary" | "payment"

const STEP_LABELS: Record<Step, string> = {
  service: "Elige tu ritual",
  slot: "Fecha y hora",
  summary: "Resumen",
  payment: "Pago",
}

function AgendarContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedServiceId = searchParams.get("service")

  const [step, setStep] = useState<Step>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [isPreloading, setIsPreloading] = useState(!!preselectedServiceId)

  useEffect(() => {
    if (!preselectedServiceId) {
      setIsPreloading(false)
      return
    }
    servicesApi.listPublic().then((list) => {
      const found = list.find((s) => s.id === preselectedServiceId)
      if (found) {
        setSelectedService(found)
        setStep("slot")
      }
      setIsPreloading(false)
    }).catch(() => {
      setIsPreloading(false)
    })
  }, [preselectedServiceId])

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

  if (isPreloading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

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
            serviceId={selectedService.id}
            startTime={selectedTime}
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

export default function AgendarPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-32">
        <Loader2 className="size-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <AgendarContent />
    </Suspense>
  )
}
