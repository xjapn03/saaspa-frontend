import { Hero } from "@/components/marketing/hero"
import { PhilosophyPillars } from "@/components/marketing/philosophy-pillars"
import { ServiceCard } from "@/components/marketing/service-card"
import { TeamSection } from "@/components/marketing/team-card"
import { TestimonialsSection } from "@/components/marketing/testimonial-card"
import { CtaSection } from "@/components/marketing/cta-section"
import { AnimatedGrid } from "@/components/layout/animated-grid"
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

export default async function Home() {
  const services = await getServices()

  return (
    <>
      <Hero />

      <PhilosophyPillars />

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Nuestros rituales
            </p>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Experiencias diseñadas
              <br />
              para tu bienestar
            </h2>
          </div>

          {services.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Cargando servicios...
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

      <TeamSection />

      <TestimonialsSection />

      <CtaSection />
    </>
  )
}
