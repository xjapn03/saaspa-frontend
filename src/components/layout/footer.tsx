"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { Phone, MapPin, Camera } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { scrollReveal, useReducedMotion } from "@/lib/animations"
import { SocialLinks } from "@/components/layout/social-links"

const serviceLinks = [
  { href: "/servicios/facial-hidratante-premium", label: "Facial Hidratante Premium" },
  { href: "/servicios/masaje-descontracturante", label: "Masaje Descontracturante" },
  { href: "/servicios/ritual-detox-corporal", label: "Ritual Detox Corporal" },
  { href: "/servicios/limpieza-facial-profunda", label: "Limpieza Facial Profunda" },
]

const companyLinks = [
  { href: "/agendar", label: "Agendar cita" },
  { href: "/servicios", label: "Todos los servicios" },
  { href: "/politicas", label: "Políticas" },
  { href: "/politica-de-privacidad", label: "Política de privacidad" },
  { href: "/terminos-y-condiciones", label: "Términos y condiciones" },
  { href: "/eliminar-datos", label: "Eliminación de datos" },
]

export function Footer() {
  const reduced = useReducedMotion()
  const taglineRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (reduced) return
    scrollReveal(taglineRef.current, { y: 40, duration: 1 })
  }, [reduced])

  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-16 max-w-2xl">
          <p
            ref={taglineRef}
            className="font-heading text-3xl tracking-tight md:text-5xl lg:text-6xl"
          >
            El verdadero bienestar no es lo que compras — es el tiempo que{" "}
            <span className="italic text-primary">inviertes en ti mismo</span>.
          </p>
        </div>

        <Separator className="mb-16 bg-background/10" />

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="mb-3 font-heading text-2xl font-semibold">
              Kamerinos SPA
            </p>
            <p className="text-sm leading-relaxed text-background/60">
              Centro de bienestar y estética en Bogotá. Transformamos cada
              sesión en un ritual de autocuidado, combinando ciencia dérmica
              con ingredientes de grado profesional.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-background/40">
              Enlaces
            </p>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-background/60 transition-colors hover:text-background"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-background/40">
              Contacto
            </p>
            <ul className="space-y-3 text-sm text-background/60">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                <span>Usaquén · Bogotá, Colombia</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                <span>+57 304 1338567</span>
              </li>
              <li className="flex items-start gap-3">
                <Camera className="mt-0.5 size-4 shrink-0" strokeWidth={1.5} />
                <span>@kamerinosspa</span>
              </li>
            </ul>
            <p className="mb-3 mt-6 text-xs font-semibold uppercase tracking-widest text-background/40">
              Síguenos
            </p>
            <SocialLinks tone="light" />
          </div>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-4 px-6 py-6 text-xs text-background/40 sm:flex-row">
          <span>
            &copy; {new Date().getFullYear()} Kamerinos SPA. Todos los derechos
            reservados.
          </span>
          <span>Hecho con cuidado en Bogotá, Colombia</span>
        </div>
      </div>
    </footer>
  )
}
