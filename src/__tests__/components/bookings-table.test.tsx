import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { BookingsTable } from "@/components/dashboard/bookings-table"

vi.mock("@/context/toast-provider", () => ({
  useToast: () => ({ toast: vi.fn(), success: vi.fn(), error: vi.fn(), info: vi.fn() }),
}))

vi.mock("@/lib/bookings-api", () => ({
  bookingsApi: {
    list: vi.fn(),
    confirm: vi.fn(),
    cancel: vi.fn(),
    complete: vi.fn(),
    reschedule: vi.fn(),
    getBalance: vi.fn(),
    slots: vi.fn(),
    create: vi.fn(),
  },
}))

import { bookingsApi } from "@/lib/bookings-api"
import type { Booking } from "@/types/booking"

const mockBalance = { total: 100000, paid: 30000, remaining: 70000, payments: [] }

const mockBooking: Booking = {
  id: "booking-1", userId: "user-1", serviceId: "svc-1",
  startTime: "2026-08-15T10:00:00.000Z", endTime: "2026-08-15T11:00:00.000Z",
  status: "CONFIRMADA", googleEventId: null, notes: null,
  createdAt: "", updatedAt: "",
  user: { firstName: "María", lastName: "Gómez", email: "maria@test.com" },
  service: { name: "Facial Premium", duration: 60, price: 100000 },
}

const pendiente: Booking = { ...mockBooking, id: "booking-2", status: "PENDIENTE_PAGO" }

describe("BookingsTable", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should show error state on API failure", async () => {
    vi.mocked(bookingsApi.list).mockRejectedValue(new Error("Server error"))
    render(<BookingsTable />)
    await screen.findByText("Reintentar")
    expect(screen.getByText("Server error")).toBeInTheDocument()
  })

  it("should show empty state when no bookings", async () => {
    vi.mocked(bookingsApi.list).mockResolvedValue({ data: [], total: 0, page: 1, limit: 10, totalPages: 0 })
    render(<BookingsTable />)
    await screen.findByText("Aún no tienes citas agendadas.")
  })

  it("should show status badges", async () => {
    vi.mocked(bookingsApi.list).mockResolvedValue({ data: [pendiente, mockBooking], total: 2, page: 1, limit: 10, totalPages: 1 })
    vi.mocked(bookingsApi.getBalance).mockResolvedValue(mockBalance)
    render(<BookingsTable />)
    await screen.findByText("Pendiente")
    expect(screen.getByText("Confirmada")).toBeInTheDocument()
  })
})
