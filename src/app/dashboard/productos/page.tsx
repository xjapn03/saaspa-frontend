"use client"

import { useState, useCallback } from "react"
import { ProductsTable } from "@/components/dashboard/products-table"
import { ProductFormDrawer } from "@/components/dashboard/product-form-drawer"
import type { Product } from "@/types/product"

export default function ProductosDashboard() {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const handleEdit = useCallback((product: Product) => {
    setEditingProduct(product)
    setDrawerOpen(true)
  }, [])

  const handleNew = useCallback(() => {
    setEditingProduct(null)
    setDrawerOpen(true)
  }, [])

  const handleSaved = useCallback(() => {
    setDrawerOpen(false)
    setEditingProduct(null)
    setRefresh(r => r + 1)
  }, [])

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Productos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestiona el catálogo de la tienda</p>
        </div>
      </div>
      <ProductsTable onEdit={handleEdit} onNew={handleNew} refreshKey={refresh} />
      <ProductFormDrawer product={editingProduct} open={drawerOpen} onOpenChange={setDrawerOpen} onSaved={handleSaved} />
    </div>
  )
}
