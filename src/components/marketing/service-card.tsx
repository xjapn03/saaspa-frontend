import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
    <Card
      className={cn(
        "group transition-shadow duration-300 hover:shadow-lg",
        className
      )}
    >
      <CardHeader>
        <Badge variant="secondary" className="w-fit">
          {category}
        </Badge>
        <CardTitle className="mt-2 font-heading text-xl font-semibold">
          <Link
            href={`/servicios/${slug}`}
            className="transition-colors hover:text-primary"
          >
            {name}
          </Link>
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
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          className="shrink-0"
          render={
            <Link href={`/servicios/${slug}`}>
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </Link>
          }
        />
      </CardFooter>
    </Card>
  )
}
