-- Tabla de usuarios (extiende auth.users de Supabase)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'tendero', 'callcenter')),
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tenderos
CREATE TABLE tenderos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  direccion TEXT NOT NULL,
  comision_total DECIMAL(10, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clientes
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  cedula TEXT UNIQUE NOT NULL,
  telefono TEXT NOT NULL,
  email TEXT NOT NULL,
  tendero_id UUID NOT NULL REFERENCES tenderos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de cotizaciones
CREATE TABLE cotizaciones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tendero_id UUID NOT NULL REFERENCES tenderos(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE CASCADE,
  numero_personas INTEGER NOT NULL,
  adultos_mayores INTEGER DEFAULT 0,
  valor_total DECIMAL(10, 2) NOT NULL,
  estado TEXT NOT NULL CHECK (estado IN ('pendiente', 'asesoria', 'pagada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de ventas
CREATE TABLE ventas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cotizacion_id UUID NOT NULL REFERENCES cotizaciones(id) ON DELETE CASCADE,
  valor_pagado DECIMAL(10, 2) NOT NULL,
  metodo_pago TEXT NOT NULL,
  estado_pago TEXT NOT NULL,
  referencia_wompi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de comisiones
CREATE TABLE comisiones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tendero_id UUID NOT NULL REFERENCES tenderos(id) ON DELETE CASCADE,
  venta_id UUID NOT NULL REFERENCES ventas(id) ON DELETE CASCADE,
  valor_comision DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para mejorar el rendimiento
CREATE INDEX idx_tenderos_user_id ON tenderos(user_id);
CREATE INDEX idx_clientes_tendero_id ON clientes(tendero_id);
CREATE INDEX idx_clientes_cedula ON clientes(cedula);
CREATE INDEX idx_cotizaciones_tendero_id ON cotizaciones(tendero_id);
CREATE INDEX idx_cotizaciones_cliente_id ON cotizaciones(cliente_id);
CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX idx_ventas_cotizacion_id ON ventas(cotizacion_id);
CREATE INDEX idx_comisiones_tendero_id ON comisiones(tendero_id);
CREATE INDEX idx_comisiones_venta_id ON comisiones(venta_id);

-- Políticas de seguridad RLS (Row Level Security)

-- Habilitar RLS en todas las tablas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenderos ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cotizaciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE ventas ENABLE ROW LEVEL SECURITY;
ALTER TABLE comisiones ENABLE ROW LEVEL SECURITY;

-- Políticas para users
CREATE POLICY "Los usuarios pueden ver su propio perfil"
  ON users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Los administradores pueden ver todos los usuarios"
  ON users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Políticas para tenderos
CREATE POLICY "Los tenderos pueden ver su propia información"
  ON tenderos FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Los administradores pueden ver todos los tenderos"
  ON tenderos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

CREATE POLICY "Los administradores pueden insertar tenderos"
  ON tenderos FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Políticas para clientes
CREATE POLICY "Los tenderos pueden ver sus propios clientes"
  ON clientes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenderos
      WHERE tenderos.id = clientes.tendero_id
      AND tenderos.user_id = auth.uid()
    )
  );

CREATE POLICY "Los tenderos pueden insertar clientes"
  ON clientes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenderos
      WHERE tenderos.id = tendero_id
      AND tenderos.user_id = auth.uid()
    )
  );

CREATE POLICY "Los administradores pueden ver todos los clientes"
  ON clientes FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Políticas para cotizaciones
CREATE POLICY "Los tenderos pueden ver sus cotizaciones"
  ON cotizaciones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenderos
      WHERE tenderos.id = cotizaciones.tendero_id
      AND tenderos.user_id = auth.uid()
    )
  );

CREATE POLICY "Los tenderos pueden insertar cotizaciones"
  ON cotizaciones FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenderos
      WHERE tenderos.id = tendero_id
      AND tenderos.user_id = auth.uid()
    )
  );

CREATE POLICY "Los administradores pueden ver todas las cotizaciones"
  ON cotizaciones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Políticas para ventas
CREATE POLICY "Los tenderos pueden ver sus ventas"
  ON ventas FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM cotizaciones
      JOIN tenderos ON cotizaciones.tendero_id = tenderos.id
      WHERE cotizaciones.id = ventas.cotizacion_id
      AND tenderos.user_id = auth.uid()
    )
  );

CREATE POLICY "Los administradores pueden ver todas las ventas"
  ON ventas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Políticas para comisiones
CREATE POLICY "Los tenderos pueden ver sus comisiones"
  ON comisiones FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenderos
      WHERE tenderos.id = comisiones.tendero_id
      AND tenderos.user_id = auth.uid()
    )
  );

CREATE POLICY "Los administradores pueden ver todas las comisiones"
  ON comisiones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid() AND users.role = 'admin'
    )
  );

-- Función para actualizar el timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Insertar usuario administrador por defecto (opcional)
-- NOTA: Primero debes crear el usuario en Supabase Auth, luego insertar aquí
-- INSERT INTO users (id, name, email, phone, role, active)
-- VALUES ('uuid-del-usuario-auth', 'Administrador', 'admin@example.com', '1234567890', 'admin', true);
