import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

try {
  gsap.registerPlugin(ScrollTrigger)
} catch { /* SSR / test environment — ScrollTrigger not available */ }

export function useReducedMotion(): boolean {
  if (typeof window === "undefined") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function shouldAnimate(): boolean {
  if (typeof window === "undefined") return false
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function fadeInUp(
  element: HTMLElement | null,
  options?: { delay?: number; duration?: number; y?: number; ease?: string }
) {
  if (!element || !shouldAnimate()) return
  gsap.fromTo(
    element,
    { opacity: 0, y: options?.y ?? 30 },
    {
      opacity: 1,
      y: 0,
      delay: options?.delay ?? 0,
      duration: options?.duration ?? 0.9,
      ease: options?.ease ?? "power3.out",
    }
  )
}

export function fadeInStagger(
  container: HTMLElement | null,
  children: string | HTMLElement[],
  options?: { stagger?: number; duration?: number; y?: number }
) {
  if (!container || !shouldAnimate()) return
  const targets = typeof children === "string"
    ? container.querySelectorAll(children)
    : children
  gsap.fromTo(
    targets,
    {
      opacity: 0,
      y: options?.y ?? 30,
    },
    {
      opacity: 1,
      y: 0,
      stagger: options?.stagger ?? 0.12,
      duration: options?.duration ?? 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  )
}

export function scrollReveal(
  element: HTMLElement | null,
  options?: { y?: number; duration?: number }
) {
  if (!element || !shouldAnimate()) return
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: options?.y ?? 30,
    },
    {
      opacity: 1,
      y: 0,
      duration: options?.duration ?? 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    }
  )
}

export function scrollRevealStagger(
  container: HTMLElement | null,
  childSelector: string,
  options?: { stagger?: number; duration?: number; y?: number; start?: string }
) {
  if (!container || !shouldAnimate()) return
  gsap.fromTo(
    container.querySelectorAll(childSelector),
    {
      opacity: 0,
      y: options?.y ?? 30,
    },
    {
      opacity: 1,
      y: 0,
      stagger: options?.stagger ?? 0.12,
      duration: options?.duration ?? 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: container,
        start: options?.start ?? "top 85%",
        toggleActions: "play none none none",
      },
    }
  )
}

export function useScrollReveal<T extends HTMLElement>(
  options?: { y?: number; duration?: number }
) {
  const ref = useRef<T>(null)
  useEffect(() => {
    if (!ref.current) return
    scrollReveal(ref.current, options)
  }, [options])
  return ref
}

export function countUp(
  element: HTMLElement | null,
  target: number,
  options?: { duration?: number; prefix?: string; suffix?: string }
) {
  if (!element || !shouldAnimate()) {
    if (element) element.textContent = `${options?.prefix ?? ""}${target}${options?.suffix ?? ""}`
    return
  }
  const obj = { value: 0 }
  gsap.to(obj, {
    value: target,
    duration: options?.duration ?? 1.5,
    ease: "power2.out",
    onUpdate: () => {
      element.textContent = `${options?.prefix ?? ""}${Math.round(obj.value)}${options?.suffix ?? ""}`
    },
  })
}
