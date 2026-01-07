# 🚀 INICIO RÁPIDO - PLATAFORMA PLANES EXEQUIALES

## ⚡ En 5 Minutos

### 1. Instalar Dependencias
```bash
cd c:\Users\Mercadeo\Desktop\tenderos_2026
npm install
```

### 2. Configurar Supabase
1. Crear proyecto en https://supabase.com
2. Copiar URL y Keys
3. Ejecutar `supabase/schema.sql` en SQL Editor

### 3. Configurar .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=tu-url-aqui
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-key-aqui
```

### 4. Crear Usuario Admin
En Supabase Auth → Add User, luego en SQL Editor:
```sql
INSERT INTO users (id, name, email, phone, role, active)
VALUES ('UUID-DEL-USUARIO', 'Admin', 'admin@example.com', '1234567890', 'admin', true);
```

### 5. Ejecutar
```bash
npm run dev
```

### 6. Acceder
Abre http://localhost:3000

---

## 📋 Checklist Rápido

- [ ] ✅ Dependencias instaladas
- [ ] ✅ Supabase configurado
- [ ] ✅ Base de datos creada
- [ ] ✅ Usuario admin creado
- [ ] ✅ Variables de entorno configuradas
- [ ] ✅ Aplicación corriendo
- [ ] ✅ Login funcionando

---

## 🎯 Credenciales de Prueba

**Administrador:**
- Email: (el que creaste)
- Password: (la que configuraste)

---

## 📚 Documentación Completa

- **SETUP_GUIDE.md** - Guía paso a paso completa
- **README.md** - Documentación general
- **ARCHITECTURE.md** - Arquitectura del sistema
- **CHANGELOG.md** - Historial de cambios

---

## 🆘 Ayuda Rápida

**Error común:** "Invalid API Key"
→ Verifica las credenciales en .env.local

**Error común:** "User not found"
→ Verifica que creaste el usuario en la tabla users

**Error común:** No carga la página
→ Verifica que el servidor esté corriendo (npm run dev)

---

## 📞 Contacto

¿Necesitas ayuda? Revisa SETUP_GUIDE.md para más detalles.

---

**¡Listo para empezar! 🎉**
