export interface Service {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  compareAtPrice: number | null
  duration: number
  isActive: boolean
  isFeatured: boolean
  categoryId?: string | null
  categoryRel?: { id: string; name: string; slug: string } | null
  imageUrl: string | null
  mainImage: string | null
  carouselImages: string[] | null
  createdAt: string
  updatedAt: string
}

export interface CreateServiceRequest {
  name: string
  description?: string
  price: number
  compareAtPrice?: number
  duration: number
  categoryId?: string | null
  imageUrl?: string
  mainImage?: string
  carouselImages?: string[]
  isActive?: boolean
  isFeatured?: boolean
}

export interface UpdateServiceRequest {
  name?: string
  description?: string
  price?: number
  compareAtPrice?: number
  duration?: number
  categoryId?: string | null
  imageUrl?: string
  mainImage?: string
  carouselImages?: string[]
  isActive?: boolean
  isFeatured?: boolean
}
