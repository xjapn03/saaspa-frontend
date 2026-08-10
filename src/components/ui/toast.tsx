"use client"

import { useEffect, useRef, type ReactNode } from "react"
import gsap from "gsap"
import { X, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

export type ToastType = "success" | "error" | "info"

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

const iconMap: Record<ToastType, ReactNode> = {
  success: <CheckCircle className="size-4 text-green-600" strokeWidth={1.5} />,
  error: <AlertCircle className="size-4 text-destructive" strokeWidth={1.5} />,
  info: <Info className="size-4 text-primary" strokeWidth={1.5} />,
}

const bgMap: Record<ToastType, string> = {
  success: "border-green-200 bg-green-50 dark:bg-green-950/30",
  error: "border-destructive/30 bg-destructive/5",
  info: "border-primary/30 bg-primary/5",
}

export function Toast({ message, type = "error", onClose, duration = 5000 }: ToastProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    gsap.fromTo(ref.current, { opacity: 0, y: -16, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" })

    if (duration > 0) {
      const timer = setTimeout(() => {
        gsap.to(ref.current, { opacity: 0, y: -12, duration: 0.25, ease: "power2.in", onComplete: onClose })
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  return (
    <div
      ref={ref}
      className={cn(
        "fixed top-6 left-1/2 z-[100] -translate-x-1/2",
        "flex items-center gap-3 rounded-2xl border px-5 py-3.5 shadow-lg backdrop-blur",
        "max-w-sm w-[calc(100%-2rem)] text-sm",
        bgMap[type]
      )}
    >
      {iconMap[type]}
      <span className="flex-1 text-foreground">{message}</span>
      <button onClick={onClose} className="shrink-0 text-muted-foreground hover:text-foreground transition-colors">
        <X className="size-3.5" strokeWidth={1.5} />
      </button>
    </div>
  )
}

export function toastEmitter(message: string, type: ToastType = "error") {
  const e = eventBus
  if (e) e.emit({ message, type })
}

class ToastBus {
  private listeners: Array<(t: { message: string; type: ToastType }) => void> = []
  emit(toast: { message: string; type: ToastType }) { this.listeners.forEach(fn => fn(toast)) }
  subscribe(fn: (t: { message: string; type: ToastType }) => void) { this.listeners.push(fn); return () => { this.listeners = this.listeners.filter(f => f !== fn) } }
}

const eventBus = typeof window !== "undefined" ? new ToastBus() : null

export { eventBus }
