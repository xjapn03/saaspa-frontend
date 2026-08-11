import { describe, it, expect, beforeEach, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { UsersTable } from "@/components/dashboard/users-table"
import type { User } from "@/types/auth"

vi.mock("@/lib/users", () => ({
  users: {
    list: vi.fn(),
    remove: vi.fn(),
  },
}))

import { users } from "@/lib/users"

const mockUsers: User[] = [
  { id: "1", firstName: "Ana", lastName: "López", email: "ana@test.com", phone: "3001112233", role: "CLIENTE", isActive: true, createdAt: "", updatedAt: "" },
  { id: "2", firstName: "Carlos", lastName: "Ruiz", email: "carlos@test.com", phone: null, role: "EMPLEADO", isActive: true, createdAt: "", updatedAt: "" },
  { id: "3", firstName: "Diana", lastName: "Pérez", email: "diana@test.com", phone: "3104445566", role: "ADMIN", isActive: false, createdAt: "", updatedAt: "" },
]

describe("UsersTable", () => {
  const onEdit = vi.fn()
  const onAdd = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("should show role badges", async () => {
    vi.mocked(users.list).mockResolvedValue(mockUsers)
    render(<UsersTable onEdit={onEdit} refreshKey={0} />)
    await screen.findByText("Administrador")
    expect(screen.getByText("Empleado")).toBeInTheDocument()
    expect(screen.getByText("Cliente")).toBeInTheDocument()
  })

  it("should render Add button when onAdd provided", async () => {
    vi.mocked(users.list).mockResolvedValue([])
    render(<UsersTable onEdit={onEdit} onAdd={onAdd} refreshKey={0} />)
    await screen.findByText("Añadir")
    expect(screen.getByText("Añadir")).toBeInTheDocument()
  })

  it("should render search input", async () => {
    vi.mocked(users.list).mockResolvedValue([])
    render(<UsersTable onEdit={onEdit} refreshKey={0} />)
    await screen.findByPlaceholderText("Buscar por nombre, email o teléfono...")
  })
})
