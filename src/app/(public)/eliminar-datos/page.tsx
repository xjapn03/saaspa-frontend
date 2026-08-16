import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Eliminación de Datos",
  description:
    "Instrucciones para solicitar la eliminación de tus datos personales en Kamerinos by Sandra Pinzon, conforme a la Ley 1581 de 2012 de Colombia.",
}

export default function DataDeletionPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Eliminación de Datos"
      intro="Puedes solicitar la eliminación de tus datos personales en cualquier momento. Te explicamos cómo hacerlo, qué se elimina y qué conservamos por obligación legal."
      sections={[
        {
          title: "1. Cómo solicitar la eliminación",
          body: (
            <div className="space-y-3">
              <p>
                Envía tu solicitud por correo electrónico a{" "}
                <span className="text-foreground">Kamerinosg@gmail.com</span>{" "}
                o por WhatsApp al{" "}
                <span className="text-foreground">+57 304 1338567</span>, con el
                asunto{" "}
                <span className="text-foreground">&quot;Solicitud de eliminación de datos&quot;</span>.
              </p>
              <p>
                También puedes gestionar tu cuenta desde el panel del cliente, si
                tu solicitud no requiere intervención adicional.
              </p>
            </div>
          ),
        },
        {
          title: "2. Qué incluir en la solicitud",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Tu nombre completo.</li>
              <li>El correo electrónico con el que te registraste.</li>
              <li>
                Si aplica, una breve referencia a tus citas o pedidos para
                localizar tus datos con precisión.
              </li>
            </ul>
          ),
        },
        {
          title: "3. Qué se elimina",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Tu cuenta y datos de contacto (nombre, correo, teléfono).</li>
              <li>El historial de citas y reservas.</li>
              <li>El historial de pedidos y carrito de compras.</li>
              <li>Cualquier otra información asociada a tu identidad.</li>
            </ul>
          ),
        },
        {
          title: "4. Qué se conserva y por qué",
          body: (
            <p>
              Por obligaciones legales y fiscales de Colombia, conservaremos los
              comprobantes de facturación, pagos y la información contable
              asociada durante el tiempo exigido por la ley (mínimo 5 años).
              Estos datos se conservan únicamente para fines legales y no se
              utilizan con fines comerciales.
            </p>
          ),
        },
        {
          title: "5. Plazos de respuesta",
          body: (
            <p>
              De acuerdo con la Ley 1581 de 2012, responderemos las consultas en
              un máximo de <span className="text-foreground">10 días hábiles</span>{" "}
              y resolveremos los reclamos en un máximo de{" "}
              <span className="text-foreground">15 días hábiles</span>, contados
              desde la recepción de tu solicitud.
            </p>
          ),
        },
        {
          title: "6. Más información",
          body: (
            <p>
              Para conocer el detalle completo del tratamiento de tus datos,
              consulta nuestra{" "}
              <Link
                href="/politica-de-privacidad"
                className="text-primary underline underline-offset-4 transition-colors hover:text-primary/70"
              >
                política de privacidad
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
