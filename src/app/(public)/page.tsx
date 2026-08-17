import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Hero } from "@/components/marketing/hero"
import { PhilosophyPillars } from "@/components/marketing/philosophy-pillars"
import { ServiceCard } from "@/components/marketing/service-card"
import { TeamSection } from "@/components/marketing/team-card"
import { TestimonialsSection } from "@/components/marketing/testimonial-card"
import { CtaSection } from "@/components/marketing/cta-section"
import { FeaturedProducts } from "@/components/marketing/featured-products"
import { BannerSlider } from "@/components/marketing/banner-slider"
import { AnimatedGrid } from "@/components/layout/animated-grid"
import type { Service } from "@/types/service"
import type { Banner } from "@/types/banner"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_BASE}/api/services/public`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const { data } = await res.json()
    return data
  } catch {
    return []
  }
}

async function getBanners(position: string): Promise<Banner[]> {
  try {
    const res = await fetch(`${API_BASE}/api/banners/public?position=${position}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export default async function Home() {
  const services = await getServices()
  const heroBanners = await getBanners("HERO")
  const stripBanners = await getBanners("STRIP")
  const portraitBanners = await getBanners("PORTRAIT")

  const featuredServices = services.filter((s) => s.isFeatured).slice(0, 6)

  return (
    <>
      {heroBanners.length > 0 && (
        <div className="pt-24">
          <BannerSlider banners={heroBanners} />
        </div>
      )}

      <Hero portraitImage={portraitBanners[0]?.imageUrl} />

      <PhilosophyPillars />

      <section className="py-24 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-16 flex items-end justify-between flex-wrap gap-6">
            <div className="max-w-2xl">
              <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Nuestros rituales
              </p>
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
                Experiencias diseñadas
                <br />
                para tu bienestar
              </h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              nativeButton={false}
              render={<Link href="/servicios">Ver servicios <ArrowRight className="ml-1 size-4" /></Link>}
            />
          </div>

          {featuredServices.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <p className="text-sm text-muted-foreground">
                Cargando servicios...
              </p>
            </div>
          ) : (
            <AnimatedGrid className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {featuredServices.map((svc) => (
                <div key={svc.id} className="grid-card">
                  <ServiceCard
                    name={svc.name}
                    slug={svc.slug}
                    category={svc.categoryRel?.name || "General"}
                    duration={`${svc.duration} min`}
                    description={svc.description || ""}
                    image={svc.mainImage || svc.imageUrl}
                    isFeatured={svc.isFeatured}
                    price={new Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                      minimumFractionDigits: 0,
                    }).format(svc.price)}
                    compareAtPrice={
                      svc.compareAtPrice && svc.compareAtPrice > svc.price
                        ? new Intl.NumberFormat("es-CO", {
                            style: "currency",
                            currency: "COP",
                            minimumFractionDigits: 0,
                          }).format(svc.compareAtPrice)
                        : undefined
                    }
                  />
                </div>
              ))}
            </AnimatedGrid>
          )}
        </div>
      </section>

      {stripBanners.length > 0 && (
        <section className="py-16">
          <BannerSlider banners={stripBanners} height="h-[240px] md:h-[300px]" />
        </section>
      )}

      <FeaturedProducts />

      <TeamSection />

      <TestimonialsSection />

      <CtaSection />
    </>
  )
}
