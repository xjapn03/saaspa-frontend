# Plan de Estructura & Diseño — Kamerinos SPA Frontend

> **Estado actual:** Agosto 2026 — Layout público, auth, dashboard completo, Wompi real, Google Calendar, Cupones, Meta Pixel/CAPI, Animaciones GSAP, Toast/Modal, Mobile sidebar, Client dashboard, Admin booking, Recuperar contraseña — todos completos y mergeados.
> **Próximo paso:** WhatsApp bot + IA agent.

---

## 1. Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16.3 | App Router, RSC |
| React | 19.2 | UI |
| TypeScript | 5.x | Tipado estricto |
| Tailwind CSS | v4 | Estilos (CSS-first, `@theme`) |
| shadcn/ui | v4 (Maia) | Componentes base (Base UI) |
| Lucide React | latest | Iconografía line |
| Fraunces | Google Fonts | Headings (serif editorial) |
| Geist | Google Fonts | Body/UI (sans-serif) |
| Vitest | 3.x | Tests unitarios/integración |
| MSW | 2.x | Mock de API en tests |
| GSAP | latest | Animaciones scroll/hover (ScrollTrigger, timelines) |
| @gsap/react | latest | Hook useGSAP para React lifecycle |

## 2. Módulos implementados

| # | Módulo | Estado | Archivos |
|---|--------|--------|----------|
| 1 | **Design tokens + tipografía** | Completo | `globals.css` (paleta oklch: terracota/salvia/blanco cálido), `lib/fonts.ts` (Fraunces + Geist) |
| 2 | **Layout público** | Completo | `navbar.tsx` (desktop + mobile sheet), `footer.tsx`, `whatsapp-float-button.tsx`, `(public)/layout.tsx` |
| 3 | **Home page** | Completo | 6 secciones: Hero, Filosofía, Servicios, Equipo, Testimonios, CTA cierre |
| 4 | **Servicios (público)** | Completo | `/servicios` (listing), `/servicios/[slug]` (detalle con beneficios) |
| 5 | **Políticas** | Completo | `/politicas` (abono, cancelación, puntualidad) |
| 6 | **Agendar (wizard)** | Completo | `/agendar` — service picker → slot calendar → resumen → pago Wompi real |
| 7 | **Auth (login/registro)** | Completo | `/login`, `/registro` — forms validados, conectados al backend NestJS |
| 8 | **API client** | Completo | `lib/api.ts` — fetch wrapper con refresh automático de JWT (401 → refresh → retry) |
| 9 | **Auth state** | Completo | `context/auth-provider.tsx` — AuthContext global, `useAuth()` hook |
| 10 | **Dashboard admin** | Completo | `dashboard/layout.tsx` — sidebar con RBAC. Vistas reales: clientes (CRUD), servicios (CRUD), citas (tabla + reagendar), stats reales |
| 11 | **Navbar auth dinámico** | Completo | Botones "Iniciar sesión" / "Dashboard + nombre" según estado, desktop y mobile |
| 12 | **CORS + Envs** | Completo | `.env.example` + `.env.local`, CORS multi-origin en backend |
| 13 | **Tests** | Completo (18 tests) | `vitest` + `@testing-library/react` + `msw`. 4 archivos |
| 14 | **Docker** | Completo | `Dockerfile`, `docker-compose.yml` raíz, Nginx reverse proxy |
| 15 | **Documentación** | Completo | `docs/STRUCTURE.md`, `docs/Frontend-Plan.md`, `docs-general/` |
| 16 | **Reagendar citas** | Completo | `bookings-table.tsx` — modal con SlotPicker para reagendar desde admin |
| 17 | **Dashboard stats** | Completo | Citas hoy, Clientes activos, Ingresos del mes con datos reales |
| 18 | **Cupones admin** | Completo | `coupons-table.tsx` + `create-coupon-dialog.tsx` — CRUD de cupones |
| 19 | **Meta Pixel + CAPI** | Completo | `meta-pixel-script.tsx` — Pixel en <head> + captura ctwa_clid. `meta-pixel.ts` — helpers track(). CAPI server-side en backend |
| 20 | **Toast + Modal system** | Completo | `toast.tsx` + `modal.tsx` — feedback de errores, modales centrados con GSAP |
| 21 | **Mobile sidebar + Client dashboard** | Completo | Menú hamburguesa con Sheet. Métricas personales para clientes. |
| 22 | **Admin create booking** | Completo | `admin-create-booking.tsx` — crear citas para clientes desde mostrador |
| 23 | **Recuperar contraseña** | Completo | `/recuperar` + `/recuperar/[token]` — flujo self-service con SendGrid |
| 24 | **Animaciones GSAP** | Completo | `animations.ts` + `animated-grid.tsx` — scroll reveal, hero timeline, parallax, countUp |

