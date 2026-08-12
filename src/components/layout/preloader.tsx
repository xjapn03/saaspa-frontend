"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"

function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

const PRELOADER_KEY = "kamerinos_preloader_shown"

export function Preloader({ children }: { children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(true)
  const [isExiting, setIsExiting] = useState(false)
  const curtainRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const alreadyShown = sessionStorage.getItem(PRELOADER_KEY)

    if (alreadyShown || reducedMotion) {
      setIsVisible(false)
      setIsExiting(false)
      sessionStorage.setItem(PRELOADER_KEY, "1")
      return
    }

    const timer = setTimeout(() => {
      setIsExiting(true)
      sessionStorage.setItem(PRELOADER_KEY, "1")

      if (logoRef.current && !reducedMotion) {
        gsap.to(logoRef.current, {
          opacity: 0,
          y: -24,
          duration: 0.6,
          ease: "power3.in",
        })
      }

      if (curtainRef.current && !reducedMotion) {
        gsap.to(curtainRef.current, {
          y: "-100%",
          duration: 1,
          ease: "power4.inOut",
          onComplete: () => setIsVisible(false),
        })
      } else {
        setTimeout(() => setIsVisible(false), 1000)
      }
    }, 600)

    return () => clearTimeout(timer)
  }, [reducedMotion])

  if (!isVisible) return <>{children}</>

  return (
    <>
      <div
        className={`fixed inset-0 z-[200] flex flex-col items-center justify-center bg-background transition-opacity duration-700 ${isExiting ? "opacity-0" : "opacity-100"} ${isExiting ? "pointer-events-none" : ""}`}
        aria-hidden={isExiting}
      >
        <div ref={logoRef} className="text-center">
          <p className="font-heading text-3xl font-semibold tracking-tight text-foreground">
            Kamerinos
          </p>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Bienestar & Estética
          </p>
        </div>

        <div className="mt-8 flex gap-1.5">
          <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:0ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
          <span className="size-1.5 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
        </div>
      </div>

      <div
        ref={curtainRef}
        className={`fixed inset-0 z-[190] bg-background transition-transform duration-1000 ${isExiting ? "-translate-y-full" : "translate-y-0"}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.76, 0, 0.24, 1)" }}
      />

      {children}
    </>
  )
}
