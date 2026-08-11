import { describe, it, expect, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import { UserDetailDrawer } from "@/components/dashboard/user-detail-drawer"
import type { User } from "@/types/auth"

vi.mock("@/lib/bookings-api", () => ({
  bookingsApi: { list: vi.fn().mockResolvedValue([]) },
}))

const mockUser: User = {
  id: "user-1", firstName: "María", lastName: "Gómez", email: "maria@test.com",
  phone: "3001112233", role: "CLIENTE", isActive: true,
  birthday: "1990-05-15", description: "Cliente premium",
  createdAt: "", updatedAt: "",
}

describe("UserDetailDrawer", () => {
  it("should render user info when open", () => {
    render(<UserDetailDrawer user={mockUser} open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByText("María Gómez")).toBeInTheDocument()
    expect(screen.getByText("maria@test.com")).toBeInTheDocument()
    expect(screen.getByText("3001112233")).toBeInTheDocument()
  })

  it("should render nothing when closed", () => {
    const { container } = render(
      <UserDetailDrawer user={mockUser} open={false} onOpenChange={vi.fn()} />
    )
    expect(container.firstChild).toBeNull()
  })

  it("should show description when available", () => {
    render(<UserDetailDrawer user={mockUser} open={true} onOpenChange={vi.fn()} />)
    expect(screen.getByText("Cliente premium")).toBeInTheDocument()
  })
})
