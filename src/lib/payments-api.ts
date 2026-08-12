import type { PaymentInitResponse, BalanceResponse } from "@/types/payment"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export interface PaymentTransaction {
  id: string
  bookingId: string | null
  userId: string
  amount: number
  type: "ABONO" | "SALDO"
  status: "PENDIENTE" | "APROBADO" | "RECHAZADO" | "REEMBOLSADO"
  wompiPaymentId: string | null
  wompiReference: string | null
  paidAt: string | null
  createdAt: string
  updatedAt: string
  metadata?: any
  user?: { firstName: string; lastName: string; email: string }
  booking?: { id: string; startTime: string; service: { name: string } | null }
  order?: { id: string; total: number } | null
}

export interface PaymentTransactionFilters {
  search?: string
  type?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente", APROBADO: "Aprobado", RECHAZADO: "Rechazado", REEMBOLSADO: "Reembolsado",
}

export const PAYMENT_STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDIENTE: "secondary", APROBADO: "default", RECHAZADO: "destructive", REEMBOLSADO: "outline",
}

export const PAYMENT_TYPE_LABELS: Record<string, string> = {
  ABONO: "Abono", SALDO: "Saldo",
}

export const paymentsApi = {
  async init(bookingId: string, type: "ABONO" | "SALDO" = "ABONO"): Promise<PaymentInitResponse> {
    return api.post<PaymentInitResponse>(ENDPOINTS.PAYMENTS.INIT, { bookingId, type })
  },

  async getStatus(bookingId: string): Promise<BalanceResponse> {
    return api.get<BalanceResponse>(ENDPOINTS.BOOKINGS.BALANCE(bookingId))
  },

  async initCart(items: { productId: string; name: string; price: number; quantity: number }[], couponCode?: string, couponId?: string, shipping?: { shippingName?: string; shippingEmail?: string; shippingPhone?: string; shippingAddress?: string; shippingCity?: string; shippingNotes?: string }): Promise<PaymentInitResponse> {
    return api.post<PaymentInitResponse>(ENDPOINTS.PAYMENTS.INIT_CART, { items, couponCode, couponId, ...shipping })
  },

  async listTransactions(filters?: PaymentTransactionFilters): Promise<PaymentTransaction[]> {
    const params = new URLSearchParams()
    if (filters?.search) params.set("search", filters.search)
    if (filters?.type) params.set("type", filters.type)
    if (filters?.status) params.set("status", filters.status)
    if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom)
    if (filters?.dateTo) params.set("dateTo", filters.dateTo)
    const qs = params.toString()
    return api.get<PaymentTransaction[]>(ENDPOINTS.PAYMENTS.TRANSACTIONS + (qs ? `?${qs}` : ""))
  },
}
