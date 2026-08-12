"use client"

import { useState, useEffect } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Separator } from "@/components/ui/separator"
import { categoriesApi, type Category } from "@/lib/categories-api"
import { useToast } from "@/context/toast-provider"

interface CategoryFormDrawerProps {
  category: Category | null
  allCategories: Category[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  imageUrl: "",
  parentId: "",
  isActive: true,
}

export function CategoryFormDrawer({ category, allCategories, open, onOpenChange, onSaved }: CategoryFormDrawerProps) {
  const isCreating = !category
  const { success: showSuccess, error: showError } = useToast()
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const parentCategories = allCategories.filter((c) => !c.parentId && c.isActive && c.id !== category?.id)

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        imageUrl: category.imageUrl || "",
        parentId: category.parentId || "",
        isActive: category.isActive,
      })
    } else {
      setForm({ ...EMPTY_FORM })
    }
    setError("")
  }, [category, open])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleSlugFromName() {
    if (!form.slug && form.name) {
      setForm((prev) => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }))
    }
  }

  async function handleSave() {
    if (!form.name || !form.slug) {
      setError("Nombre y slug son requeridos")
      return
    }
    setError("")
    setIsSaving(true)
    try {
      if (isCreating) {
        await categoriesApi.create({
          name: form.name,
          slug: form.slug,
          description: form.description || undefined,
          imageUrl: form.imageUrl || undefined,
          parentId: form.parentId || undefined,
        })
      } else {
        await categoriesApi.update(category!.id, {
          name: form.name,
          slug: form.slug,
          description: form.description || undefined,
          imageUrl: form.imageUrl || undefined,
          parentId: form.parentId || null,
          isActive: form.isActive,
        })
      }
      onSaved()
      onOpenChange(false)
      showSuccess(isCreating ? "Categoría creada" : "Categoría actualizada")
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray((err as any).message) ? (err as any).message[0] : (err as any).message
        : "Error al guardar categoría"
      setError(String(msg))
      showError(String(msg))
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={isCreating ? "Nueva categoría" : "Editar categoría"} description={isCreating ? "Crea una categoría para organizar servicios y productos." : "Modifica los datos de la categoría."}>
      {error && <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} onBlur={handleSlugFromName} placeholder="Ej: Cremas" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="cremas" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Breve descripción de la categoría..." className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Categoría padre (subcategoría)</label>
          <select name="parentId" value={form.parentId} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
            <option value="">Sin padre (categoría principal)</option>
            {parentCategories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
          </select>
        </div>
        {!isCreating && (
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div><p className="text-sm font-medium text-foreground">Activa</p><p className="text-xs text-muted-foreground">{form.isActive ? "Visible en la tienda" : "Oculta"}</p></div>
            <button type="button" role="switch" aria-checked={form.isActive} onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-muted"}`}>
              <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button className="w-full" size="lg" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : isCreating ? "Crear categoría" : "Guardar cambios"}
        </Button>
      </div>
    </Modal>
  )
}
