"use client"

import { useState, useCallback, useEffect } from "react"
import { CategoriesTable } from "@/components/dashboard/categories-table"
import { CategoryFormDrawer } from "@/components/dashboard/category-form-drawer"
import { categoriesApi, type Category } from "@/lib/categories-api"

export default function CategoriasPage() {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [allCategories, setAllCategories] = useState<Category[]>([])
  const [refresh, setRefresh] = useState(0)

  useEffect(() => { categoriesApi.list().then(r => setAllCategories(r.data)).catch(() => {}) }, [refresh])

  const handleEdit = useCallback((c: Category) => { setEditingCategory(c); setDrawerOpen(true) }, [])
  const handleNew = useCallback(() => { setEditingCategory(null); setDrawerOpen(true) }, [])
  const handleSaved = useCallback(() => { setDrawerOpen(false); setEditingCategory(null); setRefresh((r) => r + 1) }, [])

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Categorías</h1>
        <p className="mt-1 text-sm text-muted-foreground">Organiza servicios y productos en categorías y subcategorías.</p>
      </div>
      <CategoriesTable onEdit={handleEdit} onNew={handleNew} refreshKey={refresh} />
      <CategoryFormDrawer category={editingCategory} allCategories={allCategories} open={drawerOpen} onOpenChange={setDrawerOpen} onSaved={handleSaved} />
    </div>
  )
}
