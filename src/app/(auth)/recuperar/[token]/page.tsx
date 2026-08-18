"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Lock, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { ENDPOINTS } from "@/lib/constants"

export default function ResetPasswordPage() {
  const params = useParams()
  const router = useRouter()
  const token = params.token as string
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [show, setShow] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) { setError("Las contraseñas no coinciden"); return }
    if (password.length < 6) { setError("La contraseña debe tener al menos 6 caracteres"); return }
    setError("")
    setIsSubmitting(true)
    try {
      await api.post(ENDPOINTS.AUTH.RESET_PASSWORD, { token, newPassword: password })
      setDone(true)
      setTimeout(() => router.push("/login"), 3000)
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (Array.isArray(err.message) ? err.message[0] : err.message) : "Error al restablecer"
      setError(String(msg))
    } finally { setIsSubmitting(false) }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mb-3 inline-block font-heading text-xl font-semibold tracking-tight">Kamerinos by Sandra Pinzon</Link>
        <CardTitle className="font-heading text-2xl font-semibold">Nueva contraseña</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{done ? "Contraseña actualizada" : "Elige una contraseña nueva"}</p>
      </CardHeader>
      <CardContent>
        {done ? (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto size-12 text-green-600" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Tu contraseña ha sido actualizada. Serás redirigido al inicio de sesión.</p>
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">Ir a iniciar sesión</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (<div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>)}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Nueva contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input id="password" type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="Mínimo 6 caracteres" required minLength={6} className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" tabIndex={-1}>{show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}</button>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="confirm" className="text-sm font-medium text-foreground">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input id="confirm" type={show ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repite tu contraseña" required minLength={6} className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <>Restablecer contraseña<ArrowRight data-slot="icon" data-icon="inline-end" className="size-4" strokeWidth={1.5} /></>}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
