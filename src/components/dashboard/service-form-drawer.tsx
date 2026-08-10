"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { servicesApi } from "@/lib/services-api"
import type { Service, CreateServiceRequest } from "@/types/service"

interface ServiceFormDrawerProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function ServiceFormDrawer({
  service,
  open,
  onOpenChange,
  onSaved,
}: ServiceFormDrawerProps) {
  const isEditing = !!service
  const [form, setForm] = useState<CreateServiceRequest & { isActive?: boolean }>({
    name: "",
    description: "",
    price: 0,
    duration: 60,
    category: "",
    imageUrl: "",
    isActive: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name,
        description: service.description || "",
        price: service.price,
        duration: service.duration,
        category: service.category || "",
        imageUrl: service.imageUrl || "",
        isActive: service.isActive,
      })
    } else {
      setForm({
        name: "",
        description: "",
        price: 0,
        duration: 60,
        category: "",
        imageUrl: "",
        isActive: true,
      })
    }
    setError("")
  }, [service, open])

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }))
  }

  async function handleSave() {
    setError("")
    setIsSaving(true)
    try {
      if (isEditing && service) {
        await servicesApi.update(service.id, form)
      } else {
        await servicesApi.create(form as CreateServiceRequest)
      }
      onSaved()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al guardar"
      setError(String(msg))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md pt-14 overflow-auto">
        <SheetHeader>
          <SheetTitle className="font-heading text-xl font-semibold">
            {isEditing ? "Editar servicio" : "Nuevo servicio"}
          </SheetTitle>
          <SheetDescription>
            {isEditing
              ? "Modifica los datos del servicio."
              : "Crea un nuevo servicio para ofrecer a tus clientes."}
          </SheetDescription>
        </SheetHeader>

        <Separator className="my-6" />

        {error && (
          <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Nombre
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Facial Hidratante Premium"
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Categoría
            </label>
            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Facial, Corporal, Capilar..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Precio (COP)
              </label>
              <input
                name="price"
                type="number"
                min={0}
                step={1000}
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Duración (min)
              </label>
              <input
                name="duration"
                type="number"
                min={1}
                step={5}
                value={form.duration}
                onChange={handleChange}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Descripción
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Describe el servicio en 1-2 líneas..."
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors resize-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {isEditing && (
            <div className="flex items-center justify-between rounded-xl border border-border p-4">
              <div>
                <p className="text-sm font-medium text-foreground">Estado</p>
                <p className="text-xs text-muted-foreground">
                  {form.isActive
                    ? "Visible en el sitio público"
                    : "Oculto del sitio público"}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={form.isActive}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: !prev.isActive,
                  }))
                }
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                  form.isActive ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${
                    form.isActive ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          )}
        </div>

        <div className="mt-8">
          <Button
            className="w-full"
            size="lg"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <Loader2 className="size-4 animate-spin" />
            ) : isEditing ? (
              "Guardar cambios"
            ) : (
              "Crear servicio"
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
