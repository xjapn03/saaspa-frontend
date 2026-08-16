import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

const ACCESS_COOKIE = "kamerinos_access_token"

export function middleware(request: NextRequest) {
  const hasAccess = request.cookies.has(ACCESS_COOKIE)
  const { pathname } = request.nextUrl

  if (pathname.startsWith("/dashboard") && !hasAccess) {
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  if ((pathname === "/login" || pathname === "/registro") && hasAccess) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/registro"],
}
