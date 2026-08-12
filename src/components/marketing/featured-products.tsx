"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedGrid } from "@/components/layout/animated-grid"
import { ProductCard } from "@/components/marketing/product-card"
import { productsApi } from "@/lib/products-api"
import type { Product } from "@/types/product"

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    productsApi.list({ featured: true, limit: 4 })
      .then((result) => setProducts(result.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && products.length === 0) return null

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground">
            Shop
          </p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-foreground md:text-4xl">
            Productos destacados
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          nativeButton={false}
          render={<Link href="/shop">Ver tienda <ArrowRight className="ml-1 size-4" /></Link>}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-card">
              <div className="aspect-square rounded-t-2xl bg-muted/20" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-16 rounded bg-muted/30" />
                <div className="h-5 w-3/4 rounded bg-muted/30" />
                <div className="h-4 w-20 rounded bg-muted/30" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <AnimatedGrid className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" childSelector=".grid-card">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </AnimatedGrid>
      )}
    </section>
  )
}
