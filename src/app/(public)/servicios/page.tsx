import Link from "next/link"
import { ServiceCard } from "@/components/marketing/service-card"
import { services } from "@/lib/services"

export default function ServiciosPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-16 max-w-2xl">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Servicios
          </p>
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
            Todos nuestros
            <br />
            rituales de bienestar
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Cada tratamiento es una experiencia personalizada, guiada por
            profesionales que entienden tu cuerpo y tu momento. Elige el ritual
            que resuene contigo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <ServiceCard key={service.slug} {...service} />
          ))}
        </div>
      </div>
    </section>
  )
}