## 3. Pendiente (orden de prioridad)

| # | Tarea | Dependencias |
|---|-------|-------------|
| 1 | WhatsApp bot + IA agent | Backend: módulo WhatsApp + saaspa-IA |
| 2 | SSL/Certbot con Nginx en producción | VPS + dominio |
| 3 | Proxy.ts (migrar middleware deprecado de Next.js 16) | — |

## 4. Arquitectura de carpetas

```
src/
├── app/                        ← Next.js App Router (solo routing y layouts)
│   ├── (public)/               ← Sitio público (Navbar + Footer + WhatsAppFloat)
│   ├── (auth)/                 ← Login y registro (layout centrado)
│   ├── dashboard/              ← Panel admin/empleado (sidebar + auth guard)
│   ├── layout.tsx              ← Root: fuentes + ClientProviders
│   └── globals.css             ← Tokens oklch + shadcn Maia
├── components/
│   ├── ui/                     ← shadcn (NO editar manual)
│   ├── layout/                 ← Navbar, Footer, WhatsAppFloat, Providers
│   ├── marketing/              ← Hero, ServiceCard, Testimonial, CTA
│   └── dashboard/              ← StatsCard, AgendaTable...
├── lib/                        ← Lógica pura, sin JSX
│   ├── api.ts                  ← Fetch wrapper + refresh JWT
│   ├── auth.ts                 ← login/logout/register/refresh
│   ├── constants.ts            ← API_BASE_URL, ENDPOINTS, TOKEN_KEYS
│   ├── utils.ts                ← cn()
│   ├── fonts.ts                ← Fraunces + Geist
│   ├── animations.ts           ← GSAP helpers (scrollReveal, countUp, fadeInUp)
│   ├── meta-pixel.ts           ← Meta Pixel helpers (track, pageView)
│   ├── coupons-api.ts          ← Cupones API client
│   └── bookings-api.ts         ← Bookings API client
├── context/                    ← AuthProvider + useAuth
├── hooks/                      ← Custom hooks
├── types/                      ← TypeScript types
├── test/                       ← Utilidades de testing (MSW, fixtures)
└── __tests__/                  ← Tests (espejo de src/)
```

## 5. Puertos y URLs

| Entorno | Frontend | Backend | DB | Redis |
|---------|----------|---------|-----|-------|
| Dev | `localhost:3000` | `localhost:3001` | `:5432` | `:6379` |
| Prod | `kamerinosspa.com` (Nginx) | mismo dominio `/api/*` proxy | interno | interno |

## 6. CORS

- **Dev:** Backend permite `localhost:3000` vía `CORS_ORIGIN` en `.env`
- **Prod:** Sin CORS (mismo dominio vía Nginx reverse proxy)
- Validación: `CORS_ORIGIN` requerido en Joi schema del backend.

## 7. Comandos

```bash
npm run dev          # Next.js dev server (:3000)
npm run build        # Build de producción
npm run lint         # ESLint
npm run test         # Vitest (18 tests, 4 suites)
npm run test:watch   # Vitest en modo watch
```
