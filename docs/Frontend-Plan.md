# Plan de Estructura & Diseño — Kamerinos SPA Frontend

> **Estado actual:** Agosto 2026 — Layout público completo, auth conectado al backend, dashboard con sidebar/RBAC, tests funcionando.
> **Próximo paso:** Flujo de agendamiento `/agendar` con pasarela de pagos + Meta Pixel.

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

## 2. Módulos implementados

| # | Módulo | Estado | Archivos |
|---|--------|--------|----------|
| 1 | **Design tokens + tipografía** | Completo | `globals.css` (paleta oklch: terracota/salvia/blanco cálido), `lib/fonts.ts` (Fraunces + Geist) |
| 2 | **Layout público** | Completo | `navbar.tsx` (desktop + mobile sheet), `footer.tsx`, `whatsapp-float-button.tsx`, `(public)/layout.tsx` |
| 3 | **Home page** | Completo | 6 secciones: Hero, Filosofía, Servicios, Equipo, Testimonios, CTA cierre |
| 4 | **Servicios (público)** | Completo | `/servicios` (listing), `/servicios/[slug]` (detalle con beneficios) |
| 5 | **Políticas** | Completo | `/politicas` (abono, cancelación, puntualidad) |
| 6 | **Agendar** | Placeholder | `/agendar` (CTA WhatsApp, listo para flujo real) |
| 7 | **Auth (login/registro)** | Completo | `/login`, `/registro` — forms validados, conectados al backend NestJS |
| 8 | **API client** | Completo | `lib/api.ts` — fetch wrapper con refresh automático de JWT (401 → refresh → retry) |
| 9 | **Auth state** | Completo | `context/auth-provider.tsx` — AuthContext global, `useAuth()` hook |
| 10 | **Dashboard** | Layout completo + placeholders | `dashboard/layout.tsx` — sidebar con RBAC (ADMIN/EMPLEADO/CLIENTE), 6 vistas placeholder |
| 11 | **Navbar auth dinámico** | Completo | Botones "Iniciar sesión" / "Dashboard + nombre" según estado, desktop y mobile |
| 12 | **CORS + Envs** | Completo | `.env.example` + `.env.local` en frontend, `CORS_ORIGIN` validado en backend Joi |
| 13 | **Tests** | Completo (18 tests) | `vitest` + `@testing-library/react` + `msw`. 4 archivos: api, auth, service-card, home |
| 14 | **Documentación** | Completo | `docs/STRUCTURE.md` (guía de carpetas), `docs/Frontend-Plan.md` (este archivo) |

## 3. Pendiente (orden de prioridad)

| # | Tarea | Dependencias |
|---|-------|-------------|
| 1 | Flujo `/agendar`: service picker → calendario → resumen → pasarela de pago (Wompi) | Backend: módulo Payments + Bookings |
| 2 | Captura `ctwa_clid` + Meta Pixel + CAPI | Backend: módulo Meta |
| 3 | CRUD servicios en dashboard (admin) | Backend: módulo Services |
| 4 | Gestión de citas en dashboard | Backend: módulo Bookings |
| 5 | Gestión de clientes en dashboard (admin) | Backend: módulo Users (ya existe) |
| 6 | Cupones de descuento en dashboard (admin) | Backend: módulo Coupons |
| 7 | Animaciones (split-text, scroll reveal, GSAP) | — |
| 8 | Proxy.ts (migrar middleware deprecado de Next.js 16) | — |

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
│   └── services.ts             ← Datos placeholder (temporal)
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
