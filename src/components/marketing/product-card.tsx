import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  className?: string
}

export function ProductCard({ product, className }: ProductCardProps) {
  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  return (
    <Link
      href={`/shop/${product.slug}`}
      className={`grid-card group block rounded-2xl border border-border bg-card transition-colors hover:border-primary/30 hover:bg-muted/20 ${className || ""}`}
    >
      <div className="aspect-square overflow-hidden rounded-t-2xl bg-muted/30">
        {product.mainImage ? (
          <img
            src={product.mainImage}
            alt={product.name}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <span className="text-4xl text-muted-foreground/30">✦</span>
          </div>
        )}
      </div>
      <div className="p-5">
        {product.sponsor && (
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-muted-foreground">
            {product.sponsor}
          </p>
        )}
        <h3 className="mt-1 font-heading text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        {product.category && (
          <Badge variant="secondary" className="mt-2">
            {product.category.name}
          </Badge>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-heading text-lg font-semibold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {product.stock > 0 ? `${product.stock} disponibles` : "Agotado"}
          </span>
          <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  )
}
