import Link from "next/link"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductGallery } from "@/components/shop/product-gallery"
import { AddToCartButton } from "@/components/shop/add-to-cart-button"
import { MetaViewContent } from "@/components/common/meta-view-content"
import type { Product } from "@/types/product"
import { absoluteUrl } from "@/lib/seo"
import { JsonLdScript } from "@/components/common/json-ld-script"

async function getProduct(slug: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  const res = await fetch(`${baseUrl}/api/products/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return { title: "Producto no encontrado" }
  const url = absoluteUrl(`/shop/${slug}`)
  return {
    title: product.name,
    description: product.description?.slice(0, 160) || `Compra ${product.name} en Kamerinos by Sandra Pinzon. Productos de cuidado personal y bienestar.`,
    alternates: { canonical: url },
    openGraph: {
      title: product.name,
      description: product.description?.slice(0, 160) || `Compra ${product.name} en Kamerinos by Sandra Pinzon.`,
      url,
      images: product.mainImage ? [{ url: product.mainImage }] : [],
    },
  }
}

export default async function ProductDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)

  return (
    <div className="min-h-screen pt-32 pb-24 md:pt-40 md:pb-32">
      <JsonLdScript data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: product.name,
        description: product.description || undefined,
        image: product.mainImage || undefined,
        sku: product.sku || undefined,
        category: product.category?.name || undefined,
        brand: { "@type": "Brand", name: "Kamerinos by Sandra Pinzon" },
        offers: {
          "@type": "Offer",
          url: absoluteUrl(`/shop/${product.slug}`),
          price: product.price,
          priceCurrency: "COP",
          availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        },
      }} />
      <JsonLdScript data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tienda", item: `${SITE_URL}/shop` },
          { "@type": "ListItem", position: 3, name: product.name },
        ],
      }} />
      <MetaViewContent
        contentName={product.name}
        contentCategory={product.category?.name || "General"}
        contentType="product"
        value={product.price}
      />
      <div className="mx-auto max-w-7xl px-6">
        <Link href="/shop" className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Volver a la tienda
        </Link>
        <div className="grid gap-10 md:grid-cols-2">
          <ProductGallery mainImage={product.mainImage} carouselImages={product.carouselImages} productName={product.name} />
          <div>
            {product.sponsor && <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">{product.sponsor}</p>}
            <h1 className="mt-2 font-heading text-3xl font-semibold">{product.name}</h1>
            {product.category && <Badge variant="secondary" className="mt-3">{product.category.name}</Badge>}
            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-semibold">{formatPrice(product.price)}</span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{product.stock > 0 ? `${product.stock} disponibles` : null}</p>
            {product.stock === 0 && <Badge variant="destructive" className="mt-2">Agotado</Badge>}
            <Separator className="my-6" />
            {product.description && (
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold">Descripción</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              </div>
            )}
            <div className="mt-8"><AddToCartButton product={product} /></div>
          </div>
        </div>
      </div>
    </div>
  )
}
