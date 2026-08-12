import type { Booking } from "@/types/booking"
import type { BalanceResponse } from "@/types/payment"
import type { PaginatedResult } from "@/types/paginated"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const bookingsApi = {
  async list(params?: { date?: string; status?: string; page?: number; limit?: number }): Promise<PaginatedResult<Booking>> {
    const qs = new URLSearchParams()
    if (params?.date) qs.set("date", params.date)
    if (params?.status) qs.set("status", params.status)
    if (params?.page) qs.set("page", String(params.page))
    if (params?.limit) qs.set("limit", String(params.limit))
    const query = qs.toString()
    return api.get<PaginatedResult<Booking>>(`${ENDPOINTS.BOOKINGS.LIST}${query ? `?${query}` : ""}`)
  },

  async getById(id: string): Promise<Booking> {
    return api.get<Booking>(ENDPOINTS.BOOKINGS.BY_ID(id))
  },

  async getBalance(id: string): Promise<BalanceResponse> {
    return api.get<BalanceResponse>(ENDPOINTS.BOOKINGS.BALANCE(id))
  },

  async getSlots(serviceId: string, date: string): Promise<string[]> {
    const qs = `?serviceId=${serviceId}&date=${date}`
    return api.get<string[]>(`${ENDPOINTS.BOOKINGS.SLOTS}${qs}`)
  },

  async create(data: { serviceId: string; startTime: string }): Promise<Booking> {
    return api.post<Booking>(ENDPOINTS.BOOKINGS.LIST, data)
  },

  async confirm(id: string): Promise<Booking> {
    return api.patch<Booking>(ENDPOINTS.BOOKINGS.CONFIRM(id))
  },

  async cancel(id: string): Promise<Booking> {
    return api.patch<Booking>(ENDPOINTS.BOOKINGS.CANCEL(id))
  },

  async complete(id: string): Promise<Booking> {
    return api.patch<Booking>(ENDPOINTS.BOOKINGS.COMPLETE(id))
  },

  async reopen(id: string): Promise<Booking> {
    return api.patch<Booking>(ENDPOINTS.BOOKINGS.REOPEN(id))
  },

  async reschedule(id: string, startTime: string): Promise<Booking> {
    return api.patch<Booking>(ENDPOINTS.BOOKINGS.RESCHEDULE(id), { startTime })
  },

  async createForUser(userId: string, data: { serviceId: string; startTime: string }): Promise<Booking> {
    return api.post<Booking>(ENDPOINTS.BOOKINGS.ADMIN_CREATE, { ...data, userId })
  },
}
