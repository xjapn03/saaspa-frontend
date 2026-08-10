import { Hero } from "@/components/marketing/hero"
import { PhilosophyPillars } from "@/components/marketing/philosophy-pillars"
import { ServiceCard } from "@/components/marketing/service-card"
import { TeamSection } from "@/components/marketing/team-card"
import { TestimonialsSection } from "@/components/marketing/testimonial-card"
import { CtaSection } from "@/components/marketing/cta-section"
import { services } from "@/lib/services"
import { Separator } from "@/components/ui/separator"

export default function Home() {
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

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <ServiceCard key={service.slug} {...service} />
            ))}
          </div>
        </div>
      </section>

      <TeamSection />

      <TestimonialsSection />

      <CtaSection />
    </>
  )
}
