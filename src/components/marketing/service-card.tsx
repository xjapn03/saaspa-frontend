import Link from "next/link"
import { ArrowRight, Clock, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

export interface ServiceCardProps {
  name: string
  slug: string
  category: string
  duration: string
  description: string
  price: string
  compareAtPrice?: string
  image?: string | null
  isFeatured?: boolean
  className?: string
}

export function ServiceCard({
  name,
  slug,
  category,
  duration,
  description,
  price,
  compareAtPrice,
  image,
  isFeatured,
  className,
}: ServiceCardProps) {
  return (
    <Link href={`/servicios/${slug}`} className="block group">
      <Card
        className={cn(
          "h-full overflow-hidden transition-shadow duration-300 group-hover:shadow-lg group-hover:border-primary/40",
          className
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-muted/30">
          {image ? (
            <img
              src={image}
              alt={name}
              className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-4xl text-muted-foreground/30">
              ✦
            </div>
          )}
          {isFeatured && (
            <Badge className="absolute left-3 top-3 gap-1">
              <Sparkles className="size-3" />
              Destacado
            </Badge>
          )}
        </div>
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            {category}
          </Badge>
          <CardTitle className="mt-2 font-heading text-xl font-semibold transition-colors group-hover:text-primary">
            {name}
          </CardTitle>
          <CardDescription className="flex items-center gap-1.5 text-xs">
            <Clock className="size-3" strokeWidth={1.5} />
            {duration}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">
            {description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between border-t border-border pt-4">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground">
              Inversión
            </p>
            {compareAtPrice && (
              <p className="text-xs text-muted-foreground line-through">
                {compareAtPrice}
              </p>
            )}
            <p className="font-heading text-xl font-semibold text-foreground">
              {price}
            </p>
          </div>
          <div className="flex size-9 items-center justify-center rounded-full bg-foreground text-background transition-transform duration-300 group-hover:rotate-45">
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
