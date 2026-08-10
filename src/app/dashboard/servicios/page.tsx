"use client"

import { useState, useCallback } from "react"
import { ServicesTable } from "@/components/dashboard/services-table"
import { ServiceFormDrawer } from "@/components/dashboard/service-form-drawer"
import type { Service } from "@/types/service"

export default function ServiciosAdminPage() {
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleEdit = useCallback((svc: Service) => {
    setEditingService(svc)
    setDrawerOpen(true)
  }, [])

  const handleNew = useCallback(() => {
    setEditingService(null)
    setDrawerOpen(true)
  }, [])

  const handleSaved = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Servicios
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Administración de servicios y precios. Los cambios se reflejan en el sitio público.
        </p>
      </div>

      <ServicesTable
        onEdit={handleEdit}
        onNew={handleNew}
        refreshKey={refreshKey}
      />

      <ServiceFormDrawer
        service={editingService}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        onSaved={handleSaved}
      />
    </div>
  )
}
