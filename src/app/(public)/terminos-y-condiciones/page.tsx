import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones que rigen el uso del sitio de Kamerinos SPA: agendamiento de citas, compras en línea, pagos, envíos y responsabilidades.",
}

export default function TermsPage() {
  return (
    <LegalPage
      eyebrow="Legal"
      title="Términos y Condiciones"
      intro="Estos términos rigen el uso del sitio web y la contratación de servicios y productos de Kamerinos SPA. Al agendar una cita o realizar una compra aceptas las condiciones descritas a continuación."
      updatedAt="Agosto de 2026"
      sections={[
        {
          title: "1. Aceptación de los términos",
          body: (
            <p>
              Al acceder a nuestro sitio, agendar una cita o comprar un producto,
              confirmas que has leído y aceptado estos términos en su totalidad.
              Si no estás de acuerdo con ellos, te sugerimos no utilizar
              nuestros servicios.
            </p>
          ),
        },
        {
          title: "2. Servicios ofrecidos",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>
                <span className="text-foreground">Agendamiento de citas:</span>{" "}
                servicios de estética y bienestar prestados en nuestro centro en
                Bogotá.
              </li>
              <li>
                <span className="text-foreground">E-commerce:</span> venta de
                productos de cuidado personal y bienestar con entrega a
                domicilio o retiro en el centro.
              </li>
            </ul>
          ),
        },
        {
          title: "3. Registro y cuenta",
          body: (
            <p>
              Para agendar y comprar es necesario crear una cuenta con tus datos
              de contacto. Eres responsable de mantener la confidencialidad de
              tu cuenta y de la información asociada.
            </p>
          ),
        },
        {
          title: "4. Reservas y abono",
          body: (
            <div className="space-y-3">
              <p>
                Todas las citas requieren un <span className="text-foreground">abono del 30%</span>{" "}
                del valor del servicio para ser confirmadas, pagado a través de
                nuestra pasarela. El saldo restante se paga el día de la cita en
                el centro.
              </p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  Puedes reagendar sin costo hasta 24 horas antes de la hora
                  programada.
                </li>
                <li>
                  Las cancelaciones con menos de 24 horas de anticipación o la
                  inasistencia implican la pérdida del abono.
                </li>
              </ul>
              <p>
                Consulta el detalle en nuestra página de{" "}
                <Link
                  href="/politicas"
                  className="text-primary underline underline-offset-4 transition-colors hover:text-primary/70"
                >
                  políticas
                </Link>
                .
              </p>
            </div>
          ),
        },
        {
          title: "5. Compras y pagos",
          body: (
            <div className="space-y-3">
              <p>
                Los precios se expresan en pesos colombianos (COP). Los pagos se
                procesan de forma segura a través de nuestra pasarela Wompi,
                aceptando PSE, Nequi y tarjetas de crédito o débito. No
                almacenamos los datos de tu tarjeta.
              </p>
              <p>
                El abono o pago se confirma únicamente cuando la pasarela lo
                aprueba. En caso de fallo, no se generará ninguna obligación de
                pago.
              </p>
            </div>
          ),
        },
        {
          title: "6. Envíos y entregas",
          body: (
            <p>
              Los productos comprados pueden ser entregados a domicilio en
              Bogotá o recogidos en nuestro centro. Los tiempos y costos de
              entrega se informan durante el proceso de compra y pueden variar
              según la ubicación y disponibilidad.
            </p>
          ),
        },
        {
          title: "7. Devoluciones",
          body: (
            <p>
              Aceptamos devoluciones o cambios de productos con defectos de
              fábrica o errores en el despacho, presentando el comprobante
              dentro de los 5 días hábiles siguientes a la recepción. Los
              productos de higiene personal y sellados no pueden devolverse por
              razones sanitarias, salvo defecto comprobado.
            </p>
          ),
        },
        {
          title: "8. Propiedad intelectual",
          body: (
            <p>
              Todos los contenidos del sitio (textos, imágenes, logos y
              diseño) son propiedad de Kamerinos SPA y están protegidos por la
              legislación sobre propiedad intelectual. Queda prohibida su
              reproducción o uso sin autorización.
            </p>
          ),
        },
        {
          title: "9. Limitación de responsabilidad",
          body: (
            <p>
              Los tratamientos estéticos pueden tener contraindicaciones.
              Informaremos de las precauciones correspondientes y te
              recomendamos consultarnos antes de agendar si tienes alguna
              condición particular. Kamerinos SPA no asume responsabilidad por
              el mal uso de los productos ni por decisiones basadas en la
              información general publicada en el sitio.
            </p>
          ),
        },
        {
          title: "10. Ley aplicable y jurisdicción",
          body: (
            <p>
              Estos términos se rigen por las leyes de la República de Colombia.
              Cualquier controversia será sometida a la jurisdicción de los
              juzgados de Bogotá, D.C.
            </p>
          ),
        },
        {
          title: "11. Contacto",
          body: (
            <p>
              Para cualquier consulta sobre estos términos, escríbenos a{" "}
              <span className="text-foreground">contacto@sandrapinzonsaludybelleza.com.co</span>{" "}
              o por WhatsApp al{" "}
              <span className="text-foreground">+57 300 000 0000</span>.
            </p>
          ),
        },
      ]}
    />
  )
}
