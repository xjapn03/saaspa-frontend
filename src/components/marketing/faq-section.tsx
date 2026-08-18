"use client"

import { useState } from "react"
import {
  HelpCircle,
  ChevronDown,
  Calendar,
  BadgePercent,
  CalendarClock,
  CreditCard,
  Truck,
  MessageCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    icon: Calendar,
    q: "¿Cómo agendo una cita?",
    a: "Elige el servicio en la sección Servicios, selecciona la fecha y hora disponibles, y completa el abono del 30% con nuestra pasarela de pago segura. Al confirmar, recibirás un correo con tu comprobante y los detalles de tu cita.",
  },
  {
    icon: BadgePercent,
    q: "¿Qué es el abono del 30%?",
    a: "Para confirmar tu cita se reserva el 30% del valor del servicio. El 70% restante lo pagas el día de tu cita en el spa (tarjeta, PSE, Nequi o efectivo). El abono asegura tu horario y el de nuestra terapeuta.",
  },
  {
    icon: CalendarClock,
    q: "¿Puedo reagendar o cancelar mi cita?",
    a: "Sí. Puedes reagendar sin costo hasta 24 horas antes. Las cancelaciones con menos de 24 horas o la inasistencia implican la pérdida del abono, para respetar el tiempo de nuestras profesionales y de otras clientas.",
  },
  {
    icon: CreditCard,
    q: "¿Qué métodos de pago aceptan?",
    a: "Aceptamos PSE, Nequi y tarjetas de crédito y débito a través de la pasarela Wompi, tanto para el abono como para el saldo. En el local también aceptamos efectivo.",
  },
  {
    icon: Truck,
    q: "¿Hacen envíos de los productos del shop?",
    a: "Sí. Los productos del shop se envían a tu dirección. Al hacer el pedido verás el costo de envío en el checkout y podrás seguir el estado desde tu panel (Mis pedidos).",
  },
  {
    icon: MessageCircle,
    q: "¿Puedo agendar por WhatsApp?",
    a: "¡Claro! Escríbenos al WhatsApp que aparece en la página (icono flotante o en el footer) y con gusto te asesoramos sobre disponibilidad, dudas de servicios o recomendaciones de productos.",
  },
]

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className="mt-16">
      <div className="mb-8 flex items-center gap-3">
        <HelpCircle className="size-6 text-primary" strokeWidth={1.5} />
        <h2 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
          Preguntas frecuentes
        </h2>
      </div>

      <div className="space-y-3">
        {faqs.map((item, i) => {
          const isOpen = open === i
          return (
            <div
              key={i}
              className={cn(
                "overflow-hidden rounded-2xl border transition-colors duration-300",
                isOpen ? "border-primary/40 bg-card" : "border-border bg-card/60 hover:border-primary/20"
              )}
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center gap-3 px-5 py-4 text-left"
                aria-expanded={isOpen}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="size-4" strokeWidth={1.5} />
                </span>
                <span className="flex-1 font-medium text-foreground">{item.q}</span>
                <ChevronDown
                  className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-300", isOpen && "rotate-180")}
                  strokeWidth={1.5}
                />
              </button>
              <div
                className={cn(
                  "grid transition-all duration-300 ease-out",
                  isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                )}
              >
                <div className="overflow-hidden">
                  <p className="px-5 pb-5 pl-[68px] text-sm leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
