"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Pencil,
  Trash2,
  Search,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Modal } from "@/components/ui/modal"
import { servicesApi } from "@/lib/services-api"
import { useToast } from "@/context/toast-provider"
import type { Service } from "@/types/service"

const ITEMS_PER_PAGE = 8

interface ServicesTableProps {
  onEdit: (svc: Service) => void
  onNew: () => void
  refreshKey: number
}

export function ServicesTable({
  onEdit,
  onNew,
  refreshKey,
}: ServicesTableProps) {
  const { error: showError, success: showSuccess } = useToast()
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [confirmToggle, setConfirmToggle] = useState<Service | null>(null)

  const fetchServices = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await servicesApi.list()
      setServices(result.data)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al cargar servicios"
      setError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices, refreshKey])

  async function handleToggle(service: Service) {
    setTogglingId(service.id)
    try {
      await servicesApi.update(service.id, { isActive: !service.isActive })
      showSuccess(service.isActive ? "Servicio desactivado" : "Servicio activado")
      await fetchServices()
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al cambiar estado"
      showError(String(msg))
    } finally {
      setTogglingId(null)
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(price)

  const filtered = services.filter((s) => {
    const q = search.toLowerCase()
    const categoryName = s.categoryRel?.name || ""
    return (
      s.name.toLowerCase().includes(q) ||
      categoryName.toLowerCase().includes(q) ||
      (s.description && s.description.toLowerCase().includes(q))
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paged = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={fetchServices}
        >
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <Button size="sm" onClick={onNew}>
          <Plus className="size-4" strokeWidth={1.5} />
          Nuevo
        </Button>
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search
              ? "No se encontraron servicios."
              : "No hay servicios registrados."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Nombre
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
                    Categoría
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                    Duración
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">
                    Precio
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((svc) => (
                  <tr
                    key={svc.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">{svc.name}</p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {svc.categoryRel?.name || "Sin categoría"}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge variant="secondary">
                        {svc.categoryRel?.name || "Sin categoría"}
                      </Badge>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" strokeWidth={1.5} />
                        {svc.duration} min
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {formatPrice(svc.price)}
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge
                        variant={svc.isActive ? "outline" : "secondary"}
                      >
                        {svc.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(svc)}
                          title="Editar"
                        >
                          <Pencil className="size-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={togglingId === svc.id}
                          onClick={() => setConfirmToggle(svc)}
                          title={
                            svc.isActive ? "Desactivar" : "Activar"
                          }
                        >
                          {togglingId === svc.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" strokeWidth={1.5} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filtered.length} servicio{filtered.length !== 1 && "s"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" strokeWidth={1.5} />
                </Button>
                <span>
                  {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal
        open={!!confirmToggle}
        onOpenChange={(open) => { if (!open) setConfirmToggle(null) }}
        title={confirmToggle?.isActive ? "Desactivar servicio" : "Activar servicio"}
        description={
          confirmToggle?.isActive
            ? `¿Seguro que deseas desactivar "${confirmToggle?.name}"? Dejará de ser visible para los clientes.`
            : `¿Deseas volver a activar "${confirmToggle?.name}"?`
        }
      >
        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={() => setConfirmToggle(null)}>
            Cancelar
          </Button>
          <Button
            size="sm"
            disabled={togglingId === confirmToggle?.id}
            onClick={() => {
              if (confirmToggle) {
                const svc = confirmToggle
                setConfirmToggle(null)
                handleToggle(svc)
              }
            }}
          >
            {togglingId === confirmToggle?.id ? (
              <Loader2 className="mr-1 size-3 animate-spin" />
            ) : null}
            {confirmToggle?.isActive ? "Desactivar" : "Activar"}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
