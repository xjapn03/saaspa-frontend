"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Loader2, CheckCircle, XCircle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { api } from "@/lib/api"
import { ENDPOINTS } from "@/lib/constants"

export default function VerifyEmailPage() {
  const params = useParams()
  const token = params.token as string
  const [state, setState] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    async function verify() {
      try {
        const result = await api.get<{ verified: boolean; message: string }>(ENDPOINTS.AUTH.VERIFY_EMAIL(token))
        setMessage(result.message || "Cuenta verificada correctamente.")
        setState("success")
      } catch (err: unknown) {
        const msg = err && typeof err === "object" && "message" in err
          ? (Array.isArray((err as any).message) ? (err as any).message[0] : (err as any).message)
          : "No se pudo verificar tu cuenta."
        setMessage(String(msg))
        setState("error")
      }
    }
    verify()
  }, [token])

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <Link href="/" className="mb-3 inline-block font-heading text-xl font-semibold tracking-tight">Kamerinos SPA</Link>
        <CardTitle className="font-heading text-2xl font-semibold">Verificación de cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        {state === "loading" && (
          <div className="flex flex-col items-center gap-3 py-4 text-muted-foreground">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm">Verificando tu cuenta...</p>
          </div>
        )}

        {state === "success" && (
          <div className="space-y-4 text-center">
            <CheckCircle className="mx-auto size-12 text-green-600" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{message}</p>
            <Button className="w-full" size="lg" nativeButton={false} render={<Link href="/login">Ir a iniciar sesión<ArrowRight data-slot="icon" data-icon="inline-end" className="size-4" strokeWidth={1.5} /></Link>} />
          </div>
        )}

        {state === "error" && (
          <div className="space-y-4 text-center">
            <XCircle className="mx-auto size-12 text-destructive" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">{message}</p>
            <div className="flex flex-col gap-2">
              <Button className="w-full" size="lg" nativeButton={false} render={<Link href="/login">Ir a iniciar sesión</Link>} />
              <Link href="/" className="text-sm font-medium text-primary hover:underline">Volver al inicio</Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
