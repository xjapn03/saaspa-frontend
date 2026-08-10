"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LayoutDashboard, LogIn, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-provider"

interface NavbarMobileAuthProps {
  onClose: () => void
}

export function NavbarMobileAuth({ onClose }: NavbarMobileAuthProps) {
  const { isAuthenticated, user, logout } = useAuth()
  const router = useRouter()

  async function handleLogout() {
    await logout()
    router.push("/")
    onClose()
  }

  return (
    <div className="flex flex-col gap-2">
      {isAuthenticated ? (
        <>
          <Button
            className="w-full"
            nativeButton={false}
            size="sm"
            render={
              <Link href="/dashboard" onClick={onClose}>
                <LayoutDashboard
                  data-slot="icon"
                  data-icon="inline-start"
                  className="size-4"
                  strokeWidth={1.5}
                />
                {user?.firstName || "Dashboard"}
              </Link>
            }
          />
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground"
            size="sm"
            onClick={handleLogout}
          >
            <LogOut className="size-4" strokeWidth={1.5} />
            Cerrar sesión
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          className="w-full"
          nativeButton={false}
          size="sm"
          render={
            <Link href="/login" onClick={onClose}>
              <LogIn
                data-slot="icon"
                data-icon="inline-start"
                className="size-4"
                strokeWidth={1.5}
              />
              Iniciar sesión
            </Link>
          }
        />
      )}
      <Button
        className="w-full"
        nativeButton={false}
        render={
          <Link href="/agendar" onClick={onClose}>
            Agendar ahora
          </Link>
        }
      />
    </div>
  )
}
