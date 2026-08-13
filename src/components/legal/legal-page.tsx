"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { fadeInUp, scrollRevealStagger, useReducedMotion } from "@/lib/animations"

export interface LegalSection {
  title: string
  body: ReactNode
}

interface LegalPageProps {
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
  updatedAt?: string
  footer?: ReactNode
}

export function LegalPage({
  eyebrow,
  title,
  intro,
  sections,
  updatedAt,
  footer,
}: LegalPageProps) {
  const reduced = useReducedMotion()
  const headerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLParagraphElement>(null)
  const sectionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    fadeInUp(headerRef.current, { y: 24, duration: 0.9 })
    fadeInUp(introRef.current, { y: 24, duration: 0.9, delay: 0.1 })
    scrollRevealStagger(sectionsRef.current, ".legal-section", {
      stagger: 0.12,
      y: 28,
      start: "top 85%",
    })
  }, [reduced])

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <div ref={headerRef}>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            {title}
          </h1>
        </div>

        <p ref={introRef} className="mb-12 text-sm leading-relaxed text-muted-foreground">
          {intro}
        </p>

        <Separator className="mb-12" />

        <div ref={sectionsRef} className="space-y-12">
          {sections.map((section, i) => (
            <div key={i} className="legal-section">
              <h2 className="mb-3 font-heading text-xl font-semibold tracking-tight text-foreground">
                {section.title}
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                {section.body}
              </div>
            </div>
          ))}
        </div>

        {updatedAt && (
          <>
            <Separator className="my-12" />
            <p className="text-xs text-muted-foreground">
              Última actualización: {updatedAt}
            </p>
          </>
        )}

        {footer && (
          <>
            <Separator className="my-12" />
            <div className="text-center">{footer}</div>
          </>
        )}
      </div>
    </section>
  )
}
