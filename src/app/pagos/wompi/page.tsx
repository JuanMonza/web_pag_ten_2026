'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { Toast } from '@/components/ui/GlassComponents';
import { CreditCard, Building2, CheckCircle } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { simulateWompiApproval, sendPurchaseConfirmationEmail } from '@/lib/wompi';
import { getCurrentUser } from '@/lib/mock-auth';

function WompiPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('transactionId');
  const amount = parseInt(searchParams.get('amount') || '0');

  const [selectedBank, setSelectedBank] = useState('');
  const [personType, setPersonType] = useState<'natural' | 'juridica'>('natural');
  const [documentType, setDocumentType] = useState('CC');
  const [document, setDocument] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const bancos = [
    'Bancolombia',
    'Banco de Bogotá',
    'Davivienda',
    'BBVA Colombia',
    'Banco Popular',
    'Banco Caja Social',
    'Banco de Occidente',
    'Banco AV Villas',
    'Colpatria',
    'Itaú',
    'Scotiabank Colpatria',
  ];

  const handlePagar = async () => {
    if (!selectedBank || !document) {
      setToast({ message: 'Por favor completa todos los campos', type: 'error' });
      return;
    }

    const user = getCurrentUser();
    if (!user) {
      setToast({ message: 'Sesión expirada', type: 'error' });
      return;
    }

    setIsProcessing(true);

    try {
      console.log('💳 [WOMPI] Procesando pago PSE...');
      console.log('Banco:', selectedBank);
      console.log('Tipo persona:', personType);
      console.log('Documento:', document);

      // Simular flujo de aprobación de Wompi
      const result = await simulateWompiApproval(transactionId || '');

      if (result.status === 'APPROVED') {
        console.log('✅ [WOMPI] Pago aprobado');

        // Actualizar venta en localStorage
        const ventas = JSON.parse(localStorage.getItem('ventas_mock') || '[]');
        const ventaIndex = ventas.findIndex((v: { transactionId: string }) => v.transactionId === transactionId);
        
        if (ventaIndex !== -1) {
          ventas[ventaIndex].status = 'approved';
          ventas[ventaIndex].approvedAt = new Date().toISOString();
          ventas[ventaIndex].banco = selectedBank;
          localStorage.setItem('ventas_mock', JSON.stringify(ventas));

          // Enviar email de confirmación
          sendPurchaseConfirmationEmail(
            user.email,
            user.name,
            amount,
            transactionId || ''
          );
        }

        setToast({ message: '¡Pago aprobado exitosamente!', type: 'success' });

        setTimeout(() => {
          router.push('/pagos/confirmacion?status=success&transactionId=' + transactionId);
        }, 2000);
      } else {
        console.log('❌ [WOMPI] Pago rechazado');
        setToast({ message: 'Pago rechazado. Por favor intenta nuevamente', type: 'error' });
        
        setTimeout(() => {
          router.push('/pagos/confirmacion?status=failed&transactionId=' + transactionId);
        }, 2000);
      }
    } catch (error) {
      console.error('Error procesando pago:', error);
      setToast({ message: 'Error al procesar el pago', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <PageHeader 
        title="Pago con Wompi PSE"
        subtitle="Completa tu pago de forma segura"
      />

      <div className="max-w-2xl mx-auto px-6 py-8">
        <div 
          className="rounded-2xl p-8 border border-blue-200/50 shadow-lg"
          style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
              style={{ background: 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)' }}>
              <CreditCard className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-[#0049F3] mb-2">
              {formatCurrency(amount)}
            </h2>
            <p className="text-gray-600">Monto a pagar</p>
            <p className="text-sm text-gray-500 mt-1">ID: {transactionId}</p>
          </div>

          {/* Formulario PSE */}
          <div className="space-y-6">
            {/* Tipo de Persona */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tipo de Persona
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setPersonType('natural')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    personType === 'natural'
                      ? 'border-[#0049F3] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold">Natural</p>
                  </div>
                </button>
                <button
                  onClick={() => setPersonType('juridica')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    personType === 'juridica'
                      ? 'border-[#0049F3] bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <p className="font-semibold">Jurídica</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Tipo y Número de Documento */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tipo Doc.
                </label>
                <select
                  value={documentType}
                  onChange={(e) => setDocumentType(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
                >
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                  <option value="NIT">NIT</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Número de Documento
                </label>
                <input
                  type="text"
                  value={document}
                  onChange={(e) => setDocument(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
                  placeholder="Ej: 1234567890"
                />
              </div>
            </div>

            {/* Seleccionar Banco */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <Building2 className="w-5 h-5" />
                Selecciona tu Banco
              </label>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
              >
                <option value="">-- Selecciona un banco --</option>
                {bancos.map(banco => (
                  <option key={banco} value={banco}>{banco}</option>
                ))}
              </select>
            </div>

            {/* Botón de Pago */}
            <button
              onClick={handlePagar}
              disabled={isProcessing || !selectedBank || !document}
              className="w-full px-8 py-4 rounded-xl text-white text-lg font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              {isProcessing ? (
                <>⏳ Procesando...</>
              ) : (
                <>💳 Pagar con PSE</>
              )}
            </button>

            {/* Información de Seguridad */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-[#0049F3] shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold mb-1">Pago Seguro con Wompi</p>
                <p className="text-xs text-gray-600">
                  Tu información está protegida. Serás redirigido a la pasarela segura de tu banco.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Badge */}
        <div 
          className="mt-6 rounded-xl p-4 border border-yellow-300/50"
          style={{ background: 'rgba(251, 191, 36, 0.1)', backdropFilter: 'blur(10px)' }}
        >
          <p className="text-sm text-yellow-800">
            💡 <strong>Modo Demo:</strong> Esta es una simulación de Wompi PSE. En producción, se integra con la API real de Wompi.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function WompiPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <WompiPaymentContent />
    </Suspense>
  );
}
