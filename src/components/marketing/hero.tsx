"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useReducedMotion } from "@/lib/animations"

const quickFacts = [
  { label: "Experiencias desde", value: "$ 120.000" },
  { label: "Duración típica", value: "1h — 2h30" },
  { label: "Ubicación", value: "Bogotá · Usaquén" },
]

export function Hero({ portraitImage }: { portraitImage?: string }) {
  const reduced = useReducedMotion()
  const labelRef = useRef<HTMLParagraphElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const bodyRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const factsRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  const imageSrc = portraitImage || "/hero-portrait.webp"

  useEffect(() => {
    if (reduced) return
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } })

    if (labelRef.current)
      tl.fromTo(labelRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0)
    if (headingRef.current)
      tl.fromTo(headingRef.current, { opacity: 0, y: 24 }, { opacity: 1, y: 0 }, 0.1)
    if (bodyRef.current)
      tl.fromTo(bodyRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.25)
    if (ctasRef.current)
      tl.fromTo(ctasRef.current, { opacity: 0, y: 16 }, { opacity: 1, y: 0 }, 0.4)
    if (factsRef.current)
      tl.fromTo(factsRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0 }, 0.55)
    if (cardRef.current)
      tl.fromTo(cardRef.current, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1 }, 0.35)

    return () => { tl.kill() }
  }, [reduced])

  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-accent/10" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-24 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p
            ref={labelRef}
            className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground"
          >
            Bienestar &amp; Estética · Bogotá
          </p>

          <h1
            ref={headingRef}
            className="mb-8 font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Donde el cuidado
            <br />
            se convierte en ritual
          </h1>

          <p
            ref={bodyRef}
            className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty"
          >
            En Kamerinos by Sandra Pinzon transformamos cada sesión en una pausa consciente
            de autocuidado. Ciencia dérmica, ingredientes de grado profesional y
            un enfoque cálido que te hace sentir en casa.
          </p>

          <div ref={ctasRef} className="flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href="/agendar">
                  Agendar ritual
                  <ArrowRight
                    data-slot="icon"
                    data-icon="inline-end"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </Link>
              }
            />
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/servicios">Conocer servicios</Link>}
            />
          </div>

          <div ref={factsRef} className="mt-16 flex flex-wrap gap-8 border-t border-border pt-8 sm:gap-12">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {fact.label}
                </p>
                <p className="font-heading text-2xl font-medium text-foreground">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div ref={cardRef} className="mt-12 lg:col-span-5 lg:mt-0">
          <div
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-[2rem]",
              "bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/40",
              "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
            )}
          >
            <div className="absolute inset-0">
              <img
                src={imageSrc}
                alt="Kamerinos by Sandra Pinzon"
                className="absolute inset-0 size-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
