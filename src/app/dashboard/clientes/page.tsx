"use client"

import { useState, useCallback } from "react"
import { UsersTable } from "@/components/dashboard/users-table"
import { EditUserDrawer } from "@/components/dashboard/edit-user-drawer"
import { UserDetailDrawer } from "@/components/dashboard/user-detail-drawer"
import type { User } from "@/types/auth"

export default function ClientesPage() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = useCallback((user: User) => {
    setEditingUser(user)
    setDrawerOpen(true)
  }, [])

  const handleView = useCallback((user: User) => {
    setViewUser(user)
    setViewOpen(true)
  }, [])

  const handleAdd = useCallback(() => {
    setEditingUser(null)
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

      <UsersTable onEdit={handleEdit} onView={handleView} onAdd={handleAdd} refreshKey={refreshKey} />

      <EditUserDrawer user={editingUser} open={drawerOpen} onOpenChange={setDrawerOpen} onSaved={handleSaved} defaultRole="CLIENTE" hideRole={true} />
      <UserDetailDrawer user={viewUser} open={viewOpen} onOpenChange={setViewOpen} />
    </div>
  )
}
