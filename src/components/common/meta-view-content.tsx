"use client"

import { useEffect } from "react"
import { viewContent } from "@/lib/meta-pixel"

interface MetaViewContentProps {
  contentName?: string
  contentCategory?: string
  contentType?: string
  value?: number
}

export function MetaViewContent({ contentName, contentCategory, contentType, value }: MetaViewContentProps) {
  useEffect(() => {
    viewContent({ contentName, contentCategory, contentType, value })
  }, [contentName, contentCategory, contentType, value])

  return null
}
