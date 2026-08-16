"use client"

import { useEffect, useState } from "react"
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
  const [internal, setInternal] = useState(String(value ?? ""))

  useEffect(() => {
    setInternal(String(value ?? ""))
  }, [value])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const sanitized = sanitizeNumericInput(e.target.value, { allowDecimal, allowEmpty })
    setInternal(sanitized)
    onChange(sanitized)
  }

  function handleBlur() {
    if (internal === "") return
    let parsed = allowDecimal ? parseFloat(internal) : parseInt(internal, 10)
    if (Number.isNaN(parsed)) return
    if (typeof min === "number" && parsed < min) parsed = min
    if (typeof max === "number" && parsed > max) parsed = max
    const clamped = String(parsed)
    setInternal(clamped)
    onChange(clamped)
  }

  return (
    <input
      type="text"
      inputMode={allowDecimal ? "decimal" : "numeric"}
      value={internal}
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
