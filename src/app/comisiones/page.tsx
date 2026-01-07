import { createClient } from '@/lib/supabase-server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Comision } from '@/types/cotizacion.types';

async function obtenerComisiones(userId: string, role: string) {
  const supabase = await createClient();
  
  if (role === 'admin') {
    const { data } = await supabase
      .from('comisiones')
      .select(`
        *,
        tendero:tenderos(*, user:users(name)),
        venta:ventas(*, cotizacion:cotizaciones(*, cliente:clientes(*)))
      `)
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
      .from('comisiones')
      .select(`
        *,
        venta:ventas(*, cotizacion:cotizaciones(*, cliente:clientes(*)))
      `)
      .eq('tendero_id', tendero.id)
      .order('created_at', { ascending: false });
      
    return data || [];
  }
  
  return [];
}

export default async function ComisionesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  const comisiones = await obtenerComisiones(user.id, profile.role);
  
  const totalComisiones = comisiones.reduce((sum: number, c: Comision) => sum + c.valor_comision, 0);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Comisiones</h1>
      
      <Card className="mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
        <CardContent className="p-6">
          <p className="text-lg opacity-90">Total Comisiones Acumuladas</p>
          <p className="text-4xl font-bold mt-2">{formatCurrency(totalComisiones)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Historial de Comisiones</CardTitle>
        </CardHeader>
        <CardContent>
          {comisiones.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay comisiones registradas
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Valor Venta</TableHead>
                  <TableHead>Comisión</TableHead>
                  {profile.role === 'admin' && <TableHead>Tendero</TableHead>}
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comisiones.map((comision: Comision) => (
                  <TableRow key={comision.id}>
                    <TableCell>
                      {comision.venta?.cotizacion?.cliente?.nombre || 'N/A'}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(comision.venta?.valor_pagado || 0)}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrency(comision.valor_comision)}
                    </TableCell>
                    {profile.role === 'admin' && (
                      <TableCell>{comision.tendero?.user?.name || 'N/A'}</TableCell>
                    )}
                    <TableCell>{formatDate(comision.created_at)}</TableCell>
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
