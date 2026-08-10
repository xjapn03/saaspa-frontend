import type { PaymentInitResponse } from "@/types/payment"
import type { Payment } from "@/types/payment"
import { api } from "./api"

export const paymentsApi = {
  async init(bookingId: string): Promise<PaymentInitResponse> {
    return api.post<PaymentInitResponse>("/api/payments/init", { bookingId })
  },

  async getStatus(bookingId: string): Promise<Payment> {
    return api.get<Payment>(`/api/payments/${bookingId}/status`)
  },
}
