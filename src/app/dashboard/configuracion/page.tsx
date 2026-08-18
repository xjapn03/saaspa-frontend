"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, UserRound, ShieldCheck, Loader2, Lock, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-provider"
import { useToast } from "@/context/toast-provider"
import { useScrollReveal } from "@/lib/animations"
import { users } from "@/lib/users"
import { auth } from "@/lib/auth"

const inputCls =
  "w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"

export default function ConfiguracionPage() {
  const { user, refreshUser, logout } = useAuth()
  const { success: showSuccess, error: showError } = useToast()
  const router = useRouter()
  const profileRef = useScrollReveal<HTMLDivElement>({ y: 30 })
  const emailRef = useScrollReveal<HTMLDivElement>({ y: 30 })

  const [profile, setProfile] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    phone: user?.phone || "",
    birthday: user?.birthday ? user.birthday.slice(0, 10) : "",
  })
  const [savingProfile, setSavingProfile] = useState(false)

  const [newEmail, setNewEmail] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [sendingCode, setSendingCode] = useState(false)
  const [confirming, setConfirming] = useState(false)

  const [pwd, setPwd] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" })
  const [showPwd, setShowPwd] = useState(false)
  const [changingPwd, setChangingPwd] = useState(false)
  const pwdRef = useScrollReveal<HTMLDivElement>({ y: 30 })

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (pwd.newPassword.length < 6) {
      showError("La nueva contraseña debe tener al menos 6 caracteres.")
      return
    }
    if (pwd.newPassword !== pwd.confirmPassword) {
      showError("Las contraseñas no coinciden.")
      return
    }
    setChangingPwd(true)
    try {
      await auth.changePassword(pwd.currentPassword, pwd.newPassword)
      showSuccess("Contraseña actualizada. Inicia sesión de nuevo.")
      await logout()
      router.replace("/login")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al cambiar la contraseña"
      showError(String(msg))
    } finally {
      setChangingPwd(false)
    }
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setSavingProfile(true)
    try {
      await users.updateProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone || undefined,
        birthday: profile.birthday || undefined,
      })
      await refreshUser()
      showSuccess("Perfil actualizado")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al guardar el perfil"
      showError(String(msg))
    } finally {
      setSavingProfile(false)
    }
  }

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail.trim()) return
    setSendingCode(true)
    try {
      await auth.requestEmailChange(newEmail.trim())
      setCodeSent(true)
      showSuccess(`Enviamos un código a ${newEmail.trim()}. Revisa tu correo.`)
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Error al enviar el código"
      showError(String(msg))
    } finally {
      setSendingCode(false)
    }
  }

  async function handleConfirmEmail(e: React.FormEvent) {
    e.preventDefault()
    if (code.length !== 6) return
    setConfirming(true)
    try {
      await auth.confirmEmailChange(code)
      showSuccess("Correo actualizado. Inicia sesión de nuevo con tu nuevo correo.")
      await logout()
      router.replace("/login")
    } catch (err: unknown) {
      const msg =
        err && typeof err === "object" && "message" in err
          ? Array.isArray(err.message)
            ? err.message[0]
            : err.message
          : "Código incorrecto"
      showError(String(msg))
    } finally {
      setConfirming(false)
    }
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="font-heading text-2xl font-semibold text-foreground">Configuración</h1>
        <p className="text-sm text-muted-foreground">Ajustes de tu cuenta y preferencias.</p>
      </div>

      <div className="space-y-6">
        <div ref={profileRef}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRound className="size-5 text-primary" strokeWidth={1.5} />
                Mi perfil
              </CardTitle>
              <CardDescription>
                Actualiza tus datos personales. El correo se cambia en la sección de abajo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nombre</label>
                    <input value={profile.firstName} onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))} className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Apellido</label>
                    <input value={profile.lastName} onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Teléfono</label>
                    <input value={profile.phone} onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))} placeholder="3001234567" className={inputCls} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Fecha de nacimiento</label>
                    <input type="date" value={profile.birthday} onChange={(e) => setProfile((p) => ({ ...p, birthday: e.target.value }))} className={inputCls} />
                  </div>
                </div>
                <Button type="submit" disabled={savingProfile}>
                  {savingProfile ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                  Guardar perfil
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div ref={emailRef}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="size-5 text-primary" strokeWidth={1.5} />
                Cambiar correo electrónico
              </CardTitle>
              <CardDescription>
                Te enviaremos un código de verificación al nuevo correo. Al confirmarlo, deberás iniciar sesión de nuevo.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-xl bg-muted/50 px-4 py-3 text-sm">
                <ShieldCheck className="size-4 text-primary" strokeWidth={1.5} />
                <span className="text-muted-foreground">Correo actual:</span>
                <span className="font-medium text-foreground">{user?.email}</span>
              </div>

              {!codeSent ? (
                <form onSubmit={handleSendCode} className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nuevo correo</label>
                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="nuevo@correo.com"
                      className={inputCls}
                    />
                  </div>
                  <Button type="submit" disabled={sendingCode}>
                    {sendingCode ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    Enviar código
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleConfirmEmail} className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Código de 6 dígitos (enviado a {newEmail})
                    </label>
                    <input
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="000000"
                      inputMode="numeric"
                      className={`${inputCls} text-center text-xl tracking-[0.4em]`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button type="submit" disabled={confirming || code.length !== 6}>
                      {confirming ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                      Confirmar cambio
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => { setCodeSent(false); setCode("") }}>
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>

        <div ref={pwdRef}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5 text-primary" strokeWidth={1.5} />
                Cambiar contraseña
              </CardTitle>
              <CardDescription>
                Actualiza tu contraseña. Al cambiarla deberás iniciar sesión de nuevo.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Contraseña actual</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type={showPwd ? "text" : "password"}
                      value={pwd.currentPassword}
                      onChange={(e) => setPwd((p) => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="••••••••"
                      required
                      className={`${inputCls} pl-10 pr-10`}
                    />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nueva contraseña</label>
                    <input
                      type={showPwd ? "text" : "password"}
                      value={pwd.newPassword}
                      onChange={(e) => setPwd((p) => ({ ...p, newPassword: e.target.value }))}
                      placeholder="Mínimo 6 caracteres"
                      required
                      minLength={6}
                      className={inputCls}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Confirmar contraseña</label>
                    <input
                      type={showPwd ? "text" : "password"}
                      value={pwd.confirmPassword}
                      onChange={(e) => setPwd((p) => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Repite tu contraseña"
                      required
                      minLength={6}
                      className={inputCls}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button type="submit" disabled={changingPwd}>
                    {changingPwd ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                    Actualizar contraseña
                  </Button>
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                  >
                    {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {showPwd ? "Ocultar" : "Mostrar"}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
