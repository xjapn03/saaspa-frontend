"use client"

import { useState, useEffect, useRef } from "react"
import { Loader2, Upload, X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Separator } from "@/components/ui/separator"
import { CategorySelect, type CategoryOption } from "@/components/ui/category-select"
import { productsApi } from "@/lib/products-api"
import { API_BASE_URL } from "@/lib/constants"
import { useToast } from "@/context/toast-provider"
import type { Product } from "@/types/product"

interface ProductFormDrawerProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const EMPTY_FORM = {
  name: "",
  slug: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stock: "0",
  sku: "",
  sponsor: "",
  categoryId: "",
  mainImage: "",
  carouselImages: [] as string[],
  isActive: true,
  isFeatured: false,
}

interface Category {
  id: string
  name: string
  slug: string
}

export function ProductFormDrawer({ product, open, onOpenChange, onSaved }: ProductFormDrawerProps) {
  const isCreating = !product
  const { success: showSuccess, error: showError } = useToast()
  const [form, setForm] = useState({ ...EMPTY_FORM })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState<CategoryOption[]>([])
  const [uploading, setUploading] = useState<"main" | "carousel" | null>(null)
  const mainFileRef = useRef<HTMLInputElement>(null)
  const carouselFileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      fetch(`${API_BASE_URL}/api/categories/tree`).then(r => r.json()).then(setCategories).catch(() => {})
    }
  }, [open])

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        slug: product.slug,
        description: product.description || "",
        price: String(product.price),
        compareAtPrice: product.compareAtPrice ? String(product.compareAtPrice) : "",
        stock: String(product.stock),
        sku: product.sku || "",
        sponsor: product.sponsor || "",
        categoryId: product.categoryId || "",
        mainImage: product.mainImage || "",
        carouselImages: product.carouselImages || [],
        isActive: product.isActive,
        isFeatured: product.isFeatured,
      })
    } else {
      setForm({ ...EMPTY_FORM })
    }
    setError("")
  }, [product, open])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function handleSlugFromName() {
    if (!form.slug && form.name) {
      setForm(prev => ({
        ...prev,
        slug: prev.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      }))
    }
  }

  async function uploadImage(file: File, type: "main" | "gallery"): Promise<string | null> {
    const folderKey = form.slug || form.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") || "producto"
    const params = new URLSearchParams({ folder: `products/${folderKey}`, imageType: type })
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch(`${API_BASE_URL}/api/upload?${params.toString()}`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      return data.url
    } catch {
      setError("Error al subir la imagen")
      return null
    }
  }

  async function handleMainUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading("main")
    const url = await uploadImage(file, "main")
    if (url) setForm(prev => ({ ...prev, mainImage: url }))
    setUploading(null)
  }

  async function handleCarouselUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading("carousel")
    const url = await uploadImage(file, "gallery")
    if (url) setForm(prev => ({ ...prev, carouselImages: [...prev.carouselImages, url] }))
    setUploading(null)
  }

  function removeCarouselImage(index: number) {
    setForm(prev => ({ ...prev, carouselImages: prev.carouselImages.filter((_, i) => i !== index) }))
  }

  async function handleSave() {
    const priceNum = parseInt(form.price, 10)
    if (!form.name || !form.slug || isNaN(priceNum) || priceNum <= 0) {
      setError("Completa los campos requeridos: nombre, slug y precio válido")
      return
    }
    setError("")
    setIsSaving(true)
    try {
      const payload: Record<string, unknown> = {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        price: priceNum,
        compareAtPrice: form.compareAtPrice ? parseInt(form.compareAtPrice, 10) : undefined,
        stock: parseInt(form.stock, 10) || 0,
        sku: form.sku || undefined,
        sponsor: form.sponsor || undefined,
        mainImage: form.mainImage || undefined,
        carouselImages: form.carouselImages.length > 0 ? form.carouselImages : undefined,
        isActive: form.isActive,
        isFeatured: form.isFeatured,
      }
      if (form.categoryId) payload.categoryId = form.categoryId

      if (isCreating) {
        await productsApi.create(payload)
      } else {
        await productsApi.update(product!.id, payload)
      }
      onSaved()
      onOpenChange(false)
      showSuccess(isCreating ? "Producto creado" : "Producto actualizado")
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err
        ? Array.isArray((err as any).message) ? (err as any).message[0] : (err as any).message
        : "Error al guardar producto"
      setError(String(msg))
      showError(String(msg))
    } finally {
      setIsSaving(false)
    }
  }

  const title = isCreating ? "Nuevo producto" : "Editar producto"
  const description = isCreating ? "Añade un producto al catálogo de la tienda." : "Modifica los datos del producto."

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <div className="space-y-5 max-h-[65vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nombre *</label>
            <input name="name" value={form.name} onChange={handleChange} onBlur={handleSlugFromName} placeholder="Crema Hidratante" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Slug *</label>
            <input name="slug" value={form.slug} onChange={handleChange} placeholder="crema-hidratante" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Descripción del producto..." className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Precio (COP) *</label>
            <input name="price" type="number" min="0" value={form.price} onChange={handleChange} placeholder="85000" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 [&::-webkit-inner-spin-button]:appearance-none" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Precio anterior</label>
            <input name="compareAtPrice" type="number" value={form.compareAtPrice} onChange={handleChange} placeholder="110000" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Stock</label>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">SKU</label>
            <input name="sku" value={form.sku} onChange={handleChange} placeholder="SKU-001" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Marca / Sponsor</label>
            <input name="sponsor" value={form.sponsor} onChange={handleChange} placeholder="Loreal" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Categoría</label>
          <CategorySelect value={form.categoryId} onChange={(v) => setForm(p => ({ ...p, categoryId: v }))} options={categories} placeholder="Sin categoría" />
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

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Producto activo</p>
            <p className="text-xs text-muted-foreground">{form.isActive ? "Visible en la tienda" : "Oculto de la tienda"}</p>
          </div>
          <button type="button" role="switch" aria-checked={form.isActive} onClick={() => setForm(p => ({ ...p, isActive: !p.isActive }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-muted"}`}>
            <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Producto destacado</p>
            <p className="text-xs text-muted-foreground">Aparece en la sección de destacados del home</p>
          </div>
          <button type="button" role="switch" aria-checked={form.isFeatured} onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isFeatured ? "bg-primary" : "bg-muted"}`}>
            <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isFeatured ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <Button className="w-full" size="lg" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : isCreating ? "Crear producto" : "Guardar cambios"}
        </Button>
      </div>
    </Modal>
  )
}
