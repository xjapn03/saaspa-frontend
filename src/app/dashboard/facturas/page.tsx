"use client"

import { PaymentsTable } from "@/components/dashboard/payments-table"

export default function FacturasPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Facturación</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Trazabilidad de todas las transacciones: abonos, pagos de saldo y compras de tienda.
        </p>
      </div>
      <PaymentsTable />
    </div>
  )
}
