"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { scrollRevealStagger, useReducedMotion } from "@/lib/animations"

interface AnimatedGridProps {
  children: ReactNode
  className?: string
  childSelector?: string
  stagger?: number
}

export function AnimatedGrid({
  children,
  className,
  childSelector = ".grid-card",
  stagger = 0.12,
}: AnimatedGridProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    scrollRevealStagger(ref.current, childSelector, { stagger, y: 28 })
  }, [reduced, childSelector, stagger])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
