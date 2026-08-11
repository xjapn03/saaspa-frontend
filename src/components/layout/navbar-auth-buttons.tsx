"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-provider"

export function NavbarAuthButtons() {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  return (
    <>
      {isAuthenticated ? null : (
        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm" nativeButton={false} render={<Link href="/login"><LogIn data-slot="icon" data-icon="inline-start" className="size-4" strokeWidth={1.5} />Iniciar sesión</Link>} />
          <Button size="sm" nativeButton={false} render={<Link href="/agendar">Agendar</Link>} />
        </div>
      )}
      {isAuthenticated && (
        <div className="hidden items-center gap-2 md:flex">
          <Button className="inline-flex" size="sm" nativeButton={false} render={<Link href="/dashboard"><LayoutDashboard data-slot="icon" data-icon="inline-start" className="size-4" strokeWidth={1.5} />{user?.firstName || "Dashboard"}</Link>} />
          <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="size-4" strokeWidth={1.5} />Salir</Button>
        </div>
      )}
    </>
  )
}
