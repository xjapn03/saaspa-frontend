"use client"

import { useState } from "react"

interface ProductGalleryProps {
  mainImage: string | null
  carouselImages: string[] | null
  productName: string
}

export function ProductGallery({ mainImage, carouselImages, productName }: ProductGalleryProps) {
  const allImages = [mainImage, ...(carouselImages || [])].filter(Boolean) as string[]
  const [activeIndex, setActiveIndex] = useState(0)

  if (allImages.length === 0) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-2xl bg-muted/20">
        <span className="text-6xl text-muted-foreground/20">✦</span>
      </div>
    )
  }

  return (
    <div>
      <div className="aspect-square overflow-hidden rounded-2xl border border-border bg-muted/10">
        <img
          src={allImages[activeIndex]}
          alt={productName}
          className="size-full object-cover"
        />
      </div>
      {allImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`size-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                i === activeIndex ? "border-primary" : "border-border hover:border-primary/30"
              }`}
            >
              <img src={img} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
