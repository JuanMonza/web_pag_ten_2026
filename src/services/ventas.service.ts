import { supabase } from '@/lib/supabase';

export async function crearVenta(ventaData: {
  cotizacion_id: string;
  valor_pagado: number;
  metodo_pago: string;
  estado_pago: string;
  referencia_wompi: string;
}) {
  const { data, error } = await supabase
    .from('ventas')
    .insert(ventaData)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function obtenerVentas(tenderoId?: string) {
  let query = supabase
    .from('ventas')
    .select(`
      *,
      cotizacion:cotizaciones(
        *,
        cliente:clientes(*),
        tendero:tenderos(*, user:users(*))
      )
    `)
    .order('created_at', { ascending: false });
    
  if (tenderoId) {
    query = query.eq('cotizacion.tendero_id', tenderoId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
