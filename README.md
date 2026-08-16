# Kamerinos SPA — Frontend

Plataforma web de Kamerinos SPA Bogotá — centro de estética y bienestar. Sitio público (marketing + agendamiento), área de autenticación y panel administrativo.

## Stack

| Tecnología | Versión | Uso |
|-----------|---------|-----|
| Next.js | 16.3 | App Router, React Server Components |
| React | 19.2 | UI |
| TypeScript | 5.x | Tipado estricto |
| Tailwind CSS | v4 | Estilos (CSS-first, `@theme`) |
| shadcn/ui | v4 (Maia) | Componentes base (Base UI) |
| Lucide React | latest | Iconografía line |
| GSAP | latest | Animaciones (ScrollTrigger, timelines) |
| Vitest | 3.x | Tests |
| MSW | 2.x | Mock de API en tests |

## Requisitos

- Node.js ≥ 20
- Backend NestJS corriendo en `localhost:3001` (ver `saaspa-backend`)

## Configuración

```bash
cp .env.example .env.local
# editar NEXT_PUBLIC_API_URL si el backend no está en localhost:3001
```

### Variables de entorno (Next.js)

Precedencia (mayor → menor): `.env.$(NODE_ENV).local` > `.env.local` > `.env.$(NODE_ENV)` > `.env`.
Las `NEXT_PUBLIC_*` se **inyectan en build** (no en runtime).

| Variable | Dev | Prod (Docker build args) |
|----------|-----|--------------------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | `https://kamerinos.sandrapinzonsaludybelleza.com.co` |
| `NEXT_PUBLIC_SITE_URL` | `http://localhost:3000` | dominio público |
| `NEXT_PUBLIC_META_PIXEL_ID` | **vacío** (Pixel apagado) | real |

> **Anti-contaminación:** el Pixel (`isPixelEnabled()`) exige `NODE_ENV === 'production'`
> además del ID → en dev **jamás** se dispara, aunque pongas el ID. El ID real solo
> entra por los build args del Docker (`kamerinos-infra/.env`). Ver `docs-general/ENV.md`.

## Comandos

```bash
npm run dev          # Dev server (:3000)
npm run build        # Build de producción
npm run start        # Servir build
npm run lint         # ESLint
npm run test         # Vitest (60 tests, 15 suites)
npm run test:watch   # Vitest en modo watch
npm run test:coverage # Cobertura de tests
```

## Estructura

La guía completa de arquitectura de carpetas está en [`docs/STRUCTURE.md`](./docs/STRUCTURE.md). Resumen:

```
src/
├── middleware.ts    # Protección de rutas por cookie (dashboard + login/registro)
├── app/             # App Router — (public) con /checkout, (auth), dashboard
├── components/      # ui/ (shadcn + CategorySelect), layout/, marketing/, booking/, dashboard/, shop/
├── lib/             # api.ts (cookies, credentials include), auth.ts, constants.ts, fonts.ts, utils.ts, *-api.ts (11 API clients), meta-pixel.ts, animations.ts
├── context/         # AuthProvider, CartProvider, CartProviderWithAuth, ToastProvider
├── hooks/           # Custom hooks
├── types/           # Tipos compartidos (auth, booking, service, payment, coupon, product, banner)
├── test/            # Mocks MSW + fixtures
└── __tests__/       # Tests unitarios e integración (15 suites, 60 tests)
```

## Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend | `localhost:3000` |
| Backend | `localhost:3001` |
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |

## Producción (un solo dominio)

> **Estado: v1.0.0 desplegada** en `https://kamerinos.sandrapinzonsaludybelleza.com.co`.

En producción todo se sirve bajo **un solo dominio**: `https://kamerinos.sandrapinzonsaludybelleza.com.co`.
El frontend usa URLs relativas (`/api`) y el backend se alcanza vía proxy `/api/*` (Nginx en prod,
rewrites de Next.js en dev). No hay subdominio `api.` separado.

## Flujo de trabajo (GitFlow)

- `main` — código estable
- `develop` — integración de features
- `feature/*` — nuevas funcionalidades
- `fix/*` — correcciones
- `hotfix/*` — correcciones urgentes a main
