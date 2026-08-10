import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Service } from "@/types/service"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_BASE}/api/services/public`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

async function getServiceById(id: string): Promise<Service | null> {
  const services = await getServices()
  return services.find((s) => s.id === id) || null
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getServiceById(slug)
  if (!service) return { title: "Servicio no encontrado" }
  return {
    title: `${service.name} — Kamerinos SPA`,
    description: service.description || "",
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceById(slug)

  if (!service) notFound()

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/servicios"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-3 rotate-180" strokeWidth={1.5} />
          Todos los servicios
        </Link>

        <Badge variant="secondary" className="mb-4">
          {service.category || "General"}
        </Badge>

        <h1 className="mb-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {service.name}
        </h1>

        <p className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5" strokeWidth={1.5} />
          {service.duration} min
        </p>

        <Separator className="my-8" />

        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          {service.description ||
            "Un tratamiento personalizado diseñado para tu bienestar, guiado por profesionales que entienden tu cuerpo y tu momento."}
        </p>

        <div className="mb-10">
          <Separator className="my-8" />

          <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-muted/50 p-6">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                Inversión
              </p>
              <p className="font-heading text-2xl font-semibold text-foreground">
                {formatPrice(service.price)}
              </p>
            </div>
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href={`/agendar?service=${service.id}`}>
                  Agendar este ritual
                  <ArrowRight
                    data-slot="icon"
                    data-icon="inline-end"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </Link>
              }
            />
          </div>
        </div>
      </div>
    </section>
  )
}
