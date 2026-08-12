export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  isActive: boolean
  categoryId?: string | null
  categoryRel?: { id: string; name: string; slug: string } | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateServiceRequest {
  name: string
  description?: string
  price: number
  duration: number
  categoryId?: string | null
  imageUrl?: string
}

export interface UpdateServiceRequest {
  name?: string
  description?: string
  price?: number
  duration?: number
  categoryId?: string | null
  imageUrl?: string
  isActive?: boolean
}
