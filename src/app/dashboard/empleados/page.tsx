"use client"

import { useState, useCallback } from "react"
import { UsersTable } from "@/components/dashboard/users-table"
import { EditUserDrawer } from "@/components/dashboard/edit-user-drawer"
import { UserDetailDrawer } from "@/components/dashboard/user-detail-drawer"
import type { User } from "@/types/auth"

export default function EmpleadosDashboard() {
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [viewUser, setViewUser] = useState<User | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const handleEdit = useCallback((user: User) => { setEditingUser(user); setDrawerOpen(true) }, [])
  const handleView = useCallback((user: User) => { setViewUser(user); setViewOpen(true) }, [])
  const handleAdd = useCallback(() => { setEditingUser(null); setDrawerOpen(true) }, [])
  const handleSaved = useCallback(() => { setDrawerOpen(false); setEditingUser(null); setRefresh((r) => r + 1) }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold">Empleados</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestiona el equipo de trabajo</p>
      </div>
      <UsersTable onEdit={handleEdit} onView={handleView} onAdd={handleAdd} refreshKey={refresh} roleFilter="EMPLEADO" />
      <EditUserDrawer user={editingUser} open={drawerOpen} onOpenChange={setDrawerOpen} onSaved={handleSaved} defaultRole="EMPLEADO" hideRole={true} />
      <UserDetailDrawer user={viewUser} open={viewOpen} onOpenChange={setViewOpen} />
    </div>
  )
}
