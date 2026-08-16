export interface SanitizeNumericOptions {
  allowDecimal?: boolean
  allowEmpty?: boolean
}

export function sanitizeNumericInput(raw: string, options: SanitizeNumericOptions = {}): string {
  const { allowDecimal = false, allowEmpty = true } = options

  if (raw === "") return allowEmpty ? "" : "0"

  let value = raw.replace(/,/g, "")

  if (allowDecimal) {
    value = value.replace(/[^0-9.]/g, "")
    const parts = value.split(".")
    value = parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "")
  } else {
    value = value.replace(/[^0-9]/g, "")
  }

  value = value.replace(/^0+(?=\d)/, "")

  if (value === "" && !allowEmpty) value = "0"

  return value
}
