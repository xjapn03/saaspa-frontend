import { api } from "./api"
import { ENDPOINTS } from "./constants"

export interface OrderItem {
  id: string
  productId: string
  name: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  userId: string
  total: number
  status: "PENDIENTE" | "CONFIRMADO" | "ENVIADO" | "ENTREGADO" | "CANCELADO"
  shippingName: string
  shippingEmail: string
  shippingPhone: string
  shippingAddress: string
  shippingCity: string
  shippingNotes: string | null
  paymentId: string | null
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  user?: { firstName: string; lastName: string; email: string }
}

const STATUS_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente", CONFIRMADO: "Confirmado", ENVIADO: "Enviado",
  ENTREGADO: "Entregado", CANCELADO: "Cancelado",
}

export const ORDER_STATUS_LABELS = STATUS_LABELS
export const ORDER_STATUS_VARIANTS: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDIENTE: "secondary", CONFIRMADO: "default", ENVIADO: "outline",
  ENTREGADO: "outline", CANCELADO: "destructive",
}

export interface OrderFilters {
  search?: string
  status?: string
  dateFrom?: string
  dateTo?: string
}

export const ordersApi = {
  async list(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams()
    if (filters?.search) params.set("search", filters.search)
    if (filters?.status) params.set("status", filters.status)
    if (filters?.dateFrom) params.set("dateFrom", filters.dateFrom)
    if (filters?.dateTo) params.set("dateTo", filters.dateTo)
    const qs = params.toString()
    return api.get<Order[]>(ENDPOINTS.ORDERS.LIST + (qs ? `?${qs}` : ""))
  },
  async listMy(): Promise<Order[]> { return api.get<Order[]>(ENDPOINTS.ORDERS.MY) },
  async getById(id: string): Promise<Order> { return api.get<Order>(ENDPOINTS.ORDERS.BY_ID(id)) },
  async updateStatus(id: string, status: string): Promise<Order> {
    return api.patch<Order>(ENDPOINTS.ORDERS.STATUS(id), { status })
  },
}
