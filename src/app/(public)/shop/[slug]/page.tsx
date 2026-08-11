import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ProductGallery } from "@/components/shop/product-gallery"
import type { Product } from "@/types/product"

async function getProduct(slug: string): Promise<Product | null> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  const res = await fetch(`${baseUrl}/api/products/${slug}`, { next: { revalidate: 60 } })
  if (!res.ok) return null
  return res.json()
}

interface ProductDetailProps {
  params: Promise<{ slug: string }>
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" /> Volver a la tienda
        </Link>

        <div className="grid gap-10 md:grid-cols-2">
          <ProductGallery
            mainImage={product.mainImage}
            carouselImages={product.carouselImages}
            productName={product.name}
          />

          <div>
            {product.sponsor && (
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
                {product.sponsor}
              </p>
            )}

            <h1 className="mt-2 font-heading text-3xl font-semibold text-foreground md:text-4xl">
              {product.name}
            </h1>

            {product.category && (
              <Badge variant="secondary" className="mt-3">
                {product.category.name}
              </Badge>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-semibold text-foreground">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {product.stock > 0 ? (
              <p className="mt-2 text-sm text-muted-foreground">
                {product.stock} disponibles
              </p>
            ) : (
              <Badge variant="destructive" className="mt-2">Agotado</Badge>
            )}

            <Separator className="my-6" />

            {product.description && (
              <div className="space-y-4">
                <h2 className="font-heading text-lg font-semibold">Descripción</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
            )}

            <div className="mt-8 space-y-4 rounded-2xl border border-border bg-muted/10 p-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">{product.sku || "—"}</span>
              </div>
              {product.sponsor && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Marca</span>
                  <span className="font-medium">{product.sponsor}</span>
                </div>
              )}
            </div>

            <Button
              className="mt-8 w-full"
              size="lg"
              disabled={product.stock === 0}
            >
              <ShoppingBag className="mr-2 size-5" />
              {product.stock > 0 ? "Agregar al carrito" : "Agotado"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
