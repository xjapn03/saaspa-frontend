import { describe, it, expect } from "vitest"
import { render, screen } from "@testing-library/react"
import { ServiceCard } from "@/components/marketing/service-card"

const mockService = {
  name: "Facial Hidratante Premium",
  slug: "facial-hidratante-premium",
  category: "Facial",
  duration: "75 min",
  description:
    "Limpieza profunda con ácido hialurónico y vitamina C. Hidratación intensiva.",
  price: "$ 180.000",
}

describe("ServiceCard", () => {
  it("renderiza el nombre del servicio", () => {
    render(<ServiceCard {...mockService} />)
    expect(screen.getByText("Facial Hidratante Premium")).toBeInTheDocument()
  })

  it("muestra la categoría como badge", () => {
    render(<ServiceCard {...mockService} />)
    expect(screen.getByText("Facial")).toBeInTheDocument()
  })

  it("muestra la duración", () => {
    render(<ServiceCard {...mockService} />)
    expect(screen.getByText("75 min")).toBeInTheDocument()
  })

  it("muestra 'Inversión' en vez de 'Precio'", () => {
    render(<ServiceCard {...mockService} />)
    expect(screen.getByText("Inversión")).toBeInTheDocument()
    expect(screen.queryByText("Precio")).not.toBeInTheDocument()
  })

  it("muestra el precio formateado", () => {
    render(<ServiceCard {...mockService} />)
    expect(screen.getByText("$ 180.000")).toBeInTheDocument()
  })

  it("contiene un link a la página de detalle", () => {
    render(<ServiceCard {...mockService} />)
    const links = screen.getAllByRole("link")
    const hasDetailLink = links.some((link) =>
      link.getAttribute("href")?.includes("/servicios/facial-hidratante-premium")
    )
    expect(hasDetailLink).toBe(true)
  })
})
