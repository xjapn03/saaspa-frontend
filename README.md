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

## Comandos

```bash
npm run dev          # Dev server (:3000)
npm run build        # Build de producción
npm run start        # Servir build
npm run lint         # ESLint
npm run test         # Vitest (61 tests, 15 suites)
npm run test:watch   # Vitest en modo watch
npm run test:coverage # Cobertura de tests
```

## Estructura

La guía completa de arquitectura de carpetas está en [`docs/STRUCTURE.md`](./docs/STRUCTURE.md). Resumen:

```
src/
├── app/            # App Router — (public) con /checkout, (auth), dashboard
├── components/     # ui/ (shadcn + CategorySelect), layout/, marketing/, booking/, dashboard/, shop/
├── lib/            # api.ts, auth.ts, constants.ts, fonts.ts, utils.ts, *-api.ts (11 clients), meta-pixel.ts, animations.ts
├── context/        # AuthProvider, CartProvider, CartProviderWithAuth, ToastProvider
├── hooks/          # Custom hooks
├── types/          # Tipos compartidos (auth, booking, service, payment, coupon, product)
├── test/           # Mocks MSW + fixtures
└── __tests__/      # Tests unitarios e integración (15 suites, 61 tests)
```

## Puertos

| Servicio | Puerto |
|----------|--------|
| Frontend | `localhost:3000` |
| Backend | `localhost:3001` |
| PostgreSQL | `localhost:5432` |
| Redis | `localhost:6379` |

## Flujo de trabajo (GitFlow)

- `main` — código estable
- `develop` — integración de features
- `feature/*` — nuevas funcionalidades
- `fix/*` — correcciones
- `hotfix/*` — correcciones urgentes a main
