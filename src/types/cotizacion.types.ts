export type EstadoCotizacion = 'pendiente' | 'asesoria' | 'pagada';

export interface Cliente {
  id: string;
  nombre: string;
  email: string;
  documento: string;
  cedula?: string;
  telefono: string;
  direccion: string;
  edad: number;
  created_at?: string;
  tendero?: {
    user?: {
      name?: string;
    };
  };
}

export interface Tendero {
  id: string;
  nombre: string;
  documento: string;
  email: string;
  telefono: string;
  direccion: string;
  comision_base: number;
  activo: boolean;
  fecha_registro: string;
  created_at?: string;
  user?: {
    name?: string;
    email?: string;
    phone?: string;
    active?: boolean;
  };
}

export interface Cotizacion {
  id: string;
  tendero_id: string;
  cliente_id: string;
  numero_personas: number;
  adultos_mayores: number;
  valor_total: number;
  estado: EstadoCotizacion;
  created_at: string;
  cliente?: Cliente;
  tendero?: Tendero & {
    user?: {
      name?: string;
    };
  };
}

export interface Venta {
  id: string;
  cotizacion_id: string;
  valor_pagado: number;
  metodo_pago: string;
  estado_pago: string;
  referencia_wompi: string;
  created_at: string;
  cotizacion?: Cotizacion;
}

export interface Comision {
  id: string;
  tendero_id: string;
  venta_id: string;
  valor_comision: number;
  created_at: string;
  tendero?: Tendero;
  venta?: Venta;
}

export interface CotizacionInput {
  numero_personas: number;
  edades: number[];
}

export interface CotizacionResult {
  numero_personas: number;
  adultos_mayores: number;
  valor_base: number;
  valor_adultos_mayores: number;
  valor_total: number;
  comision_tendero: number;
  comision_empresa: number;
}
