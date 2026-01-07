import { createClient } from '@/lib/supabase-server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatDate } from '@/utils/formatters';
import { Cliente } from '@/types/cotizacion.types';

async function obtenerClientes(userId: string, role: string) {
  const supabase = await createClient();
  
  if (role === 'admin' || role === 'callcenter') {
    const { data } = await supabase
      .from('clientes')
      .select('*, tendero:tenderos(*, user:users(name))')
      .order('created_at', { ascending: false });
      
    return data || [];
  } else if (role === 'tendero') {
    const { data: tendero } = await supabase
      .from('tenderos')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (!tendero) return [];
    
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .eq('tendero_id', tendero.id)
      .order('created_at', { ascending: false });
      
    return data || [];
  }
  
  return [];
}

export default async function ClientesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  const clientes = await obtenerClientes(user.id, profile.role);
  
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          {clientes.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay clientes registrados
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Email</TableHead>
                  {profile.role === 'admin' && <TableHead>Tendero</TableHead>}
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.map((cliente: Cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>{cliente.nombre}</TableCell>
                    <TableCell>{cliente.cedula}</TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.email}</TableCell>
                    {profile.role === 'admin' && (
                      <TableCell>{cliente.tendero?.user?.name || 'N/A'}</TableCell>
                    )}
                    <TableCell>{formatDate(cliente.created_at || '')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
