export interface Service {
  id: string
  name: string
  description: string | null
  price: number
  duration: number
  isActive: boolean
  category: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateServiceRequest {
  name: string
  description?: string
  price: number
  duration: number
  category?: string
  imageUrl?: string
}

export interface UpdateServiceRequest {
  name?: string
  description?: string
  price?: number
  duration?: number
  category?: string
  imageUrl?: string
  isActive?: boolean
}
