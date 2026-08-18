"use client"

import { Suspense, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowRight, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LogoMark } from "@/components/layout/logo"
import { useAuth } from "@/context/auth-provider"
import { auth } from "@/lib/auth"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/dashboard"
  const { login } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [unverified, setUnverified] = useState(false)
  const [resending, setResending] = useState(false)
  const [resendMsg, setResendMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setUnverified(false)
    setIsSubmitting(true)

    try {
      await login({ email, password })
      router.replace(redirect)
    } catch (err: unknown) {
      let msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray((err as any).message)
            ? (err as any).message[0]
            : (err as any).message
          : "Error al iniciar sesión"
      
      if (String(msg).includes("ThrottlerException")) {
        msg = "Has realizado demasiados intentos fallidos. Por seguridad, espera 1 minuto e intenta de nuevo."
      }

      setError(String(msg))
      if (String(msg).includes("verificar tu correo")) setUnverified(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleResend(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setResending(true)
    setResendMsg("")
    try {
      await auth.resendVerification(email.trim())
      setResendMsg("Enviamos un nuevo enlace de verificación. Revisa tu correo.")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al reenviar la verificación"
      setError(String(msg))
    } finally {
      setResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <LogoMark className="mx-auto size-16" />
        <Link
          href="/"
          className="mt-4 inline-block font-heading text-xl font-semibold tracking-tight"
        >
          Kamerinos by Sandra Pinzon
        </Link>
        <CardTitle className="font-heading text-2xl font-semibold">
          Iniciar sesión
        </CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Accede a tu cuenta para gestionar tus citas
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {resendMsg && (
            <div className="rounded-lg bg-primary/10 px-4 py-3 text-sm text-primary">
              {resendMsg}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium text-foreground"
            >
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="maria@email.com"
                required
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium text-foreground"
            >
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-10 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                Iniciar sesión
                <ArrowRight
                  data-slot="icon"
                  data-icon="inline-end"
                  className="size-4"
                  strokeWidth={1.5}
                />
              </>
            )}
          </Button>

          {unverified && (
            <div className="rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-xs text-muted-foreground">
                ¿No recibiste el correo de verificación?
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-3 w-full"
                onClick={handleResend}
                disabled={resending}
              >
                {resending ? <Loader2 className="size-3 animate-spin" /> : null}
                Reenviar verificación
              </Button>
            </div>
          )}
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{" "}
          <Link
            href="/registro"
            className="font-medium text-primary hover:underline"
          >
            Regístrate aquí
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          <Link href="/recuperar" className="font-medium text-primary hover:underline">
            ¿Olvidaste tu contraseña?
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  )
}
