"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Separator } from "@/components/ui/separator"
import { CategorySelect, type CategoryOption } from "@/components/ui/category-select"
import { NumericInput } from "@/components/ui/numeric-input"
import { servicesApi } from "@/lib/services-api"
import { API_BASE_URL } from "@/lib/constants"
import { uploadImage } from "@/lib/upload"
import { useToast } from "@/context/toast-provider"
import type { Service, CreateServiceRequest } from "@/types/service"

interface ServiceFormDrawerProps {
  service: Service | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

interface ServiceFormState {
  name: string
  description: string
  price: string
  compareAtPrice: string
  duration: string
  categoryId: string
  imageUrl: string
  mainImage: string
  carouselImages: string[]
  isActive: boolean
  isFeatured: boolean
}

export function ServiceFormDrawer({ service, open, onOpenChange, onSaved }: ServiceFormDrawerProps) {
  const isEditing = !!service
  const { success: showSuccess, error: showError } = useToast()
  const [form, setForm] = useState<ServiceFormState>({
    name: "", description: "", price: "", compareAtPrice: "", duration: "60",
    categoryId: "", imageUrl: "", mainImage: "", carouselImages: [], isActive: true, isFeatured: false,
  })
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState<"main" | "carousel" | null>(null)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const mainFileRef = useRef<HTMLInputElement>(null)
  const carouselFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/api/categories/tree`).then(r => r.json()).then(setCategories).catch(() => {})
    }
  }, [open])

  useEffect(() => {
    if (service) {
      setForm({
        name: service.name, description: service.description || "", price: String(service.price),
        compareAtPrice: service.compareAtPrice ? String(service.compareAtPrice) : "", duration: String(service.duration),
        categoryId: service.categoryId || "", imageUrl: service.imageUrl || "",
        mainImage: service.mainImage || "", carouselImages: service.carouselImages || [],
        isActive: service.isActive, isFeatured: service.isFeatured,
      })
    } else {
      setForm({ name: "", description: "", price: "", compareAtPrice: "", duration: "60", categoryId: "", imageUrl: "", mainImage: "", carouselImages: [], isActive: true, isFeatured: false })
    }
    setError("")
  }, [service, open])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function uploadImageFile(file: File, type: "main" | "gallery"): Promise<string | null> {
    const folderKey = form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "servicio"
    try {
      return await uploadImage(file, `services/${folderKey}`, type)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen")
      return null
    }
  }

  async function handleMainUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading("main")
    const url = await uploadImageFile(file, "main")
    if (url) setForm(prev => ({ ...prev, mainImage: url }))
    setUploading(null)
  }

  async function handleCarouselUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading("carousel")
    const url = await uploadImageFile(file, "gallery")
    if (url) setForm(prev => ({ ...prev, carouselImages: [...prev.carouselImages, url] }))
    setUploading(null)
  }

  function removeCarouselImage(index: number) {
    setForm(prev => ({ ...prev, carouselImages: prev.carouselImages.filter((_, i) => i !== index) }))
  }

  async function handleSave() {
    setError("")
    setIsSaving(true)
    try {
      const priceNum = parseInt(form.price, 10)
      const durationNum = parseInt(form.duration, 10)
      if (!form.name || isNaN(priceNum) || priceNum <= 0) {
        setError("Completa nombre y un precio válido (mayor a 0)")
        setIsSaving(false)
        return
      }
      if (isNaN(durationNum) || durationNum < 1) {
        setError("La duración debe ser al menos 1 minuto")
        setIsSaving(false)
        return
      }
      const compareAtNum = form.compareAtPrice ? parseInt(form.compareAtPrice, 10) : undefined
      const data: any = {
        ...form,
        price: priceNum,
        duration: durationNum,
        compareAtPrice: compareAtNum && !isNaN(compareAtNum) ? compareAtNum : undefined,
      }
      if (!data.categoryId) data.categoryId = null
      data.carouselImages = data.carouselImages.length > 0 ? data.carouselImages : undefined
      if (isEditing && service) await servicesApi.update(service.id, data)
      else await servicesApi.create(data as CreateServiceRequest)
      onSaved()
      onOpenChange(false)
      showSuccess(isEditing ? "Servicio actualizado" : "Servicio creado")
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (Array.isArray(err.message) ? err.message[0] : err.message) : "Error al guardar"
      setError(String(msg))
      showError(String(msg))
    } finally { setIsSaving(false) }
  }

  const inputCls = "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={isEditing ? "Editar servicio" : "Nuevo servicio"} description={isEditing ? "Modifica los datos del servicio." : "Crea un nuevo servicio para ofrecer a tus clientes."}>
      {error && (<div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>)}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Nombre</label>
          <input name="name" value={form.name} onChange={handleChange} placeholder="Facial Hidratante Premium" className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Categoría</label>
          <CategorySelect value={form.categoryId || ""} onChange={(v) => setForm((p) => ({ ...p, categoryId: v }))} options={categories} placeholder="Seleccionar categoría..." />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Precio (COP)</label>
            <NumericInput value={form.price} onChange={(v) => setForm((p) => ({ ...p, price: v }))} min={0} placeholder="85000" className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Precio anterior (COP)</label>
            <NumericInput value={form.compareAtPrice} onChange={(v) => setForm((p) => ({ ...p, compareAtPrice: v }))} min={0} placeholder="Opcional" className={inputCls} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Duración (min)</label>
            <NumericInput value={form.duration} onChange={(v) => setForm((p) => ({ ...p, duration: v }))} min={1} className={inputCls} />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Describe el servicio en 1-2 líneas..." className={`${inputCls} resize-none`} />
        </div>

        <Separator />

        <div>
          <p className="text-sm font-medium text-foreground mb-3">Imagen principal</p>
          {form.mainImage ? (
            <div className="relative inline-block">
              <img src={form.mainImage} alt="Preview" className="size-32 rounded-xl object-cover border border-border" />
              <button onClick={() => setForm(p => ({ ...p, mainImage: "" }))} className="absolute -top-2 -right-2 size-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="size-3" /></button>
            </div>
          ) : (
            <div>
              <input ref={mainFileRef} type="file" accept="image/*" onChange={handleMainUpload} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => mainFileRef.current?.click()} disabled={uploading === "main"}>
                {uploading === "main" ? <Loader2 className="mr-2 size-3 animate-spin" /> : <Upload className="mr-2 size-3" />}
                Subir imagen
              </Button>
            </div>
          )}
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-3">Galería de imágenes</p>
          <div className="flex flex-wrap gap-3">
            {form.carouselImages.map((url, i) => (
              <div key={i} className="relative">
                <img src={url} alt={`Carousel ${i + 1}`} className="size-20 rounded-lg object-cover border border-border" />
                <button onClick={() => removeCarouselImage(i)} className="absolute -top-2 -right-2 size-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="size-2.5" /></button>
              </div>
            ))}
            <input ref={carouselFileRef} type="file" accept="image/*" onChange={handleCarouselUpload} className="hidden" />
            <button onClick={() => carouselFileRef.current?.click()} disabled={uploading === "carousel"} className="flex size-20 items-center justify-center rounded-lg border-2 border-dashed border-border text-muted-foreground hover:border-primary/50 hover:text-primary/50 transition-colors">
              {uploading === "carousel" ? <Loader2 className="size-5 animate-spin" /> : <Plus className="size-5" />}
            </button>
          </div>
        </div>

        <Separator />

        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div><p className="text-sm font-medium text-foreground">Estado</p><p className="text-xs text-muted-foreground">{form.isActive ? "Visible en el sitio público" : "Oculto del sitio público"}</p></div>
          <button type="button" role="switch" aria-checked={form.isActive} onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-muted"}`}>
            <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div><p className="text-sm font-medium text-foreground">Destacado en el home</p><p className="text-xs text-muted-foreground">{form.isFeatured ? "Se muestra en rituales destacados" : "Solo aparece en el listado general"}</p></div>
          <button type="button" role="switch" aria-checked={form.isFeatured} onClick={() => setForm((prev) => ({ ...prev, isFeatured: !prev.isFeatured }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isFeatured ? "bg-primary" : "bg-muted"}`}>
            <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isFeatured ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
      <div className="mt-8">
        <Button className="w-full" size="lg" onClick={handleSave} disabled={isSaving}>{isSaving ? <Loader2 className="size-4 animate-spin" /> : isEditing ? "Guardar cambios" : "Crear servicio"}</Button>
      </div>
    </Modal>
  )
}
