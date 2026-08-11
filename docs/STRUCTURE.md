# Estructura del Proyecto — Kamerinos SPA Frontend

```
src/
├── app/                        # Next.js App Router (file-system routing)
│   ├── (public)/               # Grupo de rutas: sitio público
│   │   ├── layout.tsx          # Layout compartido (Navbar + Footer + WhatsAppFloat)
│   │   ├── page.tsx            # Home — Hero, Filosofía, Servicios, Equipo, Testimonios, CTA
│   │   ├── servicios/
│   │   │   ├── page.tsx        # Listado completo de servicios
│   │   │   └── [slug]/page.tsx # Detalle individual de servicio
│   │   ├── shop/
│   │   │   ├── page.tsx        # Tienda online — listado con filtros por categoría
│   │   │   └── [slug]/page.tsx # Detalle de producto con galería
│   │   ├── agendar/page.tsx    # Flujo de agendamiento (placeholder)
│   │   └── politicas/page.tsx  # Políticas de cancelación y abono
│   │
│   ├── (auth)/                 # Grupo de rutas: autenticación
│   │   ├── layout.tsx          # Layout centrado minimal (sin Navbar público)
│   │   ├── login/page.tsx      # Formulario de inicio de sesión
│   │   └── registro/page.tsx   # Formulario de registro
│   │
│   ├── dashboard/              # Panel protegido (admin/empleado)
│   │   ├── layout.tsx          # Sidebar + auth guard (redirige a /login si no autenticado)
│   │   ├── page.tsx            # Resumen con tarjetas de stats
│   │   ├── citas/page.tsx      # Gestión de citas (placeholder)
│   │   ├── clientes/page.tsx   # Listado de clientes (placeholder, solo ADMIN)
│   │   ├── servicios/page.tsx  # CRUD servicios (placeholder, solo ADMIN)
│   │   ├── cupones/page.tsx    # Gestión de cupones (placeholder, solo ADMIN)
│   │   ├── productos/page.tsx  # Gestión de productos (Shop, solo ADMIN)
│   │   └── configuracion/page.tsx # Ajustes de cuenta (placeholder)
│   │
│   ├── layout.tsx              # Root layout: fonts, metadata, ClientProviders
│   └── globals.css             # Tokens de diseño (oklch) + estilos base Maia
│
├── components/
│   ├── ui/                     # shadcn/ui generados automáticamente — NO editar manual
│   │   ├── button.tsx          # Base UI button con variantes Maia
│   │   ├── card.tsx            # Card, CardHeader, CardTitle, CardFooter...
│   │   ├── badge.tsx           # Badge para tags/categorías
│   │   ├── separator.tsx       # Línea divisoria
│   │   ├── avatar.tsx          # Avatar circular
│   │   └── sheet.tsx           # Drawer lateral (menú mobile)
│   │
│   ├── layout/                 # Componentes de estructura global
│   │   ├── navbar.tsx          # Navbar fixed con links + menú mobile (Server Component)
│   │   ├── navbar-auth-buttons.tsx  # Botones dinámicos login/dashboard (Client)
│   │   ├── navbar-mobile-auth.tsx   # Auth en menú mobile (Client)
│   │   ├── footer.tsx          # Footer con filosofía, enlaces y contacto
│   │   ├── whatsapp-float-button.tsx # Botón flotante WhatsApp (Client)
│   │   └── client-providers.tsx # Wrapper "use client" para AuthProvider
│   │
│   ├── marketing/              # Secciones del Home
│   │   ├── hero.tsx            # Frase-manifiesto, 2 CTAs, 3 quick facts
│   │   ├── philosophy-pillars.tsx # 3 pilares (ícono + palabra + frase)
│   │   ├── service-card.tsx    # Card de servicio (categoría, duración, Inversión, link)
│   │   ├── team-card.tsx       # Sección equipo (avatar + nombre + credenciales + bio)
│   │   ├── testimonial-card.tsx # Testimonios (quote largo, sin estrellas)
│   │   └── cta-section.tsx     # CTA final fondo terracota
│   │
│   └── dashboard/              # Componentes del panel
│       └── stats-card.tsx      # Tarjeta de métrica (título, valor, ícono)
│
├── lib/                        # Lógica pura — sin React, sin JSX
│   ├── api.ts                  # ApiClient: fetch wrapper con refresh automático de JWT
│   ├── auth.ts                 # login(), register(), logout(), getProfile()
│   ├── constants.ts            # API_BASE_URL, ENDPOINTS, TOKEN_KEYS
│   ├── utils.ts                # cn() — clsx + tailwind-merge
│   ├── fonts.ts                # next/font (Fraunces heading + Geist body)
│   └── services.ts             # Datos placeholder de servicios (se reemplazará por API)
│
├── context/                    # React Context Providers
│   └── auth-provider.tsx       # AuthProvider + useAuth() — estado global de sesión
│
├── hooks/                      # Custom React hooks
│   └── use-auth.ts             # Hook re-export para consumir AuthContext
│
├── types/                      # Definiciones de tipos TypeScript
│   └── auth.ts                 # User, LoginRequest, RegisterRequest, AuthResponse, Role
│
├── test/                       # Utilidades de testing
│   ├── setup.ts                # Setup global (jest-dom matchers)
│   ├── mocks/
│   │   ├── server.ts           # MSW server para tests
│   │   └── handlers/
│   │       ├── auth.ts         # Mock handlers de /api/auth/*
│   │       └── users.ts        # Mock handlers de /api/users/*
│   └── fixtures/
│       └── user.ts             # Datos mock de usuario
│
└── __tests__/                  # Tests unitarios y de integración
    ├── lib/
    │   ├── api.test.ts         # ApiClient: refresh automático en 401
    │   └── auth.test.ts        # Auth: login guarda tokens, logout limpia
    ├── components/
    │   ├── service-card.test.tsx  # ServiceCard: renderiza nombre, Inversión, duración
    │   └── navbar.test.tsx        # Navbar: renderiza links, botón mobile
    └── pages/
        └── home.test.tsx       # Home: renderiza Hero, servicios, footer
```

## Principios de arquitectura

| Capa | Responsabilidad | NO debe |
|------|----------------|---------|
| **app/** | Routing, layouts, metadata | Lógica de negocio, fetch directo |
| **components/** | Solo UI (presentación) | Estado global, llamadas API directas |
| **lib/** | Lógica pura, API client, auth | JSX, React hooks |
| **context/** | Estado global React | JSX de presentación, lógica de routing |
| **types/** | Definiciones de tipos | Implementación, lógica |
| **hooks/** | Custom hooks reutilizables | JSX extenso, lógica de negocio compleja |
| **__tests__/** | Espejo de src/ para tests | Depender de servicios externos reales |

## Stack tecnológico

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
| Testing Library | 16.x | Tests de componentes |
| MSW | 2.x | Mock de API en tests |

## Puertos y URLs

| Entorno | Frontend | Backend | DB | Redis | IA Bot |
|---------|----------|---------|-----|-------|--------|
| Dev | `localhost:3000` | `localhost:3001` | `:5432` | `:6379` | `:8000` |
| Prod | `kamerinosspa.com` | mismo dominio (Nginx `/api/*` proxy) | interno | interno | interno |
