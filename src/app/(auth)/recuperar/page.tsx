"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Mail, Loader2, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { api } from "@/lib/api"
import { ENDPOINTS } from "@/lib/constants"

export default function RecuperarPage() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)
    try {
      await api.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
      setSent(true)
    } catch (err: unknown) {
      const msg = err && typeof err === "object" && "message" in err ? (Array.isArray(err.message) ? err.message[0] : err.message) : "Error al enviar"
      setError(String(msg))
    } finally { setIsSubmitting(false) }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mb-3 inline-block font-heading text-xl font-semibold tracking-tight">Kamerinos by Sandra Pinzon</Link>
        <CardTitle className="font-heading text-2xl font-semibold">Recuperar contraseña</CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">{sent ? "Revisa tu correo" : "Ingresa tu email para recibir instrucciones"}</p>
      </CardHeader>
      <CardContent>
        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle className="mx-auto size-12 text-green-600" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Si el correo existe en nuestro sistema, recibirás un enlace para restablecer tu contraseña. Revisa tu bandeja de entrada y spam.</p>
            <Link href="/login" className="text-sm font-medium text-primary hover:underline">Volver a iniciar sesión</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (<div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>)}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" required className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : <>Enviar instrucciones<ArrowRight data-slot="icon" data-icon="inline-end" className="size-4" strokeWidth={1.5} /></>}
            </Button>
          </form>
        )}
        {!sent && (
          <p className="mt-6 text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-primary hover:underline">Volver a iniciar sesión</Link>
          </p>
        )}
      </CardContent>
    </Card>
  )
}
