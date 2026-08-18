import type { Metadata } from "next"
import { Suspense } from "react"
import { ClientProviders } from "@/components/layout/client-providers"
import { MetaPixelScript } from "@/components/layout/meta-pixel-script"
import { JsonLd } from "@/components/layout/json-ld"
import { SpeculationRules } from "@/components/common/SpeculationRules"
import "./globals.css"
import { cn } from "@/lib/utils"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const SITE_NAME = "Kamerinos by Sandra Pinzon"
const SITE_DESCRIPTION =
  "Centro de bienestar, estética y salud en Bogotá. Reserva tu ritual de cuidado personal con abono previo. Tratamientos faciales, corporales, capilares, masajes terapéuticos y más."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Bienestar, Estética & Salud en Bogotá`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "centro de estética",
    "bienestar",
    "salud",
    "Bogotá",
    "spa",
    "facial",
    "corporal",
    "capilar",
    "masajes",
    "terapéutico",
    "cuidado personal",
    "belleza",
    "tratamientos",
    "relajación",
    "abono",
    "agendar cita",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Bienestar, Estética & Salud en Bogotá`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Bienestar, Estética & Salud`,
    description: SITE_DESCRIPTION,
  },
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        "font-sans"
      )}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..700;1,9..144,400..700&family=Geist:wght@300..700&family=Geist+Mono:wght@300..700&display=swap"
          rel="stylesheet"
        />
        <Suspense fallback={null}>
          <MetaPixelScript />
        </Suspense>
        <JsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
        <SpeculationRules />
      </body>
    </html>
  )
}
