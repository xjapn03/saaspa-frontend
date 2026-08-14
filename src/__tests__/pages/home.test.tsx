import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { server } from "@/test/mocks/server"
import Home from "@/app/(public)/page"

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Home page", () => {
  beforeEach(() => {
    server.use(
      http.get("/api/services/public", () => {
        return HttpResponse.json({ data: [
          { id: "svc-1", name: "Facial Premium", description: "Test", price: 180000, duration: 75, isActive: true, category: "Facial", imageUrl: null, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
        ], total: 1, page: 1, limit: 20, totalPages: 1 })
      }),
      http.get("http://localhost:3001/api/services/public", () => {
        return HttpResponse.json({ data: [
          { id: "svc-1", name: "Facial Premium", description: "Test", price: 180000, duration: 75, isActive: true, category: "Facial", imageUrl: null, createdAt: "2024-01-01", updatedAt: "2024-01-01" },
        ], total: 1, page: 1, limit: 20, totalPages: 1 })
      }),
      http.get("/api/products", () => {
        return HttpResponse.json({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
      }),
      http.get("/api/categories", () => {
        return HttpResponse.json({ data: [], total: 0, page: 1, limit: 20, totalPages: 0 })
      })
    )
  })

  it("renderiza el Hero con la frase-manifiesto", async () => {
    const jsx = await Home()
    render(jsx)
    expect(
      screen.getByText("Donde el cuidado", { exact: false })
    ).toBeInTheDocument()
  })

  it("muestra los 3 quick facts", async () => {
    const jsx = await Home()
    render(jsx)
    expect(screen.getByText("Experiencias desde")).toBeInTheDocument()
    expect(screen.getByText("Duración típica")).toBeInTheDocument()
    expect(screen.getByText("Ubicación")).toBeInTheDocument()
  })

  it("renderiza la sección de filosofía", async () => {
    const jsx = await Home()
    render(jsx)
    expect(screen.getByText("Escucha")).toBeInTheDocument()
    expect(screen.getByText("Ciencia")).toBeInTheDocument()
    expect(screen.getByText("Ritual")).toBeInTheDocument()
  })

  it("muestra el CTA 'Agendar ritual'", async () => {
    const jsx = await Home()
    render(jsx)
    expect(screen.getByText(/Agendar ritual/i)).toBeInTheDocument()
  })

  it("muestra los servicios cargados desde la API", async () => {
    const jsx = await Home()
    render(jsx)
    expect(screen.getByText("Facial Premium")).toBeInTheDocument()
  })
})
