import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest"
import { render, screen } from "@testing-library/react"
import { http, HttpResponse } from "msw"
import { server } from "@/test/mocks/server"
import Home from "@/app/(public)/page"

const API_URL = "http://localhost:3001"

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }))
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe("Home page", () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_URL}/api/services/public`, () => {
        return HttpResponse.json([
          {
            id: "svc-1",
            name: "Facial Premium",
            description: "Test",
            price: 180000,
            duration: 75,
            isActive: true,
            category: "Facial",
            imageUrl: null,
            createdAt: "2024-01-01",
            updatedAt: "2024-01-01",
          },
        ])
      }),
      http.get(`${API_URL}/api/products`, () => {
        return HttpResponse.json([])
      }),
      http.get(`${API_URL}/api/categories`, () => {
        return HttpResponse.json([])
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
