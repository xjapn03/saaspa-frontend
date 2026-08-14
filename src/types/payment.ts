export type PaymentStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO" | "REEMBOLSADO"

export type PaymentType = "ABONO" | "SALDO"

export interface Payment {
  id: string
  type: PaymentType
  status: PaymentStatus
  amount: number
  paidAt: string | null
  wompiReference?: string | null
}

export interface BalanceResponse {
  payments: Payment[]
  total: number
  paid: number
  remaining: number
}

export interface PaymentInitResponse {
  publicKey: string
  reference: string
  amountInCents: number
  currency: string
  signature: string
}
