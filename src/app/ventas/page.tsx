import { createClient } from '@/lib/supabase-server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Venta } from '@/types/cotizacion.types';

async function obtenerVentas(userId: string, role: string) {
  const supabase = await createClient();
  
  const query = supabase
    .from('ventas')
    .select(`
      *,
      cotizacion:cotizaciones(
        *,
        cliente:clientes(*),
        tendero:tenderos(*, user:users(name))
      )
    `)
    .order('created_at', { ascending: false });
    
  if (role === 'tendero') {
    const { data: tendero } = await supabase
      .from('tenderos')
      .select('id')
      .eq('user_id', userId)
      .single();
      
    if (!tendero) return [];
    
    // Filtrar por tendero
    const { data } = await query;
    return data?.filter((venta: Venta) => venta.cotizacion?.tendero_id === tendero.id) || [];
  }
  
  const { data } = await query;
  return data || [];
}

export default async function VentasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  const ventas = await obtenerVentas(user.id, profile.role);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Ventas</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          {ventas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay ventas registradas
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Método de Pago</TableHead>
                  <TableHead>Estado</TableHead>
                  {profile.role === 'admin' && <TableHead>Tendero</TableHead>}
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ventas.map((venta: Venta) => (
                  <TableRow key={venta.id}>
                    <TableCell>{venta.cotizacion?.cliente?.nombre || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(venta.valor_pagado)}</TableCell>
                    <TableCell className="capitalize">{venta.metodo_pago}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        venta.estado_pago === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : venta.estado_pago === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {venta.estado_pago}
                      </span>
                    </TableCell>
                    {profile.role === 'admin' && (
                      <TableCell>{venta.cotizacion?.tendero?.user?.name || 'N/A'}</TableCell>
                    )}
                    <TableCell>{formatDate(venta.created_at)}</TableCell>
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
