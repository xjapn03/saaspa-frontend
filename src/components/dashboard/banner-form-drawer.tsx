"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { NumericInput } from "@/components/ui/numeric-input"
import { bannersApi } from "@/lib/banners-api"
import { uploadImage } from "@/lib/upload"
import { useToast } from "@/context/toast-provider"
import type { Banner, BannerPosition } from "@/types/banner"

interface BannerFormDrawerProps {
  banner: Banner | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

function generateFolderKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID()
  return `banner-${Date.now()}-${Math.round(Math.random() * 1e9)}`
}

function toLocalDateTimeInput(iso: string | null): string {
  if (!iso) return ""
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ""
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function BannerFormDrawer({ banner, open, onOpenChange, onSaved }: BannerFormDrawerProps) {
  const isEditing = !!banner
  const { success: showSuccess, error: showError } = useToast()
  const [form, setForm] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    ctaText: "",
    ctaLink: "",
    position: "HERO" as BannerPosition,
    sortOrder: "",
    isActive: true,
    startsAt: "",
    endsAt: "",
  })
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState("")
  const [folderKey, setFolderKey] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (banner) {
      setForm({
        title: banner.title || "",
        subtitle: banner.subtitle || "",
        imageUrl: banner.imageUrl || "",
        ctaText: banner.ctaText || "",
        ctaLink: banner.ctaLink || "",
        position: banner.position,
        sortOrder: String(banner.sortOrder),
        isActive: banner.isActive,
        startsAt: toLocalDateTimeInput(banner.startsAt),
        endsAt: toLocalDateTimeInput(banner.endsAt),
      })
      const match = (banner.imageUrl || "").match(/\/banners\/([^/]+)\//)
      setFolderKey(match ? match[1] : generateFolderKey())
    } else {
      setForm({
        title: "", subtitle: "", imageUrl: "", ctaText: "", ctaLink: "",
        position: "HERO", sortOrder: "", isActive: true, startsAt: "", endsAt: "",
      })
      setFolderKey(generateFolderKey())
    }
    setError("")
  }, [banner, open])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const url = await uploadImage(file, `banners/${folderKey}`, "main")
      setForm((prev) => ({ ...prev, imageUrl: url }))
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al subir la imagen")
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    setError("")
    if (!form.imageUrl) {
      setError("La imagen es obligatoria")
      return
    }
    setIsSaving(true)
    try {
      const payload: any = {
        title: form.title || undefined,
        subtitle: form.subtitle || undefined,
        imageUrl: form.imageUrl,
        ctaText: form.ctaText || undefined,
        ctaLink: form.ctaLink || undefined,
        position: form.position,
        sortOrder: parseInt(form.sortOrder, 10) || 0,
        isActive: form.isActive,
        startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined,
      }
      if (isEditing && banner) await bannersApi.update(banner.id, payload)
      else await bannersApi.create(payload)
      onSaved()
      onOpenChange(false)
      showSuccess(isEditing ? "Banner actualizado" : "Banner creado")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al guardar"
      setError(String(msg))
      showError(String(msg))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={isEditing ? "Editar banner" : "Nuevo banner"} description="Sube una imagen de campaña o promoción para el home.">
      {error && <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Título</label>
          <input name="title" value={form.title} onChange={handleChange} placeholder="Halloween en Kamerinos" className={inputCls} />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Subtítulo</label>
          <input name="subtitle" value={form.subtitle} onChange={handleChange} placeholder="20% de descuento en faciales" className={inputCls} />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Imagen</label>
          {form.imageUrl ? (
            <div className="relative inline-block">
              <img src={form.imageUrl} alt="Preview" className="h-40 w-full max-w-sm rounded-xl object-cover border border-border" />
              <button onClick={() => setForm((p) => ({ ...p, imageUrl: "" }))} className="absolute -top-2 -right-2 size-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"><X className="size-3" /></button>
            </div>
          ) : (
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                {uploading ? <Loader2 className="mr-2 size-3 animate-spin" /> : <Upload className="mr-2 size-3" />}
                Subir imagen
              </Button>
            </div>
          )}
          <p className="text-xs text-muted-foreground">Recomendado: 1920×1080 (hero) o 1920×500 (banda), formato WebP/JPEG.</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Posición</label>
            <select name="position" value={form.position} onChange={handleChange} className={inputCls}>
              <option value="HERO">Hero (portada)</option>
              <option value="STRIP">Banda intermedia</option>
              <option value="PORTRAIT">Retrato (home)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Orden</label>
            <NumericInput value={form.sortOrder} onChange={(v) => setForm((p) => ({ ...p, sortOrder: v }))} min={0} placeholder="0" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Texto del botón</label>
            <input name="ctaText" value={form.ctaText} onChange={handleChange} placeholder="Ver promoción" className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Enlace del botón</label>
            <input name="ctaLink" value={form.ctaLink} onChange={handleChange} placeholder="/servicios" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Vigencia desde</label>
            <input name="startsAt" type="datetime-local" value={form.startsAt} onChange={handleChange} className={inputCls} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Vigencia hasta</label>
            <input name="endsAt" type="datetime-local" value={form.endsAt} onChange={handleChange} className={inputCls} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border p-4">
          <div>
            <p className="text-sm font-medium text-foreground">Activo</p>
            <p className="text-xs text-muted-foreground">{form.isActive ? "Visible en el home" : "Oculto"}</p>
          </div>
          <button type="button" role="switch" aria-checked={form.isActive} onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-muted"}`}>
            <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>
      <div className="mt-8">
        <Button className="w-full" size="lg" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : isEditing ? "Guardar cambios" : "Crear banner"}
        </Button>
      </div>
    </Modal>
  )
}
