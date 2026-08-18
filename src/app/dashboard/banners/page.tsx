"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { BannerFormDrawer } from "@/components/dashboard/banner-form-drawer"
import { bannersApi } from "@/lib/banners-api"
import { useToast } from "@/context/toast-provider"
import type { Banner } from "@/types/banner"

export default function BannersAdminPage() {
  const { error: showError, success: showSuccess } = useToast()
  const [banners, setBanners] = useState<Banner[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Banner | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchBanners = useCallback(async () => {
    setIsLoading(true)
    try {
      setBanners(await bannersApi.list())
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al cargar banners"
      showError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchBanners()
  }, [fetchBanners])

  async function handleDelete(banner: Banner) {
    setDeletingId(banner.id)
    try {
      await bannersApi.remove(banner.id)
      showSuccess("Banner eliminado")
      await fetchBanners()
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al eliminar"
      showError(String(msg))
    } finally {
      setDeletingId(null)
      setConfirmDelete(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Banners</h1>
          <p className="text-sm text-muted-foreground">
            Imágenes de campaña y promociones del home (temporada: Halloween, diciembre...)
          </p>
        </div>
        <Button onClick={() => { setEditingBanner(null); setDrawerOpen(true) }}>
          <Plus className="size-4" strokeWidth={1.5} />
          Nuevo banner
        </Button>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No hay banners. Crea el primero para mostrar campañas en el home.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {banners.map((b) => (
            <div key={b.id} className="overflow-hidden rounded-2xl border border-border bg-card">
              <img src={b.imageUrl} alt={b.title || "Banner"} className="aspect-[16/9] w-full object-cover" />
              <div className="p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Badge variant={b.isActive ? "default" : "secondary"}>{b.isActive ? "Activo" : "Inactivo"}</Badge>
                  <Badge variant="outline">{b.position === "HERO" ? "Hero" : b.position === "STRIP" ? "Banda" : "Retrato"}</Badge>
                </div>
                <p className="font-medium text-foreground">{b.title || "Sin título"}</p>
                {b.subtitle && <p className="line-clamp-1 text-xs text-muted-foreground">{b.subtitle}</p>}
                <div className="mt-3 flex items-center justify-end gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => { setEditingBanner(b); setDrawerOpen(true) }} title="Editar">
                    <Pencil className="size-4" strokeWidth={1.5} />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => setConfirmDelete(b)} disabled={deletingId === b.id} title="Eliminar">
                    {deletingId === b.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" strokeWidth={1.5} />}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <BannerFormDrawer
        banner={editingBanner}
        open={drawerOpen}
        onOpenChange={(open) => { setDrawerOpen(open); if (!open) setEditingBanner(null) }}
        onSaved={fetchBanners}
      />

      <Modal
        open={!!confirmDelete}
        onOpenChange={(open) => { if (!open) setConfirmDelete(null) }}
        title="Eliminar banner"
        description={`¿Seguro que deseas eliminar "${confirmDelete?.title || "este banner"}"? Esta acción no se puede deshacer.`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmDelete(null)}>Cancelar</Button>
          <Button size="sm" variant="destructive" disabled={deletingId === confirmDelete?.id} onClick={() => { if (confirmDelete) handleDelete(confirmDelete) }}>
            {deletingId === confirmDelete?.id ? <Loader2 className="mr-1 size-3 animate-spin" /> : null}
            Eliminar
          </Button>
        </div>
      </Modal>
    </div>
  )
}
