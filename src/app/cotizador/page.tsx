'use client';

import { useState } from 'react';
import { CotizadorForm } from '@/components/forms/CotizadorForm';
import { ClienteForm } from '@/components/forms/ClienteForm';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import { Alert } from '@/components/ui/Alert';
import { crearCotizacion } from '@/services/cotizacion.service';
import type { CotizacionResult, Cliente } from '@/types/cotizacion.types';
import { useRouter } from 'next/navigation';

export default function CotizadorPage() {
  const [cotizacionResult, setCotizacionResult] = useState<CotizacionResult | null>(null);
  const [showClienteForm, setShowClienteForm] = useState(false);
  const [tenderoId] = useState<string>(''); // Se obtendría del contexto de auth
  const [, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const handleCotizacionCalculada = (resultado: CotizacionResult) => {
    setCotizacionResult(resultado);
  };
  
  const handleClienteRegistrado = async (cliente: Cliente) => {
    if (!cotizacionResult) return;
    
    setLoading(true);
    setError('');
    
    try {
      const cotizacion = await crearCotizacion(tenderoId, cliente.id, cotizacionResult);
      setShowClienteForm(false);
      router.push(`/ventas?cotizacion=${cotizacion.id}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear cotización';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSolicitarAsesoria = async () => {
    if (!cotizacionResult) return;
    
    setShowClienteForm(true);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Cotizador de Planes</h1>
      
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      
      <CotizadorForm onCotizacionCalculada={handleCotizacionCalculada} />
      
      {cotizacionResult && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>¿Qué desea hacer el cliente?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => setShowClienteForm(true)}
                className="h-20"
              >
                Proceder con el Pago
              </Button>
              
              <Button
                onClick={handleSolicitarAsesoria}
                variant="secondary"
                className="h-20"
              >
                Solicitar Asesoría del Call Center
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Modal
        isOpen={showClienteForm}
        onClose={() => setShowClienteForm(false)}
        title="Registrar Cliente"
        size="lg"
      >
        <ClienteForm
          tenderoId={tenderoId}
          onSuccess={handleClienteRegistrado}
        />
      </Modal>
    </div>
  );
}
