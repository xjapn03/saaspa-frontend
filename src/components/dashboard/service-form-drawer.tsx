"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { CategorySelect, type CategoryOption } from "@/components/ui/category-select"
import { servicesApi } from "@/lib/services-api"
import type { Service, CreateServiceRequest } from "@/types/service"

interface ServiceFormDrawerProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export function ServiceFormDrawer({ service, open, onOpenChange, onSaved }: ServiceFormDrawerProps) {
  const isEditing = !!service
  const [form, setForm] = useState<CreateServiceRequest & { isActive?: boolean }>({
    name: "", description: "", price: 0, duration: 60, category: "", categoryId: "", imageUrl: "", isActive: true,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<CategoryOption[]>([])

  useEffect(() => {
    if (open) {
      fetch(`${API_BASE}/api/categories/tree`).then(r => r.json()).then(setCategories).catch(() => {})
    }
  }, [open])

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name, description: service.description || "", price: service.price,
        duration: service.duration, category: service.category || "", categoryId: service.categoryId || "",
        imageUrl: service.imageUrl || "", isActive: service.isActive,
      })
    } else {
      setForm({ name: "", description: "", price: 0, duration: 60, category: "", categoryId: "", imageUrl: "", isActive: true })
    }
    setError("")
  }, [service, open])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({ ...prev, [name]: type === "number" ? Number(value) : value }))
  }

  async function handleSave() {
    setError("")
    setIsSaving(true)
    try {
      const data: any = { ...form }
      if (!data.categoryId) data.categoryId = null
      if (isEditing && service) await servicesApi.update(service.id, data)
      else await servicesApi.create(data as CreateServiceRequest)
      onSaved()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (Array.isArray(err.message) ? err.message[0] : err.message) : "Error al guardar"
      setError(String(msg))
    } finally { setIsSaving(false) }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={isEditing ? "Editar servicio" : "Nuevo servicio"} description={isEditing ? "Modifica los datos del servicio." : "Crea un nuevo servicio para ofrecer a tus clientes."}>
      {error && (<div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>)}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Facial Hidratante Premium" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Categoría</label>
          <CategorySelect value={form.categoryId || ""} onChange={(v) => setForm((p) => ({ ...p, categoryId: v }))} options={categories} placeholder="Seleccionar categoría..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Precio (COP)</label>
            <input name="price" type="number" min={0} value={form.price} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Duración (min)</label>
            <input name="duration" type="number" min={1} value={form.duration} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe el servicio en 1-2 líneas..." className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors resize-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        {isEditing && (
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div><p className="text-sm font-medium text-foreground">Estado</p><p className="text-xs text-muted-foreground">{form.isActive ? "Visible en el sitio público" : "Oculto del sitio público"}</p></div>
            <button type="button" role="switch" aria-checked={form.isActive} onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-muted"}`}>
              <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        )}
      </div>
      <div className="mt-8">
        <Button className="w-full" size="lg" onClick={handleSave} disabled={isSaving}>{isSaving ? <Loader2 className="size-4 animate-spin" /> : isEditing ? "Guardar cambios" : "Crear servicio"}</Button>
      </div>
    </Modal>
  )
}
