"use client"

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { contactOrLead } from "@/lib/meta-pixel"

export function WhatsAppFloatButton() {
  const ref = useRef<HTMLAnchorElement>(null)
  const phone = "573041338567"
  const message = encodeURIComponent("Hola Kamerinos, estuve revisando su sitio web y me gustaría mas información.")

  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const tl = gsap.timeline({ repeat: -1, yoyo: true, repeatDelay: 0.5 })
    tl.to(el, { y: -6, duration: 2.5, ease: "sine.inOut" })
    tl.to(el, { y: 0, duration: 2.5, ease: "sine.inOut" }, "+=0.5")
    return () => { tl.kill() }
  }, [])

  return (
    <a
      ref={ref}
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Agendar por WhatsApp"
      onClick={() => contactOrLead({ contentName: "WhatsApp flotante" })}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "flex size-14 items-center justify-center",
        "rounded-full bg-[#25D366] text-white shadow-lg",
        "transition-all duration-300",
        "hover:scale-110 hover:shadow-xl",
        "sm:size-16"
      )}
    >
      <MessageCircle className="size-6 sm:size-7" strokeWidth={1.5} />
    </a>
  )
}
