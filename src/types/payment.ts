export type PaymentStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "REEMBOLSADO"

export interface Payment {
  id: string
  status: PaymentStatus
  amount: number
  paidAt: string | null
}

export interface PaymentInitResponse {
  publicKey: string
  reference: string
  amountInCents: number
  currency: string
  signature: string
}
