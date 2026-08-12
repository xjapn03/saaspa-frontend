export interface Booking {
  id: string
  userId: string
  serviceId: string
  startTime: string
  endTime: string
  status: BookingStatus
  googleEventId: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  user?: { firstName: string; lastName: string; email: string }
  service?: { name: string; duration: number; price: number }
  payments?: { id: string; type: string; status: string; amount: number; paidAt: string | null }[]
}

export type BookingStatus =
  | "PENDIENTE_PAGO"
  | "CONFIRMADA"
  | "CANCELADA"
  | "COMPLETADA"
  | "NO_ASISTIO"

export interface CreateBookingRequest {
  serviceId: string
  startTime: string
}

export interface RescheduleRequest {
  startTime: string
}
