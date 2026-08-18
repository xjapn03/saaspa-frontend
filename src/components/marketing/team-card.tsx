"use client"

import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    name: "Sandra Pinzón",
    initials: "SP",
    image: "/SandraPinzon.jpg",
    role: "Profesional de la Salud",
    credentials: "Enfermera Jefe y Esteticista · 18 años de experiencia",
    bio: "Especialista en terapias alternativas y estética integral. En Kamerinos combino mi formación clínica con técnicas innovadoras para ofrecer un cuidado personalizado, enfocado en salud, belleza y bienestar integral.",
  },
]

interface TeamCardProps {
  name: string
  initials: string
  image?: string
  role: string
  credentials: string
  bio: string
  className?: string
}

function TeamCard({
  name,
  initials,
  image,
  role,
  credentials,
  bio,
  className,
}: TeamCardProps) {
  return (
    <Card className={cn("text-center", className)}>
      <CardHeader className="items-center">
        <CardTitle className="font-heading text-lg font-semibold">
          {name}
        </CardTitle>
        <CardDescription className="font-medium text-primary">
          {role}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <Avatar size="xl" className="mb-6">
          {image && <AvatarImage src={image} alt={name} className="object-cover" />}
          <AvatarFallback className="bg-primary/10 font-heading text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
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

        <div ref={gridRef} className="grid justify-items-center gap-8 md:grid-cols-1">
          {teamMembers.map((member) => (
            <TeamCard key={member.name} {...member} className="team-card w-full max-w-2xl" />
          ))}
        </div>
      </div>
    </section>
  )
}
