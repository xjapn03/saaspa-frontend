import type { User } from "@/types/auth"

export const mockUser: User = {
  id: "user-uuid-001",
  email: "maria@email.com",
  firstName: "María",
  lastName: "Gómez",
  phone: "3001234567",
  birthday: "1990-05-15",
  description: "Cliente frecuente",
  role: "CLIENTE",
  isActive: true,
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-06-20T14:30:00.000Z",
}

export const mockTokens = {
  accessToken: "mock-access-token-abc123",
  refreshToken: "mock-refresh-token-xyz789",
}
