import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const quickFacts = [
  { label: "Experiencias desde", value: "$ 120.000", delay: "0.2s" },
  { label: "Duración típica", value: "1h — 2h30", delay: "0.4s" },
  { label: "Ubicación", value: "Bogotá · Usaquén", delay: "0.6s" },
]

export function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-accent/10" />

      <div className="relative mx-auto w-full max-w-6xl px-6 py-16 sm:py-24 lg:grid lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-7">
          <p className="mb-6 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Bienestar &amp; Estética · Bogotá
          </p>

          <h1 className="mb-8 font-heading text-4xl leading-[1.1] font-semibold tracking-tight text-foreground text-balance sm:text-5xl md:text-6xl lg:text-7xl">
            Donde el cuidado
            <br />
            se convierte en ritual
          </h1>

          <p className="mb-10 max-w-xl text-lg leading-relaxed text-muted-foreground text-pretty">
            En Kamerinos SPA transformamos cada sesión en una pausa consciente
            de autocuidado. Ciencia dérmica, ingredientes de grado profesional y
            un enfoque cálido que te hace sentir en casa.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Button
              size="lg"
              nativeButton={false}
              render={
                <Link href="/agendar">
                  Agendar ritual
                  <ArrowRight
                    data-slot="icon"
                    data-icon="inline-end"
                    className="size-4"
                    strokeWidth={1.5}
                  />
                </Link>
              }
            />
            <Button
              variant="outline"
              size="lg"
              nativeButton={false}
              render={<Link href="/servicios">Conocer servicios</Link>}
            />
          </div>

          <div className="mt-16 flex flex-wrap gap-8 border-t border-border pt-8 sm:gap-12">
            {quickFacts.map((fact) => (
              <div key={fact.label}>
                <p className="mb-1 text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {fact.label}
                </p>
                <p className="font-heading text-2xl font-medium text-foreground">
                  {fact.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 lg:col-span-5 lg:mt-0">
          <div
            className={cn(
              "relative aspect-[3/4] overflow-hidden rounded-[2rem]",
              "bg-gradient-to-br from-primary/20 via-accent/20 to-secondary/40",
              "shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)]"
            )}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="font-heading text-6xl italic text-primary/30 select-none sm:text-8xl">
                K
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
