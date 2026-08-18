export type BannerPosition = "HERO" | "STRIP" | "PORTRAIT"

export interface Banner {
  id: string
  title: string | null
  subtitle: string | null
  imageUrl: string
  ctaText: string | null
  ctaLink: string | null
  position: BannerPosition
  isActive: boolean
  sortOrder: number
  startsAt: string | null
  endsAt: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateBannerRequest {
  title?: string
  subtitle?: string
  imageUrl: string
  ctaText?: string
  ctaLink?: string
  position?: BannerPosition
  isActive?: boolean
  sortOrder?: number
  startsAt?: string
  endsAt?: string
}

export interface UpdateBannerRequest extends Partial<CreateBannerRequest> {}
