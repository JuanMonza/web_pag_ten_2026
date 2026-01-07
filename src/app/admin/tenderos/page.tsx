import { createClient } from '@/lib/supabase-server';
import { TenderosList } from '@/components/admin/TenderosList';
import { redirect } from 'next/navigation';

async function obtenerTenderos() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tenderos')
    .select('*, user:users(*)')
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export default async function AdminTenderosPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/auth/login');
  }
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  if (profile?.role !== 'admin') {
    redirect('/dashboard');
  }
  
  const tenderos = await obtenerTenderos();
  
  return <TenderosList tenderos={tenderos} />;
}
