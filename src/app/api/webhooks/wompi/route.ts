import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { crearVenta } from '@/services/ventas.service';
import { crearComision } from '@/services/comisiones.service';
import { actualizarEstadoCotizacion } from '@/services/cotizacion.service';
import { calcularCotizacion } from '@/services/cotizacion.service';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    // const signature = request.headers.get('x-signature');
    
    // Verificar firma de Wompi (implementar según documentación)
    // if (!verificarFirma(payload, signature)) {
    //   return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    // }
    
    const { event, data } = payload;
    
    if (event === 'transaction.updated' && data.status === 'APPROVED') {
      // Extraer información de la transacción
      const referencia = data.reference;
      
      // Buscar la cotización por referencia
      const { data: cotizacion } = await supabase
        .from('cotizaciones')
        .select('*, tendero:tenderos(*)')
        .eq('id', referencia)
        .single();
        
      if (!cotizacion) {
        return NextResponse.json({ error: 'Cotización no encontrada' }, { status: 404 });
      }
      
      // Crear registro de venta
      const venta = await crearVenta({
        cotizacion_id: cotizacion.id,
        valor_pagado: data.amount_in_cents / 100,
        metodo_pago: data.payment_method_type,
        estado_pago: data.status,
        referencia_wompi: data.id,
      });
      
      // Actualizar estado de cotización
      await actualizarEstadoCotizacion(cotizacion.id, 'pagada');
      
      // Calcular y crear comisión
      const resultado = calcularCotizacion({
        numero_personas: cotizacion.numero_personas,
        edades: [], // Las edades no se guardan, usar adultos_mayores
      });
      
      await crearComision({
        tendero_id: cotizacion.tendero_id,
        venta_id: venta.id,
        valor_comision: resultado.comision_tendero,
      });
      
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
