import { describe, it, expect } from "vitest"
import { NextRequest } from "next/server"
import { proxy } from "@/proxy"

function request(pathname: string, cookie?: string) {
  const req = new NextRequest(`http://localhost:3000${pathname}`)
  if (cookie) req.cookies.set("kamerinos_access_token", cookie)
  return req
}

describe("proxy", () => {
  it("redirects unauthenticated /dashboard to /login with redirect param", () => {
    const res = proxy(request("/dashboard"))
    expect(res.status).toBe(307)
    const location = new URL(res.headers.get("location") || "")
    expect(location.pathname).toBe("/login")
    expect(location.searchParams.get("redirect")).toBe("/dashboard")
  })

  it("redirects unauthenticated nested dashboard paths keeping the path", () => {
    const res = proxy(request("/dashboard/agenda"))
    const location = new URL(res.headers.get("location") || "")
    expect(location.pathname).toBe("/login")
    expect(location.searchParams.get("redirect")).toBe("/dashboard/agenda")
  })

  it("redirects authenticated /login to /dashboard", () => {
    const res = proxy(request("/login", "token"))
    const location = new URL(res.headers.get("location") || "")
    expect(location.pathname).toBe("/dashboard")
  })

  it("redirects authenticated /registro to /dashboard", () => {
    const res = proxy(request("/registro", "token"))
    const location = new URL(res.headers.get("location") || "")
    expect(location.pathname).toBe("/dashboard")
  })

  it("passes through authenticated /dashboard", () => {
    const res = proxy(request("/dashboard", "token"))
    expect(res.status).toBe(200)
  })

  it("passes through routes outside the matcher", () => {
    const res = proxy(request("/"))
    expect(res.status).toBe(200)
  })
})
