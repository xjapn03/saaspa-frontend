export function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop()?.split(";").shift()
  return undefined
}

export function getFbc(): string | undefined {
  return getCookie("_fbc")
}

export function getFbp(): string | undefined {
  return getCookie("_fbp")
}

export function generateEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `evt-${Date.now()}-${Math.round(Math.random() * 1e9)}`
}
