export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compareAtPrice: number | null
  stock: number
  sku: string | null
  mainImage: string | null
  carouselImages: string[] | null
  sponsor: string | null
  isActive: boolean
  isFeatured: boolean
  categoryId: string | null
  createdAt: string
  updatedAt: string
  category?: { id: string; name: string; slug: string } | null
}

export interface CreateProductRequest {
  name: string
  slug: string
  description?: string
  price: number
  compareAtPrice?: number
  stock?: number
  sku?: string
  mainImage?: string
  carouselImages?: string[]
  sponsor?: string
  isActive?: boolean
  isFeatured?: boolean
  categoryId?: string
}
