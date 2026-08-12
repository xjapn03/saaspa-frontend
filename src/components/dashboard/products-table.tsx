"use client"

import { useState, useEffect, useCallback } from "react"
import { Pencil, Trash2, Search, Loader2, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { productsApi } from "@/lib/products-api"
import type { Product } from "@/types/product"

const ITEMS_PER_PAGE = 10

interface ProductsTableProps {
  onEdit: (product: Product) => void
  onNew: () => void
  refreshKey: number
}

export function ProductsTable({ onEdit, onNew, refreshKey }: ProductsTableProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await productsApi.list({ limit: 100 })
      setProducts(result.data)
    } catch (err: unknown) {
      setError("Error al cargar productos")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts() }, [fetchProducts, refreshKey])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Desactivar "${name}"?`)) return
    setDeletingId(id)
    try {
      await productsApi.remove(id)
      await fetchProducts()
    } catch {
      alert("Error al desactivar producto")
    } finally {
      setDeletingId(null)
    }
  }

  const formatPrice = (p: number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(p)

  const filtered = products.filter((p) => {
    const q = search.toLowerCase()
    return p.name.toLowerCase().includes(q) || (p.sponsor && p.sponsor.toLowerCase().includes(q)) || (p.sku && p.sku.toLowerCase().includes(q))
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
  if (error) return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center"><p className="text-sm text-destructive">{error}</p></div>

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Buscar por nombre, marca o SKU..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <Button size="sm" onClick={onNew}>
          <Plus className="mr-1 size-4" /> Nuevo
        </Button>
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">{search ? "Sin resultados." : "No hay productos."}</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Producto</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Marca</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Precio</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Stock</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Estado</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.mainImage && <img src={p.mainImage} alt="" className="size-10 rounded-lg object-cover" />}
                        <div>
                          <p className="font-medium text-foreground">{p.name}</p>
                          {p.category && <p className="text-xs text-muted-foreground">{p.category.name}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.sponsor || "—"}</td>
                    <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                    <td className="hidden px-4 py-3 md:table-cell">
                      <Badge variant={p.stock > 0 ? "outline" : "destructive"}>{p.stock}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={p.isActive ? "outline" : "secondary"}>{p.isActive ? "Activo" : "Inactivo"}</Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(p)} title="Editar"><Pencil className="size-4" strokeWidth={1.5} /></Button>
                        <Button variant="ghost" size="icon-sm" disabled={deletingId === p.id} onClick={() => handleDelete(p.id, p.name)} title="Desactivar">
                          {deletingId === p.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" strokeWidth={1.5} />}
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
              <span>{filtered.length} productos</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon-sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="size-4" /></Button>
                <span>{page} de {totalPages}</span>
                <Button variant="outline" size="icon-sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="size-4" /></Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
