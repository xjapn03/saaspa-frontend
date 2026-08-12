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

export const ordersApi = {
  async list(): Promise<Order[]> { return api.get<Order[]>(`/api/orders`) },
  async listMy(): Promise<Order[]> { return api.get<Order[]>(`/api/orders/my`) },
  async getById(id: string): Promise<Order> { return api.get<Order>(`/api/orders/${id}`) },
  async updateStatus(id: string, status: string): Promise<Order> {
    return api.patch<Order>(`/api/orders/${id}/status`, { status })
  },
}
