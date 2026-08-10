import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { server } from "@/test/mocks/server"
import { mockUser } from "@/test/fixtures/user"

beforeAll(() => server.listen({ onUnhandledRequest: "bypass" }))
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

describe("Auth module", () => {
  it("login guarda tokens y usuario en localStorage", async () => {
    const { auth } = await import("@/lib/auth")

    const response = await auth.login({
      email: "maria@email.com",
      password: "password123",
    })

    expect(response.user.email).toBe(mockUser.email)
    expect(response.accessToken).toBeTruthy()
    expect(response.refreshToken).toBeTruthy()

    expect(localStorage.getItem("kamerinos_access_token")).toBe(
      response.accessToken
    )
    expect(localStorage.getItem("kamerinos_user")).toBeTruthy()
  })

  it("isAuthenticated retorna true después de login", async () => {
    const { auth } = await import("@/lib/auth")

    await auth.login({
      email: "maria@email.com",
      password: "password123",
    })

    expect(auth.isAuthenticated()).toBe(true)
  })

  it("logout limpia localStorage", async () => {
    const { auth } = await import("@/lib/auth")

    await auth.login({
      email: "maria@email.com",
      password: "password123",
    })

    await auth.logout()

    expect(auth.isAuthenticated()).toBe(false)
    expect(localStorage.getItem("kamerinos_access_token")).toBeNull()
  })

  it("register devuelve datos con status 201", async () => {
    const { auth } = await import("@/lib/auth")

    const response = await auth.register({
      firstName: "Nueva",
      lastName: "Cliente",
      email: "nueva@email.com",
      password: "secure123",
    })

    expect(response.user.firstName).toBe("Nueva")
    expect(response.accessToken).toBeTruthy()
  })
})
