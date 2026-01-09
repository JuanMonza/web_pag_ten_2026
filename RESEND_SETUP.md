# Configuración de Resend para Envío de Correos Reales

## Pasos para Activar el Envío de Correos

### 1. Crear Cuenta en Resend
1. Ve a [https://resend.com](https://resend.com)
2. Crea una cuenta gratuita (100 emails/día gratis)
3. Verifica tu email

### 2. Obtener API Key
1. Entra a tu dashboard de Resend
2. Ve a **API Keys**
3. Crea una nueva API Key
4. Copia la key (solo se muestra una vez)

### 3. Configurar Variables de Entorno
Edita el archivo `.env.local` y reemplaza:

```env
RESEND_API_KEY=re_123456789_tu_api_key_real_aqui
NEXT_PUBLIC_EMAIL_FROM=onboarding@resend.dev
```

**Nota:** Para usar un dominio personalizado (ej: `noreply@jardinesdelrenacer.com`):
1. Ve a **Domains** en Resend
2. Agrega tu dominio
3. Configura los registros DNS según las instrucciones
4. Actualiza `NEXT_PUBLIC_EMAIL_FROM` con tu dominio verificado

### 4. Reiniciar el Servidor
```bash
# Detener el servidor (Ctrl+C)
npm run dev
```

## Funciones Disponibles

### Envío Básico
```typescript
import { sendEmail } from '@/services/email.service';

await sendEmail({
  to: 'cliente@example.com',
  subject: 'Asunto del correo',
  html: '<h1>Hola</h1><p>Contenido HTML</p>',
  text: 'Contenido texto plano'
});
```

### Plantillas Predefinidas
```typescript
import { sendEmail, emailTemplates } from '@/services/email.service';

// Registro de cliente
const template = emailTemplates.registroCliente('Juan Pérez');
await sendEmail({
  to: 'juan@example.com',
  ...template
});

// Confirmación de venta
const ventaTemplate = emailTemplates.confirmacionVenta(
  'Juan Pérez',
  'Plan Premium',
  3000000,
  'FAC-001'
);
await sendEmail({
  to: 'juan@example.com',
  ...ventaTemplate
});

// Recuperar contraseña
const resetTemplate = emailTemplates.recuperarContrasena(
  'Juan Pérez',
  'https://tuapp.com/reset/token123'
);
await sendEmail({
  to: 'juan@example.com',
  ...resetTemplate
});
```

## Dónde se Envían Correos Actualmente

1. **Registro de Usuario** → `src/utils/excel.ts`
   - Cliente: Email de bienvenida
   - Admin: Notificación de nuevo registro

2. **Actualización de Perfil** → `src/app/perfil/page.tsx`
   - Cliente: Confirmación de cambios
   - Admin: Notificación de actualización

## Probar el Sistema

### Test Rápido
1. Agrega tu email real en cualquier formulario
2. Completa la acción (registro, venta, etc.)
3. Revisa tu bandeja de entrada (y spam)

### Test desde Consola del Navegador
```javascript
// Abrir DevTools (F12) y pegar en Console:
await fetch('/api/send-email', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'tu-email@example.com',
    subject: 'Test desde Consola',
    html: '<h1>Prueba exitosa!</h1><p>Este correo se envió desde la consola del navegador.</p>',
    text: 'Prueba exitosa! Este correo se envió desde la consola.'
  })
}).then(r => r.json()).then(console.log);
```

## Límites del Plan Gratuito

- **100 emails/día**
- **Dominio onboarding@resend.dev** (default)
- Para más emails o dominio propio: planes desde $20/mes

## Troubleshooting

### Error: "Invalid API Key"
- Verifica que copiaste bien la API Key
- Reinicia el servidor después de editar `.env.local`

### Correos no llegan
1. Revisa la carpeta de spam
2. Verifica el email en el dashboard de Resend
3. Asegúrate de que el dominio esté verificado (si usas uno propio)

### Error 429 (Too Many Requests)
- Alcanzaste el límite de 100 emails/día
- Espera 24 horas o actualiza el plan

## Migración a Producción

Cuando despliegues en producción (Vercel/Netlify):
1. Agrega las variables de entorno en el panel de tu hosting
2. Usa un dominio verificado (no `onboarding@resend.dev`)
3. Considera aumentar el plan según tu tráfico

---

**Estado Actual:** ✅ Sistema configurado y listo para usar  
**Requiere:** API Key de Resend en `.env.local`
