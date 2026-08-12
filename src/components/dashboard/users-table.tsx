"use client"

import { useState, useEffect, useCallback } from "react"
import { Pencil, Trash2, Search, Loader2, ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { users as usersApi } from "@/lib/users"
import type { User, Role } from "@/types/auth"

const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Administrador",
  EMPLEADO: "Empleado",
  CLIENTE: "Cliente",
}

const ROLE_VARIANTS: Record<Role, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  EMPLEADO: "secondary",
  CLIENTE: "outline",
}

const USERS_PER_PAGE = 10

interface UsersTableProps {
  onEdit: (user: User) => void
  onView?: (user: User) => void
  onAdd?: () => void
  refreshKey: number
  roleFilter?: string
}

export function UsersTable({ onEdit, onView, onAdd, refreshKey, roleFilter }: UsersTableProps) {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const fetchUsers = useCallback(async () => {
    setIsLoading(true)
    setError("")
    try {
      const result = await usersApi.list({ role: roleFilter, sortBy: "firstName", order: "asc" })
      setUsers(result.data)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al cargar usuarios"
      setError(String(msg))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers, refreshKey])

  async function handleDelete(userId: string, userName: string) {
    if (!confirm(`¿Desactivar a ${userName}? Esta acción es reversible.`)) return
    setDeletingId(userId)
    try {
      await usersApi.remove(userId)
      await fetchUsers()
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al desactivar usuario"
      alert(String(msg))
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase()
    return (
      u.firstName.toLowerCase().includes(q) ||
      u.lastName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.phone && u.phone.includes(q))
    )
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / USERS_PER_PAGE))
  const paged = filtered.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" className="mt-4" onClick={fetchUsers}>
          Reintentar
        </Button>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1)
            }}
            className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        {onAdd && (
          <Button size="sm" onClick={onAdd}>
            <Plus className="mr-1 size-4" /> Añadir
          </Button>
        )}
      </div>

      {paged.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <p className="text-sm text-muted-foreground">
            {search ? "No se encontraron usuarios con ese criterio." : "No hay usuarios registrados."}
          </p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Nombre</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
                    Email
                  </th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground md:table-cell">
                    Teléfono
                  </th>
                  <th className="px-4 py-3 font-medium text-muted-foreground">Rol</th>
                  <th className="hidden px-4 py-3 font-medium text-muted-foreground sm:table-cell">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paged.map((user) => (
                  <tr
                    key={user.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-foreground">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-muted-foreground sm:hidden">
                        {user.email}
                      </p>
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">
                      {user.email}
                    </td>
                    <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                      {user.phone || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={ROLE_VARIANTS[user.role]}>
                        {ROLE_LABELS[user.role]}
                      </Badge>
                    </td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <Badge variant={user.isActive ? "outline" : "secondary"}>
                        {user.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {onView && (
                          <Button variant="ghost" size="icon-sm" onClick={() => onView(user)} title="Ver detalle">
                            <Eye className="size-4" strokeWidth={1.5} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => onEdit(user)}
                          title="Editar usuario"
                        >
                          <Pencil className="size-4" strokeWidth={1.5} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-sm"
                          disabled={deletingId === user.id || !user.isActive}
                          onClick={() =>
                            handleDelete(
                              user.id,
                              `${user.firstName} ${user.lastName}`
                            )
                          }
                          title="Desactivar usuario"
                        >
                          {deletingId === user.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" strokeWidth={1.5} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>
                {filtered.length} usuario{filtered.length !== 1 && "s"}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="size-4" strokeWidth={1.5} />
                </Button>
                <span>
                  {page} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="icon-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="size-4" strokeWidth={1.5} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
