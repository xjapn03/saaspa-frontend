import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { server } from "@/test/mocks/server"
import { mockUser } from "@/test/fixtures/user"

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }))
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

describe("Auth module (cookies)", () => {
  it("login guarda el usuario en localStorage (los tokens van en cookies)", async () => {
    const { auth } = await import("@/lib/auth")

    const response = await auth.login({
      email: "maria@email.com",
      password: "password123",
    })

    expect(response.user.email).toBe(mockUser.email)
    expect(localStorage.getItem("kamerinos_user")).toBeTruthy()
    expect(localStorage.getItem("kamerinos_access_token")).toBeNull()
  })

  it("logout limpia el usuario de localStorage", async () => {
    const { auth } = await import("@/lib/auth")

    await auth.login({
      email: "maria@email.com",
      password: "password123",
    })
    await auth.logout()

    expect(localStorage.getItem("kamerinos_user")).toBeNull()
  })

  it("register devuelve datos con status 201 (sin crear sesión)", async () => {
    const { auth } = await import("@/lib/auth")

    const response = await auth.register({
      firstName: "Nueva",
      lastName: "Cliente",
      email: "nueva@email.com",
      password: "secure123",
    })

    expect(response.user.firstName).toBe("Nueva")
    expect(localStorage.getItem("kamerinos_user")).toBeNull()
  })
})
