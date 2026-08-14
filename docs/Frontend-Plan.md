# Plan de Estructura & Diseño — Kamerinos SPA Frontend

> **Estado actual:** Agosto 2026 — Layout público, auth, dashboard completo, Wompi real, Shop + Carrito + Checkout, Google Calendar, Cupones, Meta Pixel/CAPI, Animaciones GSAP, Toast/Modal, Mobile sidebar, Client dashboard, Admin booking + products, Recuperar contraseña, Verificación de email, Páginas legales, 61 tests (15 suites) — todos completos y mergeados.
> **Próximo paso:** Release v1.0.0 → main. Luego WhatsApp bot + IA agent.

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
| 13 | **Tests** | Completo (61 tests, 15 suites) | `vitest` + `@testing-library/react` + `msw`. 15 archivos. Ver `docs-general/TEST-COVERAGE.md` |
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
| 51 | **Verificación de email** | Completo | `/verificar-email/[token]` (GET `/auth/verify-email/:token`) + aviso en registro tras crear la cuenta |
| 52 | **Páginas legales** | Completo | `/politica-de-privacidad`, `/terminos-y-condiciones`, `/eliminar-datos` (para la Meta App) con animaciones GSAP |
| 24 | **Animaciones GSAP** | Completo | `animations.ts` + `animated-grid.tsx` — scroll reveal, hero timeline, parallax, countUp |
| 25 | **Admin products** | Completo | `products-table.tsx` + dashboard page — CRUD de productos |
| 26 | **Shop e-commerce** | Completo | `/shop` (listing + filtros), `/shop/[slug]` (detalle + galería), `ProductCard`, `FeaturedProducts` |
| 27 | **Carrito de compras** | Completo | `CartContext`, `CartProviderWithAuth`, `CartIcon`, `CartSheet`, `AddToCartButton`, `CouponInput`, `CartItemRow` |
| 28 | **Checkout Wompi** | Completo | `initCartPayment`, widget Wompi en CartSheet, success/error states, carrito local + server-side sync |
| 29 | **Admin categories CRUD** | Completo | `categories-table.tsx` + `category-form-drawer.tsx` + `/dashboard/categorias` con sidebar |
| 30 | **Checkout page** | Completo | `/checkout` — 2 steps: facturación/envío + resumen + pago Wompi full-page |
| 31 | **Stock validation** | Completo | `CartItem.maxQuantity`, límites en `AddToCartButton` y `CartItemRow` |
| 32 | **CategorySelect** | Completo | `category-select.tsx` — dropdown con búsqueda inline e indentación de subcategorías |
| 33 | **Payment fallback** | Completo | WhatsApp button en `PaymentWidget` si Wompi no responde + mensaje de reserva temporal |
| 34 | **Toast notifications** | Completo | `ToastProvider` + `useToast()` hook + `toastEmitter` + integrado en client-providers |
| 35 | **Orders/Pedidos** | Completo | `OrdersTable` (admin, con filtros search/status/date + transiciones estado), `MyOrders` (cliente), `/dashboard/pedidos` role-aware, sidebar Package |
| 36 | **Tips wellness** | Completo | `TipsCard` — 18 tips de bienestar rotativos cada 10s con GSAP en dashboard cliente |
| 37 | **Calendario interactivo** | Completo | `ClientBookingCalendar` — click en día abre modal con detalle de citas, acciones (pagar saldo, WhatsApp) |
| 38 | **Facturación admin** | Completo | `PaymentsTable` + `/dashboard/facturas` — trazabilidad completa de pagos/abonos/compras con filtros |
| 39 | **CI/CD** | Completo | GitHub Actions: pipelines separados por repo (back: lint+typecheck+tests, front: tests+build) |
| 40 | **SEO + Preloader** | Completo | metadata OG/twitter, JSON-LD (LocalBusiness, WebSite, Organization), sitemap, robots.txt, metadata en páginas públicas, Speculation Rules (prerender nativo), Preloader con fade-out + curtain |
| 41 | **Revenue + Pago local** | Completo | KPI ingresos del mes con revenue real (todos los pagos aprobados), botón pago en local (efectivo/transferencia) en admin bookings, balance visible en calendario cliente, columna método de pago en facturación |
| 42 | **Type fixes build** | Completo | Correcciones de tipo en tests, service types, cart item y booking types — `npm run build` pasa sin errores |
| 43 | **Historial + Trazabilidad + Paginación inicial** | Completo | Historial de citas pasadas con paginación en calendario cliente, trazabilidad de pagos (columna Cita #id en facturación), índices DB, paginación server-side en bookings |
| 44 | **Paginación universal** | Completo | Tipo `PaginatedResult<T>` compartido en frontend, todos los API clients y componentes de tabla adaptados al nuevo formato paginado |
| 45 | **Auditoría + filtros** | Completo | Página `/dashboard/auditoria` (solo ADMIN) con paginación y filtros por entidad, acción y rango de fechas (`audit-api.ts`) |
| 46 | **Filtros por estado admin** | Completo | Productos usan `GET /products/admin/all` (inactivos visibles), usuarios con `includeInactive`, activar/desactivar |
| 47 | **Toasts en creación/edición** | Completo | `useToast().success/error` en usuarios, servicios, productos, categorías y cupones |
| 48 | **Detalle de servicio por slug** | Completo | `/servicios/[slug]` consulta `GET /services/public/:slug`; cards usan `svc.slug` |
| 49 | **Cupones con límites** | Completo | Tabla muestra `usedCount/maxUses` y estado (agotado/expirado/inactivo); diálogo con máximo de usos |
| 50 | **Proxy de uploads** | Completo | `next.config.ts` rewrite `/uploads/*` → backend: las imágenes de productos cargan desde el frontend |

## 3. Pendiente (orden de prioridad)

| # | Tarea | Dependencias |
|---|-------|-------------|
| 1 | Release v1.0.0 (merge a main) | — |
| 2 | WhatsApp bot + IA agent | Backend: módulo WhatsApp + saaspa-IA |
| 3 | SSL/Certbot con Nginx en producción | VPS + dominio |
| 4 | Proxy.ts (migrar middleware deprecado de Next.js 16) | — |
| 5 | Backups automatizados en VPS | Scripts ya creados, falta activar cron |

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
| Prod | `kamerinos.sandrapinzonsaludybelleza.com.co` (Nginx) | mismo dominio `/api/*` proxy | interno | interno |

## 6. CORS

- **Dev:** Backend permite `localhost:3000` vía `CORS_ORIGIN` en `.env`
- **Prod:** Sin CORS (mismo dominio vía Nginx reverse proxy)
- Validación: `CORS_ORIGIN` requerido en Joi schema del backend.

## 7. Comandos

```bash
npm run dev          # Next.js dev server (:3000)
npm run build        # Build de producción
npm run lint         # ESLint
npm run test         # Vitest (61 tests, 15 suites)
npm run test:watch   # Vitest en modo watch
```
