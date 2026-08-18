import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { WhatsAppFloatButton } from "@/components/layout/whatsapp-float-button"
import { ScrollTriggerRefresh } from "@/components/layout/scroll-trigger-refresh"

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ScrollTriggerRefresh />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppFloatButton />
    </>
  )
}
