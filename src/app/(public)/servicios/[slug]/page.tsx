import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Clock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ProductGallery } from "@/components/shop/product-gallery"
import { MetaViewContent } from "@/components/common/meta-view-content"
import type { Service } from "@/types/service"
import { absoluteUrl } from "@/lib/seo"
import { JsonLdScript } from "@/components/common/json-ld-script"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

async function getServiceBySlug(slug: string): Promise<Service | null> {
  try {
    const res = await fetch(`${API_BASE}/api/services/public/${encodeURIComponent(slug)}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)
  if (!service) return { title: "Servicio no encontrado" }
  const url = absoluteUrl(`/servicios/${slug}`)
  return {
    title: `${service.name} — Kamerinos by Sandra Pinzon`,
    description: service.description || "",
    alternates: { canonical: url },
    openGraph: {
      title: service.name,
      description: service.description || "",
      url,
      images: service.mainImage ? [{ url: service.mainImage }] : [],
    },
  }
}

export default async function ServicioDetallePage({ params }: Props) {
  const { slug } = await params
  const service = await getServiceBySlug(slug)

  if (!service) notFound()

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  const allImages = [
    service.mainImage,
    ...(service.carouselImages || []),
  ].filter(Boolean) as string[]

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <JsonLdScript data={{
        "@context": "https://schema.org",
        "@type": "Service",
        name: service.name,
        description: service.description || undefined,
        image: service.mainImage || undefined,
        url: absoluteUrl(`/servicios/${service.slug}`),
        provider: {
          "@type": "HealthAndBeautyBusiness",
          name: "Kamerinos by Sandra Pinzon",
          url: SITE_URL,
        },
        areaServed: { "@type": "Place", name: "Bogotá, Colombia" },
        offers: {
          "@type": "Offer",
          price: service.price,
          priceCurrency: "COP",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/servicios/${service.slug}`),
        },
      }} />
      <JsonLdScript data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Servicios", item: `${SITE_URL}/servicios` },
          { "@type": "ListItem", position: 3, name: service.name },
        ],
      }} />
      <MetaViewContent
        contentName={service.name}
        contentCategory={service.categoryRel?.name || "General"}
        contentType="service"
        value={service.price}
      />
      <div className="mx-auto max-w-6xl px-6">
        <Link
          href="/servicios"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowRight className="size-3 rotate-180" strokeWidth={1.5} />
          Todos los servicios
        </Link>

        <div className="grid gap-10 md:grid-cols-2 md:items-start">
          <div>
            {allImages.length > 0 ? (
              <ProductGallery
                mainImage={service.mainImage}
                carouselImages={service.carouselImages}
                productName={service.name}
              />
            ) : (
              <div className="flex aspect-[4/3] items-center justify-center rounded-2xl bg-muted/30 text-5xl text-muted-foreground/30">
                ✦
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {service.categoryRel?.name || "General"}
              </Badge>
              {service.isFeatured && (
                <Badge className="gap-1">
                  <Sparkles className="size-3" />
                  Destacado
                </Badge>
              )}
            </div>

            <h1 className="mt-4 mb-3 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              {service.name}
            </h1>

            <p className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="size-3.5" strokeWidth={1.5} />
              {service.duration} min
            </p>

            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {service.description ||
                "Un tratamiento personalizado diseñado para tu bienestar, guiado por profesionales que entienden tu cuerpo y tu momento."}
            </p>

            <Separator className="my-8" />

            <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl bg-muted/50 p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                  Inversión
                </p>
                {service.compareAtPrice && service.compareAtPrice > service.price && (
                  <p className="text-sm text-muted-foreground line-through">
                    {formatPrice(service.compareAtPrice)}
                  </p>
                )}
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
      </div>
    </section>
  )
}
