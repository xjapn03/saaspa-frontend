"use client"

import { useState } from "react"
import { UsersTable } from "@/components/dashboard/users-table"
import { EditUserDrawer } from "@/components/dashboard/edit-user-drawer"
import type { User } from "@/types/auth"

export default function EmpleadosDashboard() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)

  function handleEdit(user: User) {
    setEditingUser(user)
    setDrawerOpen(true)
  }

  function handleSaved() {
    setDrawerOpen(false)
    setEditingUser(null)
    setRefresh((r) => r + 1)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Empleados</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestiona el equipo de trabajo</p>
      </div>
      <UsersTable onEdit={handleEdit} refreshKey={refresh} roleFilter="EMPLEADO" />
      <EditUserDrawer user={editingUser} open={drawerOpen} onOpenChange={setDrawerOpen} onSaved={handleSaved} />
    </div>
  )
}
