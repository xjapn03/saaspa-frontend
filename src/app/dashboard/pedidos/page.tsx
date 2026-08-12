"use client"

import { OrdersTable } from "@/components/dashboard/orders-table"

export default function PedidosPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gestión de pedidos de la tienda. Cambia el estado según el progreso del envío.</p>
      </div>
      <OrdersTable />
    </div>
  )
}
