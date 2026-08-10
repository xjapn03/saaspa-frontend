"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { scrollRevealStagger, useReducedMotion } from "@/lib/animations"

const teamMembers = [
  {
    name: "Carolina Méndez",
    initials: "CM",
    role: "Cosmetóloga Senior",
    credentials: "Especialista en dermatología estética · 12 años de experiencia",
    bio: "Formada en Buenos Aires y Barcelona, Carolina lidera nuestro equipo de faciales con un enfoque que combina precisión clínica y sensibilidad artesanal.",
  },
  {
    name: "Alejandra Ríos",
    initials: "AR",
    role: "Terapeuta Corporal",
    credentials: "Fisioterapeuta · Certificada en drenaje linfático",
    bio: "Sus manos leen el cuerpo como nadie. Alejandra convierte cada masaje en una experiencia transformadora, guiada por años de estudio en técnicas orientales y occidentales.",
  },
  {
    name: "Daniela Vargas",
    initials: "DV",
    role: "Especialista Capilar",
    credentials: "Tricóloga · Certificada en terapias de regeneración",
    bio: "Apasionada por la salud del cuero cabelludo, Daniela trajo a Kamerinos los protocolos de nutrición capilar más avanzados del mercado.",
  },
]

interface TeamCardProps {
  name: string
  initials: string
  role: string
  credentials: string
  bio: string
  className?: string
}

function TeamCard({
  name,
  initials,
  role,
  credentials,
  bio,
  className,
}: TeamCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardHeader className="items-center">
        <Avatar size="lg" className="mb-3">
          <AvatarFallback className="bg-primary/10 font-heading text-xl text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <CardTitle className="font-heading text-lg font-semibold">
          {name}
        </CardTitle>
        <CardDescription className="font-medium text-primary">
          {role}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
          {credentials}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {bio}
        </p>
      </CardContent>
    </Card>
  )
}

export function TeamSection() {
  const reduced = useReducedMotion()
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced) return
    scrollRevealStagger(gridRef.current, ".team-card", { stagger: 0.15, y: 32 })
  }, [reduced])

  return (
    <section className="py-24 md:py-32 bg-muted/30">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Nuestro equipo
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Las manos que cuidan
            <br />
            de tu bienestar
          </h2>
        </div>

        <div ref={gridRef} className="grid gap-8 md:grid-cols-3">
          {teamMembers.map((member) => (
            <TeamCard key={member.name} {...member} className="team-card" />
          ))}
        </div>
      </div>
    </section>
  )
}
