"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Calendar,
  Users,
  UserCog,
  Sparkles,
  ShoppingBag,
  Ticket,
  Tags,
  Package,
  Settings,
  LogOut,
  Menu,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/context/auth-provider"
import type { Role } from "@/types/auth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard")
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    )
  }

  if (!user) return null

  const navItems: {
    href: string
    label: string
    icon: React.ElementType
    roles: Role[]
  }[] = [
    {
      href: "/dashboard",
      label: user.role === "CLIENTE" ? "Mi panel" : "Resumen",
      icon: LayoutDashboard,
      roles: ["ADMIN", "EMPLEADO", "CLIENTE"],
    },
    {
      href: "/dashboard/citas",
      label: user.role === "CLIENTE" ? "Mis citas" : "Citas",
      icon: Calendar,
      roles: ["ADMIN", "EMPLEADO", "CLIENTE"],
    },
    {
      href: "/dashboard/clientes",
      label: "Clientes",
      icon: Users,
      roles: ["ADMIN"],
    },
    {
      href: "/dashboard/empleados",
      label: "Empleados",
      icon: UserCog,
      roles: ["ADMIN"],
    },
    {
      href: "/dashboard/servicios",
      label: "Servicios",
      icon: Sparkles,
      roles: ["ADMIN"],
    },
    {
      href: "/dashboard/productos",
      label: "Productos",
      icon: ShoppingBag,
      roles: ["ADMIN"],
    },
    {
      href: "/dashboard/categorias",
      label: "Categorías",
      icon: Tags,
      roles: ["ADMIN"],
    },
    {
      href: "/dashboard/pedidos",
      label: "Pedidos",
      icon: Package,
      roles: ["ADMIN", "CLIENTE"],
    },
    {
      href: "/dashboard/cupones",
      label: "Cupones",
      icon: Ticket,
      roles: ["ADMIN"],
    },
    {
      href: "/dashboard/configuracion",
      label: "Configuración",
      icon: Settings,
      roles: ["ADMIN", "EMPLEADO", "CLIENTE"],
    },
  ]

  const filteredNav = navItems.filter((item) =>
    item.roles.includes(user.role)
  )

  async function handleLogout() {
    await logout()
    router.push("/")
  }

  const sidebarNav = (
    <div className="flex flex-col h-full">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <Link
          href="/"
          className="font-heading text-lg font-semibold tracking-tight"
          onClick={() => setMobileOpen(false)}
        >
          Kamerinos
        </Link>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {filteredNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <item.icon className="size-4" strokeWidth={1.5} />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
            {user.firstName[0]}
            {user.lastName[0]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-foreground">
              {user.firstName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user.role}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="size-4" strokeWidth={1.5} />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card md:flex md:flex-col">
        {sidebarNav}
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6 md:hidden">
          <Link href="/" className="font-heading text-base font-semibold tracking-tight">
            Kamerinos SPA
          </Link>
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" />}>
              <Menu className="size-5" />
              <span className="sr-only">Menú</span>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 p-0">
              {sidebarNav}
            </SheetContent>
          </Sheet>
        </header>
        <main className="flex-1 overflow-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  )
}
