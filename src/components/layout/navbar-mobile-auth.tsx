"use client"

import Link from "next/link"
import { LayoutDashboard, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-provider"

export function NavbarMobileAuth() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="flex flex-col gap-2">
      {isAuthenticated ? (
        <Button
          className="w-full"
          nativeButton={false}
          size="sm"
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
      ) : (
        <Button
          variant="outline"
          className="w-full"
          nativeButton={false}
          size="sm"
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
      )}
      <Button
        className="w-full"
        nativeButton={false}
        render={<Link href="/agendar">Agendar ahora</Link>}
      />
    </div>
  )
}
