import { describe, it, expect, vi, beforeAll, afterAll } from "vitest"
import { render, screen } from "@testing-library/react"
import Home from "@/app/(public)/page"

beforeAll(() => {
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([
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
    ]),
  }))
})

afterAll(() => {
  vi.unstubAllGlobals()
})

describe("Home page", () => {
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
