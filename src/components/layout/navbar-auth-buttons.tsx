"use client"

import Link from "next/link"
import { LayoutDashboard, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-provider"

export function NavbarAuthButtons() {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated) {
    return (
      <div className="hidden items-center gap-3 md:flex">
        <Button
          className="inline-flex"
          size="sm"
          nativeButton={false}
          render={
            <Link href="/dashboard">
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
      </div>
    )
  }

  return (
    <div className="hidden items-center gap-3 md:flex">
      <Button
        variant="ghost"
        size="sm"
        nativeButton={false}
        render={
          <Link href="/login">
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
      <Button
        size="sm"
        nativeButton={false}
        render={<Link href="/agendar">Agendar</Link>}
      />
    </div>
  )
}
