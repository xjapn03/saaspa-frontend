"use client"

import { useState, useEffect } from "react"
import { Loader2, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Modal } from "@/components/ui/modal"
import { Separator } from "@/components/ui/separator"
import { users as usersApi } from "@/lib/users"
import type { User, Role } from "@/types/auth"

const ROLES: { value: Role; label: string }[] = [
  { value: "CLIENTE", label: "Cliente" },
  { value: "EMPLEADO", label: "Empleado" },
  { value: "ADMIN", label: "Administrador" },
]

interface EditUserDrawerProps {
  user: User | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
  defaultRole?: Role
  hideRole?: boolean
}

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  description: "",
  role: "CLIENTE" as Role,
  isActive: true,
}

export function EditUserDrawer({
  user,
  open,
  onOpenChange,
  onSaved,
  defaultRole = "CLIENTE",
  hideRole = false,
}: EditUserDrawerProps) {
  const isCreating = !user
  const [form, setForm] = useState({ ...EMPTY_FORM, role: defaultRole })
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const passwordsMatch = form.password === form.confirmPassword

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        password: "",
        confirmPassword: "",
        description: user.description || "",
        role: user.role,
        isActive: user.isActive,
      })
    } else {
      setForm({ ...EMPTY_FORM, role: defaultRole })
    }
    setError("")
  }, [user, open, defaultRole])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSave() {
    if (isCreating && !passwordsMatch) {
      setError("Las contraseñas no coinciden")
      return
    }
    setError("")
    setIsSaving(true)
    try {
      if (isCreating) {
        await usersApi.create({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
          role: form.role,
          description: form.description || undefined,
        } as any)
      } else {
        await usersApi.update(user.id, {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone || undefined,
          role: form.role,
          isActive: form.isActive,
          description: form.description || undefined,
        } as any)
      }
      onSaved()
      onOpenChange(false)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al guardar"
      setError(String(msg))
    } finally {
      setIsSaving(false)
    }
  }

  const getTitle = () => {
    if (!isCreating) return "Editar usuario"
    if (hideRole) {
      return defaultRole === "EMPLEADO" ? "Nuevo empleado" : "Nuevo cliente"
    }
    if (defaultRole === "EMPLEADO") return "Nuevo empleado"
    return "Nuevo usuario"
  }

  const title = getTitle()
  const description = isCreating ? "Completa los datos para crear el usuario." : "Modifica los datos del usuario. Los cambios se guardan inmediatamente."
  const canSave = form.email && form.firstName && form.lastName && (isCreating ? form.password && passwordsMatch : true)

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={title} description={description}>
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>
      )}

      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Nombre</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} placeholder="Ej: María" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Apellido</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} placeholder="Ej: Gómez" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@ejemplo.com" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        {isCreating && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Contraseña</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirmar contraseña</label>
              <div className="relative">
                <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} placeholder="Repite la contraseña" className="w-full rounded-xl border border-border bg-background px-3 py-2 pr-8 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
                {form.confirmPassword && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2">
                    {passwordsMatch ? <Check className="size-4 text-green-500" /> : <X className="size-4 text-destructive" />}
                  </span>
                )}
              </div>
              {form.confirmPassword && !passwordsMatch && (
                <p className="text-xs text-destructive">Las contraseñas no coinciden</p>
              )}
            </div>
          </>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Teléfono</label>
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="3001234567" className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Descripción</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={2} placeholder="Notas sobre el usuario..." className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 resize-none" />
        </div>
        {!hideRole && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rol</label>
            <select name="role" value={form.role} onChange={handleChange} className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20">
              {ROLES.map((r) => (<option key={r.value} value={r.value}>{r.label}</option>))}
            </select>
          </div>
        )}
        {!isCreating && (
          <div className="flex items-center justify-between rounded-xl border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Estado</p>
              <p className="text-xs text-muted-foreground">{form.isActive ? "El usuario puede acceder al sistema" : "El usuario no puede iniciar sesión"}</p>
            </div>
            <button type="button" role="switch" aria-checked={form.isActive} onClick={() => setForm((prev) => ({ ...prev, isActive: !prev.isActive }))} className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors ${form.isActive ? "bg-primary" : "bg-muted"}`}>
              <span className={`inline-block size-4 rounded-full bg-background shadow-sm transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
            </button>
          </div>
        )}
      </div>

      <div className="mt-8">
        <Button className="w-full" size="lg" onClick={handleSave} disabled={isSaving || !canSave}>
          {isSaving ? <Loader2 className="size-4 animate-spin" /> : isCreating ? "Crear usuario" : "Guardar cambios"}
        </Button>
      </div>
    </Modal>
  )
}
