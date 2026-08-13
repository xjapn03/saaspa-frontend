import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { server } from "@/test/mocks/server"

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }))
afterEach(() => {
  server.resetHandlers()
  localStorage.clear()
})
afterAll(() => server.close())

describe("ApiClient", () => {
  it("realiza una petición GET exitosa y parsea JSON", async () => {
    const { api } = await import("@/lib/api")
    const user = await api.get("/api/users/me")

    expect(user).toHaveProperty("id")
    expect(user).toHaveProperty("email")
    expect(user).toHaveProperty("firstName")
  })

  it("lanza error cuando el servidor responde con status no ok", async () => {
    const { http, HttpResponse } = await import("msw")
    const { api } = await import("@/lib/api")

    server.use(
      http.get("/api/users/me", () => {
        return HttpResponse.json(
          { statusCode: 401, message: "No autorizado" },
          { status: 401 }
        )
      })
    )

    await expect(api.get("/api/users/me")).rejects.toMatchObject({
      statusCode: 401,
      message: "No autorizado",
    })
  })

  it("maneja respuesta 204 sin body", async () => {
    const { api } = await import("@/lib/api")
    const result = await api.post("/api/auth/logout", {
      refreshToken: "test",
    })

    expect(result).toBeUndefined()
  })
})
