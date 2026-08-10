import type { Booking } from "@/types/booking"
import { api } from "./api"
import { ENDPOINTS } from "./constants"

export const bookingsApi = {
  async list(params?: { date?: string; status?: string }): Promise<Booking[]> {
    const qs = new URLSearchParams()
    if (params?.date) qs.set("date", params.date)
    if (params?.status) qs.set("status", params.status)
    const query = qs.toString()
    return api.get<Booking[]>(`${ENDPOINTS.BOOKINGS.LIST}${query ? `?${query}` : ""}`)
  },

  async getById(id: string): Promise<Booking> {
    return api.get<Booking>(ENDPOINTS.BOOKINGS.BY_ID(id))
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

  async reschedule(id: string, startTime: string): Promise<Booking> {
    return api.patch<Booking>(ENDPOINTS.BOOKINGS.RESCHEDULE(id), { startTime })
  },

  async createForUser(userId: string, data: { serviceId: string; startTime: string }): Promise<Booking> {
    return api.post<Booking>(ENDPOINTS.BOOKINGS.ADMIN_CREATE, { ...data, userId })
  },
}
