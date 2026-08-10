import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CtaSection() {
  const waPhone = "573000000000"
  const waMessage = encodeURIComponent("Hola, quiero agendar una cita")

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary px-8 py-16 text-primary-foreground md:px-16 md:py-24">
          <div className="absolute -right-20 -top-20 size-80 rounded-full bg-background/10" />
          <div className="absolute -bottom-10 -left-10 size-48 rounded-full bg-background/10" />

          <div className="relative max-w-2xl">
            <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] opacity-70">
              Tu primera experiencia
            </p>
            <h2 className="mb-6 font-heading text-3xl font-semibold tracking-tight text-balance sm:text-4xl md:text-5xl">
              El cuidado que mereces
              <br />
              te está esperando
            </h2>
            <p className="mb-10 max-w-lg text-primary-foreground/80 leading-relaxed">
              Reserva tu ritual y regálate una pausa de bienestar en el corazón
              de Usaquén. El primer paso es el más sencillo.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                nativeButton={false}
                className="bg-background text-foreground hover:bg-background/90"
                render={
                  <Link href="/agendar">
                    Agendar ahora
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
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
                render={
                  <Link
                    href={`https://wa.me/${waPhone}?text=${waMessage}`}
                    target="_blank"
                  >
                    <MessageCircle
                      data-slot="icon"
                      data-icon="inline-start"
                      className="size-4"
                      strokeWidth={1.5}
                    />
                    Hablar por WhatsApp
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
