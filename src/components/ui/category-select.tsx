"use client"

import { useState, useEffect, useRef } from "react"
import { Check, ChevronDown, X } from "lucide-react"

export interface CategoryOption {
  id: string
  name: string
  parentId?: string | null
  children?: CategoryOption[]
}

interface CategorySelectProps {
  value: string
  onChange: (value: string) => void
  options: CategoryOption[]
  placeholder?: string
}

export function CategorySelect({ value, onChange, options, placeholder = "Seleccionar categoría" }: CategorySelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const selected = options.find((o) => o.id === value) || null

  function flattenOptions(cats: CategoryOption[], level = 0): (CategoryOption & { level: number })[] {
    const result: (CategoryOption & { level: number })[] = []
    for (const c of cats) {
      result.push({ ...c, level })
      if (c.children && c.children.length > 0) {
        result.push(...flattenOptions(c.children, level + 1))
      }
    }
    return result
  }

  const flatOptions = flattenOptions(options)
  const filtered = search
    ? flatOptions.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()))
    : flatOptions

  function handleSelect(id: string) {
    onChange(id)
    setOpen(false)
    setSearch("")
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation()
    onChange("")
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <span className={selected ? "text-foreground" : "text-muted-foreground"}>
          {selected ? selected.name : placeholder}
        </span>
        <div className="flex items-center gap-1">
          {selected && (
            <span onClick={handleClear} className="rounded p-0.5 hover:bg-muted"><X className="size-3" /></span>
          )}
          <ChevronDown className={`size-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-xl border border-border bg-card shadow-lg">
          <div className="p-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar categoría..."
              className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm outline-none placeholder:text-muted-foreground/50"
              autoFocus
            />
          </div>
          <div className="max-h-48 overflow-y-auto">
            {filtered.length === 0 ? (
              <p className="px-3 py-4 text-center text-sm text-muted-foreground">Sin resultados</p>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt.id)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted ${
                    value === opt.id ? "bg-primary/5 text-primary" : "text-foreground"
                  }`}
                >
                  <span className="w-4 flex-shrink-0">
                    {value === opt.id && <Check className="size-3.5" />}
                  </span>
                  <span style={{ paddingLeft: `${opt.level * 16}px` }} className="truncate">
                    {opt.level > 0 && <span className="text-muted-foreground">└ </span>}
                    {opt.name}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
