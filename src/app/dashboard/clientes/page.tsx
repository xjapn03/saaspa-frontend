"use client"

import { useState, useCallback } from "react"
import { UsersTable } from "@/components/dashboard/users-table"
import { EditUserDrawer } from "@/components/dashboard/edit-user-drawer"
import type { User } from "@/types/auth"

export default function ClientesPage() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user)
    setDrawerOpen(true)
  }, [])

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Clientes
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Listado de usuarios registrados. Edita roles, datos de contacto o desactiva cuentas.
        </p>
      </div>

      <UsersTable onEdit={handleEdit} refreshKey={refreshKey} />

      <EditUserDrawer
        user={editingUser}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSaved={handleSaved}
      />
    </div>
  )
}
