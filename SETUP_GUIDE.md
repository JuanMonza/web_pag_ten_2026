# GUÍA DE CONFIGURACIÓN - PLATAFORMA PLANES EXEQUIALES

## 📋 PASO 1: Configurar Supabase

### 1.1 Crear Proyecto
1. Ve a [https://supabase.com](https://supabase.com)
2. Crea una cuenta o inicia sesión
3. Click en "New Project"
4. Completa:
   - Nombre del proyecto: "tenderos-exequiales"
   - Database Password: (guarda esta contraseña de forma segura)
   - Region: Selecciona la más cercana a tu ubicación
5. Click en "Create new project" y espera 1-2 minutos

### 1.2 Configurar Base de Datos
1. En el panel de Supabase, ve a "SQL Editor"
2. Abre el archivo `supabase/schema.sql` de este proyecto
3. Copia TODO el contenido
4. Pégalo en el SQL Editor de Supabase
5. Click en "Run" para ejecutar el script
6. Verifica que todas las tablas se crearon correctamente en "Table Editor"

### 1.3 Obtener Credenciales
1. Ve a "Settings" → "API"
2. Copia los siguientes valores:
   - Project URL (será tu `NEXT_PUBLIC_SUPABASE_URL`)
   - anon public key (será tu `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - service_role key (será tu `SUPABASE_SERVICE_ROLE_KEY`)

### 1.4 Configurar Autenticación
1. Ve a "Authentication" → "Providers"
2. Asegúrate que "Email" esté habilitado
3. En "Email Templates", personaliza:
   - Confirm signup
   - Reset password
   - Magic Link

### 1.5 Crear Usuario Administrador
1. Ve a "Authentication" → "Users"
2. Click en "Add user" → "Create new user"
3. Completa:
   - Email: tu-email@ejemplo.com
   - Password: (una contraseña segura)
   - Confirm password
4. Click en "Create user"
5. Copia el UUID del usuario creado
6. Ve al SQL Editor y ejecuta:
```sql
INSERT INTO users (id, name, email, phone, role, active)
VALUES (
  'UUID-COPIADO-AQUI',
  'Administrador Principal',
  'tu-email@ejemplo.com',
  '1234567890',
  'admin',
  true
);
```

## 📋 PASO 2: Configurar Wompi

### 2.1 Crear Cuenta
1. Ve a [https://wompi.co](https://wompi.co)
2. Regístrate o inicia sesión
3. Completa el proceso de verificación

### 2.2 Obtener Llaves
1. En el dashboard de Wompi, ve a "Configuración"
2. Selecciona "API Keys"
3. Copia:
   - Public Key (para el frontend)
   - Private Key (para el backend)
   - Integrity Key (para webhooks)

### 2.3 Configurar Webhook
1. En Wompi, ve a "Webhooks"
2. Crea un nuevo webhook:
   - URL: `https://tu-dominio.com/api/webhooks/wompi`
   - Eventos: Selecciona "transaction.updated"
3. Guarda la configuración

## 📋 PASO 3: Configurar Variables de Entorno

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Reemplaza los valores con tus credenciales:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui

# Wompi
NEXT_PUBLIC_WOMPI_PUBLIC_KEY=pub_test_tu-key-aqui
WOMPI_PRIVATE_KEY=prv_test_tu-key-aqui
WOMPI_INTEGRITY_KEY=tu-integrity-key-aqui

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. Guarda el archivo

## 📋 PASO 4: Instalar y Ejecutar

```bash
# Asegúrate de estar en la carpeta del proyecto
cd c:\Users\Mercadeo\Desktop\tenderos_2026

# Instalar dependencias (si aún no lo hiciste)
npm install

# Ejecutar en modo desarrollo
npm run dev
```

## 📋 PASO 5: Probar la Aplicación

### 5.1 Acceder al Login
1. Abre tu navegador en `http://localhost:3000`
2. Serás redirigido a `/auth/login`
3. Usa las credenciales del administrador que creaste

### 5.2 Crear un Tendero
1. Una vez dentro, el administrador puede crear tenderos
2. Los tenderos recibirán un email para confirmar su cuenta
3. Pueden iniciar sesión con sus credenciales

### 5.3 Probar el Cotizador
1. Inicia sesión como tendero
2. Ve a "Cotizador"
3. Ingresa el número de personas y edades
4. Verifica que el cálculo sea correcto

### 5.4 Registrar un Cliente
1. Después de cotizar, registra un cliente de prueba
2. Usa datos ficticios para testing

## 📋 PASO 6: Desplegar en Vercel

### 6.1 Conectar con GitHub
1. Sube tu código a GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/tu-usuario/tu-repo.git
git push -u origin main
```

### 6.2 Desplegar en Vercel
1. Ve a [https://vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa el repositorio
4. Configura las variables de entorno:
   - Copia todas las variables de `.env.local`
   - Pégalas en Vercel Settings → Environment Variables
   - Actualiza `NEXT_PUBLIC_APP_URL` con tu dominio de Vercel
5. Click en "Deploy"

### 6.3 Actualizar Webhook de Wompi
1. Una vez desplegado, copia tu URL de Vercel
2. Ve a Wompi y actualiza la URL del webhook:
   - Nueva URL: `https://tu-app.vercel.app/api/webhooks/wompi`

## 🎯 URLs Importantes

- **Desarrollo**: http://localhost:3000
- **Producción**: https://tu-app.vercel.app
- **Supabase Dashboard**: https://app.supabase.com
- **Wompi Dashboard**: https://comercios.wompi.co

## ✅ Checklist de Verificación

- [ ] Base de datos creada y configurada
- [ ] Usuario administrador creado
- [ ] Variables de entorno configuradas
- [ ] Aplicación corriendo en desarrollo
- [ ] Login funcionando
- [ ] Cotizador calculando correctamente
- [ ] Registro de clientes funcionando
- [ ] Wompi configurado (testing)
- [ ] Aplicación desplegada en Vercel
- [ ] Webhook de Wompi configurado

## 🆘 Solución de Problemas

### Error: "Invalid API Key"
- Verifica que las credenciales de Supabase estén correctas
- Asegúrate de no tener espacios extra en `.env.local`

### Error: "User not found"
- Verifica que el usuario se creó en Supabase Auth
- Verifica que se insertó el registro en la tabla `users`

### Error al conectar a la base de datos
- Verifica que las políticas RLS estén configuradas
- Verifica que el script SQL se ejecutó completamente

### La página no carga
- Verifica que el servidor esté corriendo (`npm run dev`)
- Revisa la consola del navegador para errores
- Verifica que todas las dependencias estén instaladas

## 📞 Siguiente Pasos

1. Personaliza los estilos según tu marca
2. Configura emails personalizados en Supabase
3. Prueba el flujo completo de pago con Wompi
4. Configura monitoreo y analytics
5. Implementa backups automáticos

---

**¡Felicidades! Tu plataforma está lista para usar.** 🎉
