"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { getPixelId, isPixelEnabled, pageView } from "@/lib/meta-pixel"

export function MetaPixelScript() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!isPixelEnabled()) return

    const pixelId = getPixelId()

    const script = document.createElement("script")
    script.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '${pixelId}');
    `
    document.head.appendChild(script)

    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    if (!isPixelEnabled()) return
    const ctwaClid = searchParams.get("ctwa_clid")
    if (ctwaClid) {
      document.cookie = `_fbc=fb.1.${Date.now()}.${ctwaClid}; path=/; max-age=7776000`
    }
  }, [searchParams])

  useEffect(() => {
    if (!isPixelEnabled()) return
    pageView()
  }, [pathname])

  return null
}