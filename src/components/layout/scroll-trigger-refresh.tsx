"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { ScrollTrigger } from "gsap/ScrollTrigger"

export function ScrollTriggerRefresh() {
  const pathname = usePathname()

  useEffect(() => {
    // Tras cada navegación, el alto del contenido cambia y las posiciones de
    // los ScrollTrigger quedan obsoletas → recalcúlalas para que los reveals
    // vuelvan a dispararse correctamente.
    ScrollTrigger.refresh()
  }, [pathname])

  return null
}
