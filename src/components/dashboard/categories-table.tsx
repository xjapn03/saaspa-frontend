"use client"

import { useState, useEffect, useCallback } from "react"
import { Pencil, Trash2, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categoriesApi, type Category } from "@/lib/categories-api"

const ITEMS_PER_PAGE = 15

interface CategoriesTableProps {
  onEdit: (category: Category) => void
  onNew: () => void
  refreshKey: number
}

export function CategoriesTable({ onEdit, onNew, refreshKey }: CategoriesTableProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchCategories = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await categoriesApi.list()
      setCategories(result.data)
    } catch {
      setError("Error al cargar categorías")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchCategories() }, [fetchCategories, refreshKey])

  async function handleDelete(id: string, name: string) {
    if (!confirm(`¿Desactivar la categoría "${name}"? Los servicios y productos asociados no se eliminarán.`)) return
    setDeletingId(id)
    try {
      await categoriesApi.remove(id)
      await fetchCategories()
    } catch {
      alert("Error al desactivar categoría")
    } finally {
      setDeletingId(null)
    }
  }

  const activeCategories = categories.filter((c) => c.isActive)
  const totalPages = Math.max(1, Math.ceil(activeCategories.length / ITEMS_PER_PAGE))
  const paged = activeCategories.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE)

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="size-6 animate-spin text-muted-foreground" /></div>
  if (error) return <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center"><p className="text-sm text-destructive">{error}</p></div>

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Button size="sm" onClick={onNew}>Nueva categoría</Button>
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">No hay categorías registradas.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">Slug</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">Descripción</th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Subcat.</th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((c) => (
                  <tr key={c.id} className="transition-colors hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground text-xs sm:table-cell">{c.slug}</td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell max-w-[200px] truncate">{c.description || "—"}</td>
                    <td className="px-4 py-3">
                      {c.parentId ? (
                        <Badge variant="secondary">Sub</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon-sm" onClick={() => onEdit(c)} title="Editar"><Pencil className="size-4" strokeWidth={1.5} /></Button>
                        <Button variant="ghost" size="icon-sm" disabled={deletingId === c.id} onClick={() => handleDelete(c.id, c.name)} title="Desactivar">
                          {deletingId === c.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" strokeWidth={1.5} />}
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
              <span>{activeCategories.length} categorías</span>
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
