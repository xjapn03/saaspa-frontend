"use client"

import { useState, useEffect } from "react"
import { Toast, type ToastType, eventBus } from "@/components/ui/toast"

interface ToastState {
  id: number
  message: string
  type: ToastType
}

let lastId = 0

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastState[]>([])

  useEffect(() => {
    const unsub = eventBus?.subscribe((t) => {
      setToasts((prev) => [...prev, { id: ++lastId, ...t }])
    })
    return () => unsub?.()
  }, [])

  function close(id: number) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <>
      {toasts.map((t) => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => close(t.id)} />
      ))}
    </>
  )
}
