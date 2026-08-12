"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import gsap from "gsap"
import { Heart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const TIPS = [
  "Hidrátate: bebe al menos 2L de agua al día para mantener tu piel radiante.",
  "Protección solar: usa SPF 30+ incluso en días nublados.",
  "Rutina nocturna: limpia tu rostro antes de dormir, siempre.",
  "Exfoliación: 1-2 veces por semana, no más, para no irritar la piel.",
  "Duerme bien: 7-8 horas de sueño reparador rejuvenecen tu piel.",
  "Alimentación: incluye frutas y verduras ricas en antioxidantes.",
  "Ejercicio: 30 minutos diarios mejoran la circulación y tu piel.",
  "Agua termal: un spray refrescante fija el maquillaje e hidrata.",
  "No toques tu rostro: evita transferir bacterias de las manos.",
  "Cambia tu funda de almohada cada semana para evitar imperfecciones.",
  "Masajea tu rostro al aplicar cremas: activa la circulación.",
  "Desmaquíllate siempre: dormir con maquillaje obstruye los poros.",
  "Paciencia: los tratamientos necesitan constancia para ver resultados.",
  "Consulta con profesionales: solo ellos conocen tu tipo de piel.",
  "Lee las etiquetas: evita productos con alcohol o fragancias agresivas.",
  "Agenda tus citas con anticipación para mantener tu rutina de cuidado.",
  "La constancia es clave: un buen skincare necesita al menos 28 días.",
  "Evita el estrés: practica respiración profunda, tu piel lo agradece.",
]

function shouldAnimate(): boolean {
  if (typeof window === "undefined") return false
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

export function TipsCard({ className }: { className?: string }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * TIPS.length))
  const textRef = useRef<HTMLParagraphElement>(null)

  const rotateTip = useCallback(() => {
    setIndex((prev) => (prev + 1) % TIPS.length)
  }, [])

  useEffect(() => {
    const interval = setInterval(rotateTip, 10000)
    return () => clearInterval(interval)
  }, [rotateTip])

  useEffect(() => {
    if (!textRef.current || !shouldAnimate()) return
    gsap.fromTo(
      textRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
    )
  }, [index])

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">Consejo de bienestar</CardTitle>
        <Heart className="size-4 text-muted-foreground" strokeWidth={1.5} />
      </CardHeader>
      <CardContent>
        <p ref={textRef} className="min-h-[4.5rem] text-sm leading-relaxed text-foreground">
          {TIPS[index]}
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Tip {index + 1} de {TIPS.length} · Cambia cada 10 segundos
        </p>
      </CardContent>
    </Card>
  )
}
