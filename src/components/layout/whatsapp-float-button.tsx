"use client"

import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export function WhatsAppFloatButton() {
  const phone = "573041338567"
  const message = encodeURIComponent("Hola, quiero agendar una cita")

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar por WhatsApp"
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex size-14 items-center justify-center",
        "rounded-full bg-[#25D366] text-white shadow-lg",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl",
        "motion-safe:animate-pulse",
        "sm:size-16"
      )}
    >
      <MessageCircle className="size-6 sm:size-7" strokeWidth={1.5} />
    </a>
  )
}
