import { supabase } from '@/lib/supabase';
import { CotizacionInput, CotizacionResult } from '@/types/cotizacion.types';

const PLAN_BASE = 25000;
const ADICIONAL_ADULTO_MAYOR = 4000;
const COMISION_TENDERO_BASE = 8000;
const COMISION_EMPRESA_BASE = 17000;
const COMISION_TENDERO_ADULTO = 1500;
const COMISION_EMPRESA_ADULTO = 2500;

export function calcularCotizacion(input: CotizacionInput): CotizacionResult {
  const adultosMayores = input.edades.filter(edad => edad > 70).length;
  const valorAdultosMayores = adultosMayores * ADICIONAL_ADULTO_MAYOR;
  const valorTotal = PLAN_BASE + valorAdultosMayores;
  
  const comisionTendero = COMISION_TENDERO_BASE + (adultosMayores * COMISION_TENDERO_ADULTO);
  const comisionEmpresa = COMISION_EMPRESA_BASE + (adultosMayores * COMISION_EMPRESA_ADULTO);
  
  return {
    numero_personas: input.numero_personas,
    adultos_mayores: adultosMayores,
    valor_base: PLAN_BASE,
    valor_adultos_mayores: valorAdultosMayores,
    valor_total: valorTotal,
    comision_tendero: comisionTendero,
    comision_empresa: comisionEmpresa,
  };
}

export async function crearCotizacion(
  tenderoId: string,
  clienteId: string,
  resultado: CotizacionResult
) {
  const { data, error } = await supabase
    .from('cotizaciones')
    .insert({
      tendero_id: tenderoId,
      cliente_id: clienteId,
      numero_personas: resultado.numero_personas,
      adultos_mayores: resultado.adultos_mayores,
      valor_total: resultado.valor_total,
      estado: 'pendiente',
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function obtenerCotizaciones(tenderoId?: string) {
  let query = supabase
    .from('cotizaciones')
    .select(`
      *,
      cliente:clientes(*),
      tendero:tenderos(*, user:users(*))
    `)
    .order('created_at', { ascending: false });
    
  if (tenderoId) {
    query = query.eq('tendero_id', tenderoId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function actualizarEstadoCotizacion(
  cotizacionId: string,
  estado: 'pendiente' | 'asesoria' | 'pagada'
) {
  const { data, error } = await supabase
    .from('cotizaciones')
    .update({ estado })
    .eq('id', cotizacionId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}
