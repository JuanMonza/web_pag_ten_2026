import { supabase } from '@/lib/supabase';

export async function crearTendero(tenderoData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  direccion: string;
}) {
  // 1. Crear usuario en auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: tenderoData.email,
    password: tenderoData.password,
  });
  
  if (authError) throw authError;
  if (!authData.user) throw new Error('Error al crear usuario');
  
  // 2. Crear perfil de usuario
  const { error: userError } = await supabase
    .from('users')
    .insert({
      id: authData.user.id,
      name: tenderoData.name,
      email: tenderoData.email,
      phone: tenderoData.phone,
      role: 'tendero',
      active: true,
    });
    
  if (userError) throw userError;
  
  // 3. Crear tendero
  const { data: tendero, error: tenderoError } = await supabase
    .from('tenderos')
    .insert({
      user_id: authData.user.id,
      direccion: tenderoData.direccion,
      comision_total: 0,
    })
    .select()
    .single();
    
  if (tenderoError) throw tenderoError;
  
  return tendero;
}

export async function obtenerTenderos() {
  const { data, error } = await supabase
    .from('tenderos')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

export async function actualizarTendero(tenderoId: string, updates: any) {
  const { data, error } = await supabase
    .from('tenderos')
    .update(updates)
    .eq('id', tenderoId)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function desactivarTendero(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ active: false })
    .eq('id', userId);
    
  if (error) throw error;
}

export async function obtenerEstadisticas() {
  const [cotizaciones, ventas, comisiones, tenderos] = await Promise.all([
    supabase.from('cotizaciones').select('*', { count: 'exact', head: true }),
    supabase.from('ventas').select('*', { count: 'exact', head: true }),
    supabase.from('comisiones').select('valor_comision'),
    supabase.from('tenderos').select('*', { count: 'exact', head: true }),
  ]);
  
  const totalComisiones = comisiones.data?.reduce((sum, c) => sum + c.valor_comision, 0) || 0;
  
  return {
    totalCotizaciones: cotizaciones.count || 0,
    totalVentas: ventas.count || 0,
    totalComisiones,
    totalTenderos: tenderos.count || 0,
  };
}
