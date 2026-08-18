export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
export const SITE_NAME = "Kamerinos by Sandra Pinzon"

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path
  const base = path === "/" ? "" : path
  return `${SITE_URL}${base}`
}

export function pageCanonical(path = "/") {
  return { canonical: absoluteUrl(path) }
}

export function ogUrl(path = "/") {
  return { url: absoluteUrl(path) }
}
