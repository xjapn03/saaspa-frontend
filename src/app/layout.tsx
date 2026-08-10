import type { Metadata } from "next"
import { fraunces, geistSans, geistMono } from "@/lib/fonts"
import { ClientProviders } from "@/components/layout/client-providers"
import "./globals.css"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Kamerinos SPA — Bienestar & Estética en Bogotá",
  description:
    "Centro de bienestar y estética en Bogotá. Reserva tu ritual de cuidado personal con abono previo. Facial, corporal, capilar y más.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        fraunces.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  )
}
