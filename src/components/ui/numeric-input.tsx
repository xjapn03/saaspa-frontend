"use client"

import { sanitizeNumericInput } from "@/lib/numeric"

interface NumericInputProps {
  value: string | number
  onChange: (value: string) => void
  min?: number
  max?: number
  allowDecimal?: boolean
  allowEmpty?: boolean
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function NumericInput({
  value,
  onChange,
  min,
  max,
  allowDecimal = false,
  allowEmpty = true,
  placeholder,
  className,
  disabled,
}: NumericInputProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(sanitizeNumericInput(e.target.value, { allowDecimal, allowEmpty }))
  }

  function handleBlur() {
    const current = String(value ?? "")
    if (current === "") return
    let parsed = allowDecimal ? parseFloat(current) : parseInt(current, 10)
    if (Number.isNaN(parsed)) return
    if (typeof min === "number" && parsed < min) parsed = min
    if (typeof max === "number" && parsed > max) parsed = max
    onChange(String(parsed))
  }

  return (
    <input
      type="text"
      inputMode={allowDecimal ? "decimal" : "numeric"}
      value={String(value ?? "")}
      onChange={handleChange}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={className}
      disabled={disabled}
      onKeyDown={(e) => {
        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
        if (!allowDecimal && e.key === ".") e.preventDefault()
      }}
    />
  )
}
