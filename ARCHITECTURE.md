# ARQUITECTURA DEL SISTEMA

## 📐 Diagrama General

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                      (Next.js 14 + TS)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Login   │  │Dashboard │  │Cotizador │  │  Admin   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Clientes │  │  Ventas  │  │Comisiones│  │  Perfil  │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            │ HTTP/S + REST API
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    CAPA DE SERVICIOS                         │
│                      (TypeScript)                            │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ auth.service │  │cotiza.service│  │admin.service │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ventas.service│  │comis.service │  │pagos.service │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬──────────────────────────────────┘
                            │
                            ▼
            ┌───────────────────────────────┐
            │                               │
            │        SUPABASE               │
            │     (Backend as Service)      │
            │                               │
            │  ┌─────────────────────┐      │
            │  │   PostgreSQL DB     │      │
            │  │  - users            │      │
            │  │  - tenderos         │      │
            │  │  - clientes         │      │
            │  │  - cotizaciones     │      │
            │  │  - ventas           │      │
            │  │  - comisiones       │      │
            │  └─────────────────────┘      │
            │                               │
            │  ┌─────────────────────┐      │
            │  │   Supabase Auth     │      │
            │  │  - JWT Tokens       │      │
            │  │  - Email Auth       │      │
            │  │  - Password Reset   │      │
            │  └─────────────────────┘      │
            │                               │
            │  ┌─────────────────────┐      │
            │  │   Row Level Sec.    │      │
            │  │  - Políticas RLS    │      │
            │  │  - Permisos         │      │
            │  └─────────────────────┘      │
            │                               │
            └───────────────────────────────┘

                            │
                            ▼
            ┌───────────────────────────────┐
            │                               │
            │         WOMPI API             │
            │    (Pasarela de Pagos)        │
            │                               │
            │  - PSE                        │
            │  - Tarjetas                   │
            │  - QR                         │
            │  - Webhooks                   │
            │                               │
            └───────────────────────────────┘
```

## 🔄 Flujo de Datos

### 1. Autenticación
```
Usuario → Login Form → Supabase Auth → JWT Token → Cookie → Middleware → Dashboard
```

### 2. Cotización
```
Tendero → Cotizador Form → calcularCotizacion() → Resultado
                                                      ↓
Cliente Form → crearCliente() → Supabase DB
                                     ↓
                            crearCotizacion() → Supabase DB
```

### 3. Pago
```
Cliente → Wompi Form → Wompi API → Pago Procesado
                                        ↓
                                   Webhook
                                        ↓
                          crearVenta() → Supabase DB
                                        ↓
                          actualizarCotizacion()
                                        ↓
                          crearComision() → Supabase DB
```

## 🗂️ Estructura de Carpetas

```
src/
├── app/                          # Pages (Next.js App Router)
│   ├── auth/                     # Autenticación
│   │   ├── login/
│   │   └── recover-password/
│   ├── dashboard/                # Dashboard principal
│   ├── cotizador/                # Cotizador
│   ├── clientes/                 # Gestión clientes
│   ├── ventas/                   # Historial ventas
│   ├── comisiones/               # Comisiones
│   ├── perfil/                   # Perfil usuario
│   ├── admin/                    # Panel admin
│   │   └── tenderos/
│   ├── api/                      # API Routes
│   │   └── webhooks/
│   │       └── wompi/
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # Componentes React
│   ├── ui/                       # UI Components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Alert.tsx
│   │   └── Table.tsx
│   ├── forms/                    # Formularios
│   │   ├── ClienteForm.tsx
│   │   └── CotizadorForm.tsx
│   ├── admin/                    # Componentes admin
│   │   ├── CrearTenderoModal.tsx
│   │   └── TenderosList.tsx
│   └── Sidebar.tsx
│
├── services/                     # Servicios/API calls
│   ├── auth.service.ts
│   ├── cotizacion.service.ts
│   ├── clientes.service.ts
│   ├── ventas.service.ts
│   ├── comisiones.service.ts
│   ├── pagos.service.ts
│   └── admin.service.ts
│
├── lib/                          # Configuración librerías
│   ├── supabase.ts
│   └── supabase-server.ts
│
├── types/                        # TypeScript types
│   ├── user.types.ts
│   └── cotizacion.types.ts
│
├── utils/                        # Utilidades
│   ├── validators.ts
│   ├── formatters.ts
│   └── cn.ts
│
├── errors/                       # Manejo errores
│   └── error-handler.ts
│
└── middleware.ts                 # Next.js middleware
```

## 🔐 Seguridad

### Row Level Security (RLS)

Cada tabla tiene políticas RLS que garantizan:
- Los tenderos solo ven sus propios datos
- Los administradores ven todo
- El call center ve lo necesario

### Autenticación

- JWT tokens con Supabase
- Refresh tokens automáticos
- Middleware de protección
- Validación en cada request

### Validación

- Frontend: Zod schemas
- Backend: Supabase constraints
- Sanitización de inputs
- Prevención de inyección SQL

## 📊 Base de Datos

### Relaciones

```
users (1) ──────> (1) tenderos
                       │
                       │ (1)
                       │
                       ▼
                       │ (N)
                    clientes
                       │
                       │ (1)
                       │
                       ▼
                       │ (N)
                  cotizaciones
                       │
                       │ (1)
                       │
                       ▼
                       │ (1)
                     ventas
                       │
                       │ (1)
                       │
                       ▼
                       │ (N)
                   comisiones
```

## 🚀 Despliegue

### Desarrollo
```bash
npm run dev
```

### Producción (Vercel)
```bash
npm run build
vercel --prod
```

### Variables de Entorno

```env
# Desarrollo
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Producción
NEXT_PUBLIC_APP_URL=https://tu-dominio.vercel.app
```

## 📈 Escalabilidad

### Actual
- Soporta miles de usuarios concurrentes
- Supabase maneja la escalabilidad DB
- Vercel maneja escalabilidad frontend

### Futuro
- Edge functions para lógica sensible
- CDN para assets estáticos
- Cache con Redis
- Microservicios si es necesario

## 🔄 CI/CD

### GitHub Actions (Sugerido)
```yaml
- Lint
- Tests
- Build
- Deploy to Vercel
```

## 📝 Logging y Monitoreo

### Sugerencias
- Vercel Analytics
- Sentry para errores
- LogRocket para sesiones
- Google Analytics

---

**Arquitectura diseñada para escalar y evolucionar con el negocio**
