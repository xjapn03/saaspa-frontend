"use client"

import { useAuth } from "@/context/auth-provider"
import { OrdersTable } from "@/components/dashboard/orders-table"
import { MyOrders } from "@/components/dashboard/my-orders"

export default function PedidosPage() {
  const { user } = useAuth()
  const isAdmin = user?.role === "ADMIN" || user?.role === "EMPLEADO"

  if (isAdmin) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-semibold text-foreground">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gestión de pedidos de la tienda. Cambia el estado según el progreso del envío.
          </p>
        </div>
        <OrdersTable />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Mis pedidos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Historial de tus compras en Kamerinos by Sandra Pinzon.
        </p>
      </div>
      <MyOrders showTitle={false} />
    </div>
  )
}
