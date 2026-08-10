"use client"

import { CouponsTable } from "@/components/dashboard/coupons-table"

export default function CuponesPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          Cupones
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Crea y gestiona cupones de descuento. Los códigos se validan al momento del pago.
        </p>
      </div>

      <CouponsTable />
    </div>
  )
}
