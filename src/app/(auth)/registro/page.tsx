"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-provider"

export default function RegistroPage() {
  const { register } = useAuth()

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registered, setRegistered] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (form.password !== form.confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone || undefined,
      })
      setRegisteredEmail(form.email)
      setRegistered(true)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al registrarse"
      setError(String(msg))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link
          href="/"
          className="mb-3 inline-block font-heading text-xl font-semibold tracking-tight"
        >
          Kamerinos by Sandra Pinzon
        </Link>
        <CardTitle className="font-heading text-2xl font-semibold">
          Crear cuenta
        </CardTitle>
        <p className="mt-1 text-sm text-muted-foreground">
          Regístrate para agendar tus citas y más
        </p>
      </CardHeader>
      <CardContent>
        {registered ? (
          <div className="space-y-4 text-center">
            <Mail className="mx-auto size-12 text-green-600" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">
              Cuenta creada. Enviamos un enlace de verificación a{" "}
              <span className="font-medium text-foreground">{registeredEmail}</span>. Revisa tu
              correo para activar tu cuenta.
            </p>
            <Button
              className="w-full"
              size="lg"
              nativeButton={false}
              render={
                <Link href="/login">
                  Ir a iniciar sesión
                  <ArrowRight data-slot="icon" data-icon="inline-end" className="size-4" strokeWidth={1.5} />
                </Link>
              }
            />
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="text-sm font-medium text-foreground"
              >
                Nombre
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="María"
                  required
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="text-sm font-medium text-foreground"
              >
                Apellido
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Gómez"
                required
                className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

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
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="maria@email.com"
                required
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="text-sm font-medium text-foreground"
            >
              Teléfono{" "}
              <span className="text-muted-foreground">(opcional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="300 000 0000"
              className="w-full rounded-xl border border-border bg-background py-2.5 px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
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
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
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

          <div className="space-y-2">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-foreground"
            >
              Confirmar contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="Repite tu contraseña"
                required
                minLength={6}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
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
                Crear cuenta
                <ArrowRight
                  data-slot="icon"
                  data-icon="inline-end"
                  className="size-4"
                  strokeWidth={1.5}
                />
              </>
            )}
          </Button>
        </form>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:underline"
          >
            Inicia sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
