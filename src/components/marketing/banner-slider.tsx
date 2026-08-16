"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useReducedMotion } from "@/lib/animations"
import type { Banner } from "@/types/banner"

interface BannerSliderProps {
  banners: Banner[]
  height?: string
}

export function BannerSlider({ banners, height = "h-[420px] md:h-[520px]" }: BannerSliderProps) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (reduced || banners.length <= 1) return
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % banners.length)
    }, 6000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [reduced, banners.length])

  const active = banners[index] || banners[0]
  if (!active) return null

  return (
    <div className={`relative w-full overflow-hidden ${height}`}>
      {banners.map((b, i) => (
        <div
          key={b.id}
          className="absolute inset-0 transition-opacity duration-1000 ease-out"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <img src={b.imageUrl} alt={b.title || "Promoción"} className="size-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />
        </div>
      ))}

      {active && (
        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="max-w-lg">
              {active.title && (
                <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                  {active.title}
                </h2>
              )}
              {active.subtitle && (
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {active.subtitle}
                </p>
              )}
              {active.ctaText && active.ctaLink && (
                <Button
                  className="mt-6"
                  size="lg"
                  nativeButton={false}
                  render={
                    <Link href={active.ctaLink}>
                      {active.ctaText}
                      <ArrowRight data-slot="icon" data-icon="inline-end" className="size-4" strokeWidth={1.5} />
                    </Link>
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {banners.map((b, i) => (
            <button
              key={b.id}
              aria-label={`Ver banner ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40 hover:bg-muted-foreground/70"}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
