import { supabase } from '@/lib/supabase';

export async function crearCliente(clienteData: {
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  tendero_id: string;
}) {
  const { data, error } = await supabase
    .from('clientes')
    .insert(clienteData)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function obtenerClientes(tenderoId?: string) {
  let query = supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (tenderoId) {
    query = query.eq('tendero_id', tenderoId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function buscarClientePorCedula(cedula: string) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('cedula', cedula)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}
