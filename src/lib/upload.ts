import { API_BASE_URL } from "./constants"

export async function uploadImage(
  file: File,
  folder: string,
  imageType: "main" | "gallery",
): Promise<string> {
  const params = new URLSearchParams({ folder, imageType })
  const formData = new FormData()
  formData.append("file", file)

  const res = await fetch(`${API_BASE_URL}/api/upload?${params.toString()}`, {
    method: "POST",
    credentials: "include",
    body: formData,
  })

  if (!res.ok) {
    let msg = "Error al subir la imagen"
    try {
      const body = await res.json()
      const m = body?.message
      if (typeof m === "string") msg = m
      else if (Array.isArray(m) && m.length > 0) msg = m[0]
    } catch {
      // Mantener el mensaje por defecto si no se pudo leer el body
    }
    throw new Error(msg)
  }

  const data = await res.json()
  return data.url
}
