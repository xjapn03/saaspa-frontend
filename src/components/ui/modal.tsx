"use client"

import type { ReactNode } from "react"
import { useEffect, useRef } from "react"
import gsap from "gsap"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Modal({ open, onOpenChange, title, description, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(panelRef.current, { opacity: 0, y: 24, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: "power3.out" })
    }
    if (open && overlayRef.current) {
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.25 })
    }
  }, [open])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onOpenChange(false) }}
    >
      <div
        ref={panelRef}
        className={`w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card p-6 shadow-2xl ${className ?? ""}`}
      >
        {(title || description) && (
          <div className="mb-6 flex items-start justify-between">
            <div>
              {title && <h3 className="font-heading text-lg font-semibold">{title}</h3>}
              {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
            </div>
            <Button variant="ghost" size="icon-sm" onClick={() => onOpenChange(false)} title="Cerrar">
              <X className="size-4" strokeWidth={1.5} />
            </Button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
