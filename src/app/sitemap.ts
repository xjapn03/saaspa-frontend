import type { MetadataRoute } from "next"
import type { Service } from "@/types/service"
import type { Product } from "@/types/product"

export const dynamic = "force-dynamic"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

async function getPublicServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${API_BASE}/api/services/public?limit=100`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const { data } = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

async function getPublicProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_BASE}/api/products?limit=100`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const { data } = await res.json()
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/servicios`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/agendar`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/politicas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/politica-de-privacidad`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/terminos-y-condiciones`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/eliminar-datos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/registro`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.3 },
  ]

  const [services, products] = await Promise.all([getPublicServices(), getPublicProducts()])

  const serviceRoutes: MetadataRoute.Sitemap = services
    .filter((s) => s.slug && s.isActive !== false)
    .map((s) => ({
      url: `${SITE_URL}/servicios/${s.slug}`,
      lastModified: s.updatedAt ? new Date(s.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }))

  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.slug && p.isActive !== false)
    .map((p) => ({
      url: `${SITE_URL}/shop/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }))

  return [...staticRoutes, ...serviceRoutes, ...productRoutes]
}