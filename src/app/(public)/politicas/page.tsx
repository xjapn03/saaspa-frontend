import Link from "next/link"
import type { Metadata } from "next"
import { ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Políticas",
  description:
    "Conoce nuestras políticas de abono, cancelación y puntualidad para garantizar la mejor experiencia en Kamerinos SPA.",
}
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FaqSection } from "@/components/marketing/faq-section"

export default function PoliticasPage() {
  return (
    <section className="pt-32 pb-24 md:pt-40 md:pb-32">
      <div className="mx-auto max-w-3xl px-6">
        <p className="mb-4 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Información importante
        </p>
        <h1 className="mb-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
          Políticas
        </h1>
        <p className="mb-12 text-sm leading-relaxed text-muted-foreground">
          Para garantizar una experiencia de calidad para todas nuestras
          clientas, estas son las pautas que rigen nuestras reservas.
        </p>

        <Separator className="mb-12" />

        <div className="space-y-12">
          <div>
            <h2 className="mb-3 font-heading text-xl font-semibold tracking-tight text-foreground">
              Reserva con abono previo
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Todas nuestras citas requieren un abono del 30% del valor del
              servicio para ser confirmadas. Este abono se realiza a través de
              nuestra pasarela de pago segura al momento de agendar. El saldo
              restante se paga el día de tu cita en el spa.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-heading text-xl font-semibold tracking-tight text-foreground">
              Cancelación y reagendamiento
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Puedes reagendar tu cita sin costo hasta 24 horas antes de la
              hora programada. Las cancelaciones con menos de 24 horas de
              anticipación o la inasistencia sin previo aviso implican la
              pérdida del abono. Esta política nos permite respetar el tiempo
              de nuestras terapeutas y de otras clientas que desean atenderse.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-heading text-xl font-semibold tracking-tight text-foreground">
              Puntualidad
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Te recomendamos llegar 10 minutos antes de tu cita para
              recibirte con calma. Si llegas tarde, el tratamiento se acortará
              para no afectar la siguiente reserva, y se cobrará el valor
              completo del servicio agendado.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-heading text-xl font-semibold tracking-tight text-foreground">
              Contraindicaciones
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Algunos tratamientos pueden no ser adecuados durante el embarazo,
              en caso de condiciones dérmicas activas, o bajo ciertos
              medicamentos. Te recomendamos consultarnos antes de agendar si
              tienes alguna condición particular.
            </p>
          </div>

          <div>
            <h2 className="mb-3 font-heading text-xl font-semibold tracking-tight text-foreground">
              Métodos de pago
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Aceptamos PSE, Nequi, tarjetas de crédito y débito a través de
              nuestra pasarela de pagos. El saldo pendiente también puede
              pagarse en efectivo el día de tu cita.
            </p>
          </div>
        </div>

        <Separator className="my-12" />

        <FaqSection />

        <Separator className="my-12" />

        <div className="text-center">
          <Button
            size="lg"
            nativeButton={false}
            render={
              <Link href="/agendar">
                Agendar cita
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
