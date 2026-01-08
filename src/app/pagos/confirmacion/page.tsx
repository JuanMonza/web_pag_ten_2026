'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { CheckCircle, XCircle, Home, FileText } from 'lucide-react';

function ConfirmacionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const transactionId = searchParams.get('transactionId');

  const isSuccess = status === 'success';

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      <PageHeader 
        title={isSuccess ? 'Pago Exitoso' : 'Pago Rechazado'}
        subtitle={isSuccess ? 'Tu compra ha sido confirmada' : 'No se pudo procesar el pago'}
        showNavigation={false}
      />

      <div className="max-w-2xl mx-auto px-6 py-12">
        <div 
          className="rounded-2xl p-12 border border-blue-200/50 shadow-lg text-center"
          style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
        >
          {/* Ícono */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6"
            style={{ 
              background: isSuccess 
                ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
                : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
            }}>
            {isSuccess ? (
              <CheckCircle className="w-12 h-12 text-white" />
            ) : (
              <XCircle className="w-12 h-12 text-white" />
            )}
          </div>

          {/* Mensaje */}
          <h2 className="text-3xl font-bold mb-4" style={{ 
            color: isSuccess ? '#059669' : '#dc2626' 
          }}>
            {isSuccess ? '¡Pago Aprobado!' : 'Pago Rechazado'}
          </h2>

          <p className="text-gray-700 text-lg mb-6">
            {isSuccess 
              ? 'Tu suscripción al plan ha sido activada exitosamente. Te hemos enviado un email de confirmación.'
              : 'No se pudo completar el pago. Por favor intenta nuevamente o contacta con tu banco.'}
          </p>

          <div className="p-4 bg-gray-100 rounded-lg mb-8">
            <p className="text-sm text-gray-600">ID de Transacción</p>
            <p className="text-lg font-mono font-semibold text-gray-800">{transactionId}</p>
          </div>

          {/* Acciones */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)',
              }}
            >
              <Home className="w-5 h-5 inline mr-2" />
              Ir al Dashboard
            </button>

            {!isSuccess && (
              <button
                onClick={() => router.push('/cotizador')}
                className="px-6 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                }}
              >
                <FileText className="w-5 h-5 inline mr-2" />
                Intentar Nuevamente
              </button>
            )}
          </div>

          {/* Información adicional para pagos exitosos */}
          {isSuccess && (
            <div className="mt-8 p-4 bg-blue-50 rounded-lg text-left">
              <p className="text-sm font-semibold text-[#0049F3] mb-2">📧 Email de Confirmación Enviado</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>✓ Confirmación de compra</li>
                <li>✓ Detalles del plan contratado</li>
                <li>✓ Información de contacto</li>
                <li>✓ Recibo de pago</li>
              </ul>
            </div>
          )}
        </div>

        {/* Demo Badge */}
        <div 
          className="mt-6 rounded-xl p-4 border border-yellow-300/50"
          style={{ background: 'rgba(251, 191, 36, 0.1)', backdropFilter: 'blur(10px)' }}
        >
          <p className="text-sm text-yellow-800">
            💡 <strong>Modo Demo:</strong> En producción, el email de confirmación se envía automáticamente y la venta se registra en la base de datos.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmacionPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ConfirmacionContent />
    </Suspense>
  );
}
