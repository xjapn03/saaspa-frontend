import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, Check } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getServiceBySlug } from "@/lib/services"

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: `${service.name} — Kamerinos SPA`,
    description: service.description,
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const service = getServiceBySlug(slug)

  if (!service) notFound()

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
          {service.category}
        </Badge>

        <h1 className="mb-2 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          {service.name}
        </h1>

        <p className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="size-3.5" strokeWidth={1.5} />
          {service.duration}
        </p>

        <Separator className="my-8" />

        <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
          {service.longDescription}
        </p>

        <h2 className="mb-4 font-heading text-xl font-semibold tracking-tight text-foreground">
          Beneficios
        </h2>

        <ul className="mb-10 space-y-3">
          {service.benefits.map((benefit) => (
            <li key={benefit} className="flex items-start gap-3 text-sm text-muted-foreground">
              <Check className="mt-0.5 size-4 shrink-0 text-primary" strokeWidth={2} />
              {benefit}
            </li>
          ))}
        </ul>

        <Separator className="my-8" />

        <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-muted/50 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Inversión
            </p>
            <p className="font-heading text-2xl font-semibold text-foreground">
              {service.price}
            </p>
          </div>
          <Button
            size="lg"
            nativeButton={false}
            render={
              <Link href={`/agendar?service=${service.slug}`}>
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
    </section>
  )
}
