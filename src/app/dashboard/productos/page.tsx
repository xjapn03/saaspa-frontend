"use client"

import { useState } from "react"
import { ProductsTable } from "@/components/dashboard/products-table"

export default function ProductosDashboard() {
  const [refresh, setRefresh] = useState(0)

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Productos</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestiona el catálogo de la tienda</p>
        </div>
      </div>
      <ProductsTable onEdit={() => {}} onNew={() => {}} refreshKey={refresh} />
    </div>
  )
}
