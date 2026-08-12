import { ServiceCard } from "@/components/marketing/service-card"
import { AnimatedGrid } from "@/components/layout/animated-grid"
import type { Service } from "@/types/service"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Descubre nuestros tratamientos de bienestar y estética: faciales, corporales, capilares, masajes terapéuticos y más en Bogotá.",
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default async function ServiciosPage() {
  let services: Service[] = []

  try {
    const res = await fetch(`${API_BASE}/api/services/public`, {
      next: { revalidate: 60 },
    })
    if (res.ok) {
      const { data } = await res.json()
      services = data
    }
  } catch {
    // fallback to empty list
  }

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

        {services.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-12 text-center">
            <p className="text-sm text-muted-foreground">
              No hay servicios disponibles en este momento.
            </p>
          </div>
        ) : (
          <AnimatedGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((svc) => (
              <div key={svc.id} className="grid-card">
                <ServiceCard
                  name={svc.name}
                  slug={svc.id}
                  category={svc.category || "General"}
                  duration={`${svc.duration} min`}
                  description={svc.description || ""}
                  price={new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    minimumFractionDigits: 0,
                  }).format(svc.price)}
                />
              </div>
            ))}
          </AnimatedGrid>
        )}
      </div>
    </section>
  )
}
