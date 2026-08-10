import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import Home from "@/app/(public)/page"

describe("Home page", () => {
  it("renderiza el Hero con la frase-manifiesto", () => {
    render(<Home />)
    expect(
      screen.getByText("Donde el cuidado", { exact: false })
    ).toBeInTheDocument()
    expect(
      screen.getByText("se convierte en ritual", { exact: false })
    ).toBeInTheDocument()
  })

  it("muestra los 3 quick facts (precio, duración, ubicación)", () => {
    render(<Home />)
    expect(screen.getByText("Experiencias desde")).toBeInTheDocument()
    expect(screen.getByText("Duración típica")).toBeInTheDocument()
    expect(screen.getByText("Ubicación")).toBeInTheDocument()
  })

  it("renderiza la sección de filosofía con 3 pilares", () => {
    render(<Home />)
    expect(screen.getByText("Escucha")).toBeInTheDocument()
    expect(screen.getByText("Ciencia")).toBeInTheDocument()
    expect(screen.getByText("Ritual")).toBeInTheDocument()
  })

  it("muestra el CTA 'Agendar ritual'", () => {
    render(<Home />)
    expect(
      screen.getByText("Agendar ritual", { exact: false })
    ).toBeInTheDocument()
  })

  it("renderiza el Footer", () => {
    render(<Home />)
    expect(screen.getByText(/Kamerinos SPA/)).toBeInTheDocument()
  })
})
