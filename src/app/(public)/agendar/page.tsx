import Link from "next/link"
import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AgendarPage() {
  const waPhone = "573041338567"
  const waMessage = encodeURIComponent("Hola, quiero agendar una cita")

  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Reserva tu cita
        </p>
        <h1 className="mb-6 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Tu ritual de bienestar
          <br />
          comienza aquí
        </h1>
        <p className="mx-auto mb-10 max-w-lg text-sm leading-relaxed text-muted-foreground">
          Próximamente podrás elegir tu servicio, seleccionar fecha y hora, y
          confirmar tu reserva con abono en línea. Mientras tanto, escríbenos por
          WhatsApp y te ayudamos personalmente.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            nativeButton={false}
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
                Agendar por WhatsApp
              </Link>
            }
          />
          <Button
            variant="outline"
            size="lg"
            nativeButton={false}
            render={
              <Link href="/servicios">
                Ver servicios
                <ArrowRight
                  data-slot="icon"
                  data-icon="inline-end"
                  className="size-4"
                  strokeWidth={1.5}
                />
              </Link>
            }
          />
        </div>
      </div>
    </section>
  )
}
