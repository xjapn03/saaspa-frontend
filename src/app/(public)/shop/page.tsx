import Link from "next/link"
import type { Metadata } from "next"
import { Search, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AnimatedGrid } from "@/components/layout/animated-grid"
import { ProductCard } from "@/components/marketing/product-card"
import type { Product } from "@/types/product"

async function getProducts(search?: string, categorySlug?: string): Promise<Product[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  const params = new URLSearchParams()
  if (search) params.set("search", search)
  if (categorySlug) params.set("categorySlug", categorySlug)
  params.set("limit", "50")
  const res = await fetch(`${baseUrl}/api/products?${params}`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

async function getCategories(): Promise<{ id: string; name: string; slug: string }[]> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
  const res = await fetch(`${baseUrl}/api/categories`, { cache: "no-store" })
  if (!res.ok) return []
  return res.json()
}

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Explora nuestra selección de productos de cuidado personal: cremas, sérums, mascarillas y más para tu rutina de bienestar y belleza.",
}

interface ShopPageProps {
  searchParams: Promise<{ search?: string; category?: string }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const search = params.search || ""
  const categorySlug = params.category || ""

  const [products, categories] = await Promise.all([
    getProducts(search, categorySlug),
    getCategories(),
  ])

  return (
    <div className="min-h-screen">
      <section className="border-b border-border bg-gradient-to-b from-muted/10 to-transparent px-6 py-20 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">Shop</p>
        <h1 className="mt-3 font-heading text-4xl font-semibold text-foreground md:text-5xl">
          Productos de bienestar
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground">
          Descubre nuestra selección curada de productos para el cuidado personal, salud y estética.
        </p>

        <form className="mx-auto mt-8 flex max-w-md gap-2" method="GET" action="/shop">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              name="search"
              placeholder="Buscar productos..."
              defaultValue={search}
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <Button type="submit" size="sm">Buscar</Button>
        </form>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        {categories.length > 0 && (
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <Link href="/shop">
              <Badge variant={!categorySlug ? "default" : "outline"}>Todos</Badge>
            </Link>
            {categories.map((cat) => (
              <Link key={cat.id} href={`/shop?category=${cat.slug}`}>
                <Badge variant={categorySlug === cat.slug ? "default" : "outline"}>
                  {cat.name}
                </Badge>
              </Link>
            ))}
          </div>
        )}

        {products.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-16 text-center">
            <p className="text-lg text-muted-foreground">No se encontraron productos.</p>
            {search && (
              <Button variant="outline" className="mt-4" size="sm" nativeButton={false} render={<Link href="/shop">Limpiar búsqueda</Link>} />
            )}
            <Button className="mt-4 ml-3" size="sm" nativeButton={false} render={<Link href="/servicios">Ver servicios <ArrowRight className="ml-1 size-3" /></Link>} />
          </div>
        ) : (
          <AnimatedGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" childSelector=".grid-card">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatedGrid>
        )}
      </section>
    </div>
  )
}
