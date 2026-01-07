import { createClient } from '@/lib/supabase-server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, ShoppingCart, DollarSign, Calculator } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';

async function getEstadisticas(userId: string, role: string) {
  const supabase = await createClient();
  
  if (role === 'admin') {
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
  } else if (role === 'tendero') {
    const { data: tendero } = await supabase
      .from('tenderos')
      .select('id, comision_total')
      .eq('user_id', userId)
      .single();
      
    if (!tendero) return null;
    
    const [cotizaciones, ventas] = await Promise.all([
      supabase.from('cotizaciones').select('*', { count: 'exact', head: true }).eq('tendero_id', tendero.id),
      supabase.from('ventas').select('*', { count: 'exact', head: true }),
    ]);
    
    return {
      totalCotizaciones: cotizaciones.count || 0,
      totalVentas: ventas.count || 0,
      totalComisiones: tendero.comision_total || 0,
    };
  }
  
  return null;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return null;
  
  const { data: profile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single();
    
  const estadisticas = await getEstadisticas(user.id, profile.role);
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Bienvenido, {profile.name}
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {profile.role === 'admin' && (
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex-shrink-0 bg-blue-100 rounded-lg p-3">
                <Users className="text-blue-600" size={32} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Tenderos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {estadisticas?.totalTenderos || 0}
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
              <Calculator className="text-purple-600" size={32} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Cotizaciones</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.totalCotizaciones || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
              <ShoppingCart className="text-green-600" size={32} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Ventas</p>
              <p className="text-2xl font-bold text-gray-900">
                {estadisticas?.totalVentas || 0}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
              <DollarSign className="text-yellow-600" size={32} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Comisiones</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(estadisticas?.totalComisiones || 0)}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Instrucciones de Uso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Cotizador</h3>
              <p className="text-gray-600">
                Utiliza el cotizador para calcular el valor del plan exequial según el número de personas y edades.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">2. Registro de Clientes</h3>
              <p className="text-gray-600">
                Registra los datos del cliente para generar la cotización y procesar el pago.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">3. Opciones de Venta</h3>
              <p className="text-gray-600">
                El cliente puede pagar inmediatamente o solicitar asesoría del call center.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-2">4. Comisiones</h3>
              <p className="text-gray-600">
                Tu comisión se calcula automáticamente al confirmar el pago.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
