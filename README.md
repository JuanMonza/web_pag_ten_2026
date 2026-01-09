# Tenderos 2026 - Sistema de Gestión de Seguros

Sistema completo de gestión de cotizaciones y ventas de seguros desarrollado con Next.js 16 y Tailwind CSS 4.

**Desarrollado por Juan Monsalve - 2026**

## Descripción

Plataforma integral para la gestión de seguros de salud con sistema multi-rol (Admin, Call Center, Tendero), integración de pagos con Wompi PSE, y sistema completo de cotizaciones con beneficiarios y mascotas.

## Características Principales

### Sistema Multi-Rol
- **Admin**: Gestión completa de tenderos, call center, ventas y comisiones
- **Call Center**: Gestión de cotizaciones recibidas y conversión a ventas
- **Tendero**: Creación de cotizaciones, ventas directas y seguimiento de comisiones

### Módulo de Cotizaciones
- Cotizaciones para 1 titular + beneficiarios ilimitados
- Información detallada: email, parentesco, tipo documento (CC, CE, PEP, Pasaporte)
- Checkbox de pensionado para todos los cotizantes
- Inclusión de mascotas con nombre, raza y edad
- Cálculo automático de precios:
  - Base: $25,000 (1 titular + hasta 6 beneficiarios)
  - Beneficiarios extras: +$4,200 cada uno (después del 6to)
  - Mayores de 72 años: +$4,000 por persona
  - Mascotas: +$7,000 cada una

### Sistema de Pagos
- Integración con Wompi PSE
- 11 bancos colombianos disponibles
- Simulación de aprobación (90% éxito)
- Confirmación por email
- Tracking de transacciones

### Gestión Avanzada
- Dashboard con estadísticas en tiempo real
- Filtrado por roles
- Exportación a Excel
- Paginación glassmorphism
- Búsqueda y filtros avanzados

## Tecnologías

- **Framework**: Next.js 16.1.1 (App Router, Turbopack)
- **UI**: React 19, TypeScript
- **Estilos**: Tailwind CSS 4.1.18
- **Iconos**: Lucide React
- **Tema**: Royal Blue (#0049F3) con efectos glassmorphism
- **Autenticación**: Sistema Mock local (preparado para Supabase)
- **Pagos**: Integración Wompi PSE (simulada)

## Instalación

```bash
# Clonar repositorio
git clone https://github.com/tu-usuario/tenderos_2026.git

# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Usuarios Demo

```typescript
Admin:
  Email: admin@demo.com
  Password: admin123

Call Center:
  Email: callcenter@demo.com
  Password: callcenter123

Tendero:
  Email: tendero@demo.com
  Password: tendero123
```

## Estructura del Proyecto

```
tenderos_2026/
├── src/
│   ├── app/
│   │   ├── admin/          # Módulos de administración
│   │   ├── auth/           # Sistema de autenticación
│   │   ├── cotizaciones/   # Gestión de cotizaciones
│   │   ├── cotizador/      # Formulario de cotización
│   │   ├── dashboard/      # Dashboard principal
│   │   ├── pagos/          # Integración Wompi PSE
│   │   └── ventas/         # Gestión de ventas
│   ├── components/
│   │   └── ui/             # Componentes reutilizables
│   ├── lib/                # Utilidades y helpers
│   ├── services/           # Servicios de API
│   └── utils/              # Funciones auxiliares
├── public/                 # Archivos estáticos
└── README.md
```

## Modelo de Precios

### Plan Base
- **$25,000**: 1 Titular + hasta 6 Beneficiarios

### Cargos Adicionales
- **$4,200**: Por cada beneficiario después del 6to
- **$4,000**: Por cada persona mayor de 72 años
- **$7,000**: Por cada mascota incluida

### Datos Requeridos
**Titular:**
- Nombre completo
- Tipo documento (CC, CE, PEP, Pasaporte)
- Número de documento
- Teléfono
- Fecha de nacimiento
- Email
- ¿Es pensionado?

**Beneficiarios:**
- Nombre completo
- Tipo documento
- Número de documento
- Teléfono
- Fecha de nacimiento
- Parentesco
- ¿Es pensionado?

## Seguridad

- Sistema de autenticación con roles
- Validación de formularios
- Protección de rutas
- Manejo seguro de sesiones

## Scripts Disponibles

```bash
npm run dev      # Desarrollo con Turbopack
npm run build    # Build de producción
npm run start    # Iniciar producción
npm run lint     # Linter
```

## Despliegue

Optimizado para despliegue en:
- Vercel (recomendado)
- Netlify
- AWS Amplify
- Cualquier hosting con soporte Node.js

## Licencia

Proyecto privado - Todos los derechos reservados

## Desarrollador

**Juan Monsalve**  
Año: 2026  
Stack: Next.js + TypeScript + Tailwind CSS

---

*Sistema desarrollado con las mejores prácticas de React y Next.js, optimizado para rendimiento y experiencia de usuario.*
