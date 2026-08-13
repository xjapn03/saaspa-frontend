import type { Metadata } from "next"
import Link from "next/link"
import { LegalPage } from "@/components/legal/legal-page"

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Conoce cómo Kamerinos SPA recopila, usa y protege tus datos personales, conforme a la Ley 1581 de 2012 de Colombia.",
}

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacidad"
      title="Política de Privacidad"
      intro="En Kamerinos SPA nos comprometemos a proteger tu información personal y a tratarla con transparencia, de acuerdo con la Ley 1581 de 2012 y las normas sobre protección de datos personales en Colombia."
      updatedAt="Agosto de 2026"
      sections={[
        {
          title: "1. Responsable del tratamiento",
          body: (
            <div className="space-y-3">
              <p>
                El responsable del tratamiento de tus datos personales es
                Kamerinos SPA, establecimiento de Sandra Pinzón Salud y Belleza,
                ubicado en Bogotá (Usaquén), Colombia.
              </p>
              <p>
                Para cualquier consulta relacionada con tus datos puedes
                escribirnos a{" "}
                <span className="text-foreground">contacto@sandrapinzonsaludybelleza.com.co</span>{" "}
                o escribirnos por WhatsApp al{" "}
                <span className="text-foreground">+57 300 000 0000</span>.
              </p>
            </div>
          ),
        },
        {
          title: "2. Datos personales que recogemos",
          body: (
            <div className="space-y-3">
              <p>Para prestarte nuestros servicios podemos recoger:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <span className="text-foreground">Identificación y contacto:</span>{" "}
                  nombre, correo electrónico y número de teléfono / WhatsApp.
                </li>
                <li>
                  <span className="text-foreground">Datos de reservas:</span>{" "}
                  servicios elegidos, fechas y horarios de tus citas.
                </li>
                <li>
                  <span className="text-foreground">Datos de compras:</span>{" "}
                  productos adquiridos y montos.{" "}
                  <span className="text-foreground">
                    No almacenamos los datos de tu tarjeta
                  </span>
                  ; los pagos se procesan de forma segura a través de nuestra
                  pasarela (Wompi).
                </li>
                <li>
                  <span className="text-foreground">Datos de navegación:</span>{" "}
                  cookies y tecnologías de seguimiento como el Pixel de Meta,
                  para medir el rendimiento del sitio y optimizar la publicidad.
                </li>
              </ul>
            </div>
          ),
        },
        {
          title: "3. Finalidades del tratamiento",
          body: (
            <ul className="list-disc space-y-1.5 pl-5">
              <li>Gestionar y confirmar tus citas, incluido el abono del 30%.</li>
              <li>Procesar pedidos y entregas de productos del e-commerce.</li>
              <li>Enviarte confirmaciones, comprobantes y recordatorios por correo o WhatsApp.</li>
              <li>Atender tus solicitudes, dudas y soporte.</li>
              <li>Registrar eventos de conversión para atribución publicitaria (Meta Pixel + Conversions API).</li>
            </ul>
          ),
        },
        {
          title: "4. Base legal",
          body: (
            <p>
              Tratamos tus datos con fundamento en tu consentimiento, la
              ejecución del contrato de servicios (reservas y compras), nuestro
              interés legítimo (mejora del servicio y métricas) y el
              cumplimiento de obligaciones legales y fiscales.
            </p>
          ),
        },
        {
          title: "5. Cookies y tecnologías de seguimiento",
          body: (
            <p>
              Nuestro sitio utiliza cookies y el Pixel de Meta para entender el
              comportamiento de navegación y optimizar campañas. Puedes
              desactivar o restringir las cookies desde la configuración de tu
              navegador. La desactivación no impide el uso del sitio, aunque
              puede limitar algunas funciones.
            </p>
          ),
        },
        {
          title: "6. Compartir datos con terceros",
          body: (
            <div className="space-y-3">
              <p>Para operar nuestro servicio compartimos información con:</p>
              <ul className="list-disc space-y-1.5 pl-5">
                <li>
                  <span className="text-foreground">Wompi:</span> procesamiento
                  de pagos en línea (PSE, Nequi, tarjetas).
                </li>
                <li>
                  <span className="text-foreground">Google Calendar:</span>{" "}
                  gestión de la agenda de citas.
                </li>
                <li>
                  <span className="text-foreground">SendGrid:</span> envío de
                  correos transaccionales y comprobantes.
                </li>
                <li>
                  <span className="text-foreground">Meta Platforms:</span>{" "}
                  atribución de anuncios mediante Pixel y Conversions API.
                </li>
                <li>
                  <span className="text-foreground">WhatsApp / Meta:</span>{" "}
                  comunicación e historial de conversaciones de atención.
                </li>
              </ul>
              <p>
                Estos terceros actúan bajo estándares de seguridad y
                confidencialidad. Nunca vendemos tus datos personales.
              </p>
            </div>
          ),
        },
        {
          title: "7. Transferencias internacionales",
          body: (
            <p>
              Algunos servicios en la nube que utilizamos (como Wompi, SendGrid,
              Google y Meta) pueden procesar datos en servidores ubicados fuera
              de Colombia, cumpliendo con las garantías exigidas por la ley para
              transferencias internacionales.
            </p>
          ),
        },
        {
          title: "8. Retención de datos",
          body: (
            <p>
              Conservamos tus datos únicamente durante el tiempo necesario para
              prestarte el servicio, cumplir obligaciones legales y fiscales, y
              defender nuestros derechos. Cuando ya no sean necesarios, se
              eliminan o anonimizan de forma segura.
            </p>
          ),
        },
        {
          title: "9. Derechos del titular",
          body: (
            <div className="space-y-3">
              <p>
                De acuerdo con la Ley 1581 de 2012, tienes derecho a conocer,
                actualizar y rectificar tus datos, solicitar su supresión y
                revocar la autorización para su tratamiento.
              </p>
              <p>
                Para ejercer estos derechos, escríbenos a{" "}
                <span className="text-foreground">contacto@sandrapinzonsaludybelleza.com.co</span>{" "}
                con el asunto{" "}
                <span className="text-foreground">&quot;Derechos Habeas Data&quot;</span>{" "}
                indicando tu nombre y el correo registrado.
              </p>
            </div>
          ),
        },
        {
          title: "10. Cambios a esta política",
          body: (
            <p>
              Podemos actualizar esta política periódicamente. Los cambios se
              publicarán en esta página con su fecha de actualización. Te
              recomendamos revisarla de forma regular.
            </p>
          ),
        },
        {
          title: "11. Contacto",
          body: (
            <p>
              Si tienes preguntas sobre esta política o el tratamiento de tus
              datos, contáctanos en{" "}
              <span className="text-foreground">contacto@sandrapinzonsaludybelleza.com.co</span>{" "}
              o visita nuestra página de{" "}
              <Link
                href="/eliminar-datos"
                className="text-primary underline underline-offset-4 transition-colors hover:text-primary/70"
              >
                eliminación de datos
              </Link>
              .
            </p>
          ),
        },
      ]}
    />
  )
}
