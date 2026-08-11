import type { PaymentInitResponse, BalanceResponse } from "@/types/payment"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const paymentsApi = {
  async init(bookingId: string, type: "ABONO" | "SALDO" = "ABONO"): Promise<PaymentInitResponse> {
    return api.post<PaymentInitResponse>("/api/payments/init", { bookingId, type })
  },

  async getStatus(bookingId: string): Promise<BalanceResponse> {
    return api.get<BalanceResponse>(ENDPOINTS.BOOKINGS.BALANCE(bookingId))
  },

  async initCart(items: { productId: string; name: string; price: number; quantity: number }[], couponCode?: string, couponId?: string): Promise<PaymentInitResponse> {
    return api.post<PaymentInitResponse>("/api/payments/init-cart", { items, couponCode, couponId })
  },
}
