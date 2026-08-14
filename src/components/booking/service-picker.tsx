"use client"

import { useState, useEffect, useCallback } from "react"
import { Loader2, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { servicesApi } from "@/lib/services-api"
import type { Service } from "@/types/service"

interface ServicePickerProps {
  onSelect: (service: Service) => void
  selectedId?: string
}

export function ServicePicker({ onSelect, selectedId }: ServicePickerProps) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchServices = useCallback(async () => {
    try {
      const data = await servicesApi.listPublic()
      setServices(data.data)
    } catch (err: unknown) {
      setError("Error al cargar servicios")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(p)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-3" onClick={fetchServices}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <p className="text-sm text-muted-foreground">No hay servicios disponibles.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((svc) => {
        const isSelected = svc.id === selectedId
        return (
          <button
            key={svc.id}
            onClick={() => onSelect(svc)}
            className={`text-left rounded-2xl border p-5 transition-all ${
              isSelected
                ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                : "border-border bg-card hover:border-primary/50 hover:shadow-sm"
            }`}
          >
            <Badge variant="secondary" className="mb-2">
              {svc.categoryRel?.name || "General"}
            </Badge>
            <p className="font-heading text-lg font-semibold">{svc.name}</p>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {svc.description || `${svc.duration} min de tratamiento`}
            </p>
            <div className="mt-3 flex items-center justify-between">
              <p className="font-heading text-lg font-semibold">
                {formatPrice(svc.price)}
              </p>
              <span className="text-xs text-muted-foreground">{svc.duration} min</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
