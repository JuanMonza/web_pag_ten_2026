import { supabase } from '@/lib/supabase';

export async function crearComision(comisionData: {
  tendero_id: string;
  venta_id: string;
  valor_comision: number;
}) {
  const { data, error } = await supabase
    .from('comisiones')
    .insert(comisionData)
    .select()
    .single();
    
  if (error) throw error;
  
  // Actualizar el total de comisiones del tendero
  await actualizarTotalComisiones(comisionData.tendero_id);
  
  return data;
}

async function actualizarTotalComisiones(tenderoId: string) {
  const { data: comisiones, error } = await supabase
    .from('comisiones')
    .select('valor_comision')
    .eq('tendero_id', tenderoId);
    
  if (error) throw error;
  
  const total = comisiones.reduce((sum, c) => sum + c.valor_comision, 0);
  
  await supabase
    .from('tenderos')
    .update({ comision_total: total })
    .eq('id', tenderoId);
}

export async function obtenerComisiones(tenderoId?: string) {
  let query = supabase
    .from('comisiones')
    .select(`
      *,
      tendero:tenderos(*, user:users(*)),
      venta:ventas(*, cotizacion:cotizaciones(*, cliente:clientes(*)))
    `)
    .order('created_at', { ascending: false });
    
  if (tenderoId) {
    query = query.eq('tendero_id', tenderoId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
