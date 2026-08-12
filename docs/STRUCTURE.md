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
│   │   ├── agendar/page.tsx    # Flujo de agendamiento (service → slot → payment)
│   │   ├── checkout/page.tsx   # Checkout 2 pasos (facturación + pago Wompi)
│   │   └── politicas/page.tsx  # Políticas de cancelación y abono
│   │
│   ├── (auth)/                 # Grupo de rutas: autenticación
│   │   ├── layout.tsx          # Layout centrado minimal (sin Navbar público)
│   │   ├── login/page.tsx      # Formulario de inicio de sesión
│   │   ├── registro/page.tsx   # Formulario de registro
│   │   └── recuperar/
│   │       ├── page.tsx        # Solicitar recuperación de contraseña
│   │       └── [token]/page.tsx # Restablecer contraseña con token
│   │
│   ├── dashboard/              # Panel protegido (admin/empleado/cliente)
│   │   ├── layout.tsx          # Sidebar con RBAC + auth guard
│   │   ├── page.tsx            # Stats: citas hoy, clientes activos, ingresos mes
│   │   ├── citas/page.tsx      # Admin: BookingsTable. Cliente: ClientBookingCalendar
│   │   ├── clientes/page.tsx   # CRUD clientes con UserDetailDrawer (solo ADMIN)
│   │   ├── empleados/page.tsx  # CRUD empleados (solo ADMIN)
│   │   ├── servicios/page.tsx  # CRUD servicios con CategorySelect
│   │   ├── productos/page.tsx  # CRUD productos con ProductFormDrawer
│   │   ├── categorias/page.tsx # CRUD categorías con subcategorías
│   │   ├── cupones/page.tsx    # Gestión de cupones de descuento
│   │   └── configuracion/page.tsx # Ajustes de cuenta del usuario
│   │
│   ├── layout.tsx              # Root layout: fonts, metadata, ClientProviders, MetaPixel
│   └── globals.css             # Tokens de diseño (oklch) + estilos base Maia + number input fix
│
├── components/
│   ├── ui/                     # shadcn/ui (Base UI) — NO editar manual
│   │   ├── button.tsx          # Base UI button con variantes Maia + cursor-pointer
│   │   ├── card.tsx            # Card, CardHeader, CardContent, CardTitle, CardFooter
│   │   ├── badge.tsx           # Badge para tags/categorías/estados
│   │   ├── separator.tsx       # Línea divisoria horizontal/vertical
│   │   ├── avatar.tsx          # Avatar circular
│   │   ├── sheet.tsx           # Drawer lateral (menú mobile, carrito)
│   │   ├── modal.tsx           # Modal centrado con backdrop
│   │   ├── toast.tsx           # Toast notification con GSAP + event bus
│   │   └── category-select.tsx # Searchable dropdown con árbol de categorías
│   │
│   ├── layout/                 # Componentes de estructura global
│   │   ├── navbar.tsx          # Navbar fixed con links + menú mobile + CartIcon
│   │   ├── navbar-auth-buttons.tsx  # Botones dinámicos login/dashboard
│   │   ├── navbar-mobile-auth.tsx   # Auth en menú mobile
│   │   ├── footer.tsx          # Footer con filosofía, enlaces y contacto
│   │   ├── whatsapp-float-button.tsx # Botón flotante WhatsApp con GSAP
│   │   ├── client-providers.tsx # AuthProvider + CartProvider + ToastProvider + ToastContainer
│   │   ├── toast-container.tsx # Render de toasts activos suscrito al event bus
│   │   ├── cart-icon.tsx       # Ícono carrito + Sheet con items + coupon + navega a /checkout
│   │   ├── cart-item-row.tsx   # Fila de item en carrito (imagen, nombre, ± cantidad, eliminar)
│   │   ├── coupon-input.tsx    # Input + validación de cupón con couponsApi
│   │   ├── meta-pixel-script.tsx # Meta Pixel injection + ctwa_clid capture
│   │   └── animated-grid.tsx   # Wrapper con GSAP stagger reveal para grids
│   │
│   ├── marketing/              # Secciones del sitio público
│   │   ├── hero.tsx            # Frase-manifiesto, 2 CTAs, 3 quick facts con GSAP timeline
│   │   ├── philosophy-pillars.tsx # 3 pilares (ícono + palabra + frase)
│   │   ├── service-card.tsx    # Card de servicio (categoría, duración, Inversión, link)
│   │   ├── product-card.tsx    # Card de producto (sponsor, precio, tachado, stock, link)
│   │   ├── featured-products.tsx # Sección home con productos isFeatured + skeleton loading
│   │   ├── team-card.tsx       # Sección equipo (avatar + nombre + credenciales + bio)
│   │   ├── testimonial-card.tsx # Testimonios (quote largo, sin estrellas)
│   │   └── cta-section.tsx     # CTA final con parallax + scroll reveal
│   │
│   ├── booking/                # Flujo de agendamiento
│   │   ├── service-picker.tsx  # Selector de servicio con cards
│   │   ├── slot-picker.tsx     # Calendario de slots disponibles (API + slots libres)
│   │   ├── deposit-summary.tsx # Resumen del abono (servicio, fecha, 30%)
│   │   └── payment-widget.tsx  # Wompi widget con WhatsApp fallback + retry
│   │
│   ├── dashboard/              # Componentes del panel admin/cliente
│   │   ├── stats-card.tsx      # Tarjeta de métrica (título, valor, ícono) con GSAP
│   │   ├── bookings-table.tsx  # Tabla de citas con acciones (confirmar, cancelar, cobrar, reagendar)
│   │   ├── client-booking-calendar.tsx # Calendario mensual de citas del cliente + botón pagar
│   │   ├── admin-create-booking.tsx # Modal para admin crear cita a nombre de cliente
│   │   ├── users-table.tsx     # Tabla CRUD usuarios con búsqueda, sort, paginación
│   │   ├── edit-user-drawer.tsx # Modal crear/editar usuario con email, contraseña, rol
│   │   ├── user-detail-drawer.tsx # Drawer detalle usuario + historial de citas
│   │   ├── services-table.tsx  # Tabla CRUD servicios
│   │   ├── service-form-drawer.tsx # Modal crear/editar servicio con CategorySelect
│   │   ├── products-table.tsx  # Tabla CRUD productos
│   │   ├── product-form-drawer.tsx # Modal crear/editar producto con upload imágenes
│   │   ├── categories-table.tsx # Tabla CRUD categorías
│   │   ├── category-form-drawer.tsx # Modal crear/editar categoría con parentId
│   │   ├── coupons-table.tsx   # Tabla CRUD cupones
│   │   └── create-coupon-dialog.tsx # Modal crear cupón
│   │
│   └── shop/                   # Componentes de tienda
│       ├── add-to-cart-button.tsx # Botón agregar con validación stock + feedback
│       └── product-gallery.tsx # Galería de imágenes con thumbnails
│
├── lib/                        # Lógica pura — sin React, sin JSX
│   ├── api.ts                  # ApiClient: fetch wrapper con refresh automático de JWT
│   ├── auth.ts                 # login(), register(), logout(), refresh(), getProfile()
│   ├── constants.ts            # API_BASE_URL, ENDPOINTS (auth, users, services, products, categories, cart, bookings, coupons), TOKEN_KEYS
│   ├── utils.ts                # cn() — clsx + tailwind-merge
│   ├── fonts.ts                # next/font (Fraunces heading + Geist body/mono)
│   ├── animations.ts           # GSAP helpers (scrollReveal, countUp, fadeInUp, parallax, useReducedMotion)
│   ├── meta-pixel.ts           # Meta Pixel helpers (track, pageView, trackSchedule, trackPurchase)
│   ├── services-api.ts         # Servicios API client (listPublic, list, getById, create, update, remove)
│   ├── products-api.ts         # Productos API client (list, getBySlug, create, update, remove)
│   ├── categories-api.ts       # Categorías API client (list, tree, create, update, remove)
│   ├── bookings-api.ts         # Citas API client (list, slots, create, confirm, cancel, complete, reschedule, getBalance)
│   ├── payments-api.ts         # Pagos API client (init, getStatus, initCart)
│   ├── coupons-api.ts          # Cupones API client (list, create, validate, use, update, remove)
│   ├── cart-api.ts             # Carrito API client (get, addItem, updateQuantity, removeItem, clear, merge)
│   └── users.ts                # Usuarios API client (list, create, getById, update, remove, getProfile)
│
├── context/                    # React Context Providers
│   ├── auth-provider.tsx       # AuthProvider + useAuth() — estado global de sesión JWT
│   ├── cart-provider.tsx       # CartProvider + useCart() — carrito con localStorage + server sync + stock validation
│   ├── cart-provider-with-auth.tsx # Wrapper que pasa userId del auth al CartProvider
│   └── toast-provider.tsx      # ToastProvider + useToast() — success/error/info notifications
│
├── hooks/                      # Custom React hooks
│   └── use-auth.ts             # Deprecado — re-export de auth-provider
│
├── types/                      # Definiciones de tipos TypeScript
│   ├── auth.ts                 # User, Role, LoginRequest, RegisterRequest, AuthResponse
│   ├── booking.ts              # Booking, BookingStatus
│   ├── service.ts              # Service, CreateServiceRequest
│   ├── payment.ts              # PaymentInitResponse, BalanceResponse
│   ├── coupon.ts               # Coupon
│   └── product.ts              # Product
│
├── test/                       # Utilidades de testing
│   ├── setup.ts                # Setup global (@testing-library/jest-dom, mocks window)
│   ├── mocks/
│   │   ├── server.ts           # MSW server para tests
│   │   └── handlers/
│   │       ├── auth.ts         # Mock handlers de /api/auth/*
│   │       └── users.ts        # Mock handlers de /api/users/*
│   └── fixtures/
│       └── user.ts             # Datos mock de usuario
│
└── __tests__/                  # Tests unitarios y de integración (15 suites, 61 tests)
    ├── context/
    │   └── cart-provider.test.tsx     # CartProvider: add, remove, updateQty, coupon, clear, localStorage
    ├── lib/
    │   ├── api.test.ts                # ApiClient: GET, 401 error, 204 response
    │   └── auth.test.ts               # Auth: login, logout, isAuthenticated, register
    ├── components/
    │   ├── service-card.test.tsx      # ServiceCard: render, badge, price, link
    │   ├── product-card.test.tsx      # ProductCard: name, sponsor, category, strikethrough, link
    │   ├── cart-icon.test.tsx         # CartIcon: badge, empty state, item count, 9+
    │   ├── cart-item-row.test.tsx     # CartItemRow: name, price, quantity, remove click
    │   ├── add-to-cart-button.test.tsx # AddToCartButton: label, click, cart qty, stock 0
    │   ├── coupon-input.test.tsx      # CouponInput: empty, apply, validate, remove
    │   ├── bookings-table.test.tsx    # BookingsTable: error, empty, status labels
    │   ├── users-table.test.tsx       # UsersTable: role badges, add button, search
    │   ├── products-table.test.tsx    # ProductsTable: name/price, active/inactive, error
    │   ├── user-detail-drawer.test.tsx # UserDetailDrawer: info, closed, description
    │   └── featured-products.test.tsx # FeaturedProducts: loading, data, empty
    └── pages/
        └── home.test.tsx              # Home: Hero, facts, pillars, CTA, servicios MSW
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
| GSAP | latest | Animaciones (ScrollTrigger, timelines) |
| @gsap/react | latest | useGSAP hook |
| Vitest | 3.x | Tests unitarios/integración |
| Testing Library | 16.x | Tests de componentes |
| MSW | 2.x | Mock de API en tests |

## Puertos y URLs

| Entorno | Frontend | Backend | DB | Redis | IA Bot |
|---------|----------|---------|-----|-------|--------|
| Dev | `localhost:3000` | `localhost:3001` | `:5432` | `:6379` | `:8000` |
| Prod | `kamerinosspa.com` | mismo dominio (Nginx `/api/*` proxy) | interno | interno | interno |
