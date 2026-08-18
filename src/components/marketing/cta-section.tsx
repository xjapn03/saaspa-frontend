"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import gsap from "gsap"
import { Button } from "@/components/ui/button"
import { useReducedMotion } from "@/lib/animations"

export function CtaSection() {
  const reduced = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const circle1Ref = useRef<HTMLDivElement>(null)
  const circle2Ref = useRef<HTMLDivElement>(null)
  const waPhone = "573041338567"
  const waMessage = encodeURIComponent("Hola Kamerinos, estuve revisando su sitio web y me gustaría mas información.")

  useEffect(() => {
    if (reduced) return

    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 78%",
            toggleActions: "play none none none",
          },
        }
      )
    }

    if (circle1Ref.current) {
      gsap.to(circle1Ref.current, {
        y: -20,
        x: 20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      })
    }

    if (circle2Ref.current) {
      gsap.to(circle2Ref.current, {
        y: 20,
        x: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      })
    }
  }, [reduced])

  return (
    <section ref={sectionRef} className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-24">
          <div
            ref={circle1Ref}
            className="absolute -right-20 -top-20 size-80 rounded-full bg-background/10"
          />
          <div
            ref={circle2Ref}
            className="absolute -bottom-10 -left-10 size-48 rounded-full bg-background/10"
          />

          <div ref={contentRef} className="relative max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] opacity-70">
              Tu primera experiencia
            </p>
            <h2 className="mb-6 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
              El cuidado que mereces
              <br />
              te está esperando
            </h2>
            <p className="mb-10 max-w-lg text-primary-foreground/80 leading-relaxed">
              Reserva tu ritual y regálate una pausa de bienestar en el corazón
              de Teusaquillo. El primer paso es el más sencillo.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                nativeButton={false}
                className="bg-background text-foreground hover:bg-background/90"
                render={
                  <Link href="/agendar">
                    Agendar ahora
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
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                render={
                  <Link
                    href={`https://wa.me/${waPhone}?text=${waMessage}`}
                    target="_blank"
                  >
                    <MessageCircle
                      data-slot="icon"
                      data-icon="inline-start"
                      className="size-4"
                      strokeWidth={1.5}
                    />
                    Hablar por WhatsApp
                  </Link>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
