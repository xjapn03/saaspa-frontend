import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
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
  className?: string
}

export function ServiceCard({
  name,
  slug,
  category,
  duration,
  description,
  price,
  className,
}: ServiceCardProps) {
  return (
    <Link href={`/servicios/${slug}`} className="block group">
      <Card
        className={cn(
          "h-full transition-shadow duration-300 group-hover:shadow-lg group-hover:border-primary/40",
          className
        )}
      >
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
