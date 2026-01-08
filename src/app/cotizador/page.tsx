'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassButton, Toast } from '@/components/ui/GlassComponents';
import { Plus, Trash2, User, DollarSign, Send, CreditCard } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { getCurrentUser } from '@/lib/mock-auth';
import { createWompiTransaction } from '@/lib/wompi';

interface Cotizante {
  id: string;
  nombre: string;
  tipoCedula: 'CC' | 'CE' | 'PEP' | 'Pasaporte';
  cedula: string;
  telefono: string;
  fechaNacimiento: string;
  edad: number;
  email?: string; // Solo para el titular
  parentesco?: string; // Solo para beneficiarios
  esPensionado: boolean;
}

interface Mascota {
  id: string;
  nombre: string;
  raza: string;
  edad: number;
}

const RAZAS_MASCOTAS = [
  'Perro - Pequeño',
  'Perro - Mediano',
  'Perro - Grande',
  'Gato - Doméstico',
  'Gato - Persa',
  'Otro',
];

export default function CotizadorPage() {
  const router = useRouter();
  const [cotizantes, setCotizantes] = useState<Cotizante[]>([
    { id: '1', nombre: '', tipoCedula: 'CC', cedula: '', telefono: '', fechaNacimiento: '', edad: 0, email: '', esPensionado: false }
  ]);
  const [mascotas, setMascotas] = useState<Mascota[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const calcularEdad = (fechaNacimiento: string): number => {
    if (!fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  };

  const handleCotizanteChange = (id: string, field: string, value: string) => {
    setCotizantes(cotizantes.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'fechaNacimiento') {
          updated.edad = calcularEdad(value);
        }
        return updated;
      }
      return c;
    }));
  };

  const agregarCotizante = () => {
    setCotizantes([
      ...cotizantes,
      { 
        id: Date.now().toString(), 
        nombre: '', 
        tipoCedula: 'CC',
        cedula: '', 
        telefono: '', 
        fechaNacimiento: '', 
        edad: 0,
        parentesco: '', // Solo para beneficiarios
        esPensionado: false
      }
    ]);
  };

  const eliminarCotizante = (id: string) => {
    if (cotizantes.length > 1) {
      setCotizantes(cotizantes.filter(c => c.id !== id));
    }
  };

  const agregarMascota = () => {
    setMascotas([
      ...mascotas,
      { id: Date.now().toString(), nombre: '', raza: RAZAS_MASCOTAS[0], edad: 0 }
    ]);
  };

  const eliminarMascota = (id: string) => {
    setMascotas(mascotas.filter(m => m.id !== id));
  };

  const handleMascotaChange = (id: string, field: string, value: string) => {
    setMascotas(mascotas.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const calcularTotal = () => {
    const BASE = 25000; // Precio fijo (1 titular + hasta 6 beneficiarios)
    const ADICIONAL_MAYOR_72 = 4000;
    const PRECIO_MASCOTA = 7000;
    const BENEFICIARIO_EXTRA = 4200; // Por cada beneficiario después del 6to

    // Base fija de $25,000
    let total = BASE;
    
    // Si hay más de 7 personas (1 titular + 6 beneficiarios), cobrar $4,200 por cada adicional
    if (cotizantes.length > 7) {
      const beneficiariosExtras = cotizantes.length - 7;
      total += beneficiariosExtras * BENEFICIARIO_EXTRA;
    }
    
    // Sumar recargo solo por personas mayores de 72 años
    cotizantes.forEach(c => {
      if (c.edad > 72) {
        total += ADICIONAL_MAYOR_72;
      }
    });

    // Sumar costo de mascotas
    total += mascotas.length * PRECIO_MASCOTA;

    return total;
  };

  const handleCotizar = () => {
    if (cotizantes.length === 0) {
      setToast({ message: 'Debes agregar al menos el titular', type: 'error' });
      return;
    }

    // Validar titular (index 0): debe tener email
    const titular = cotizantes[0];
    if (!titular.nombre || !titular.cedula || !titular.telefono || !titular.fechaNacimiento || !titular.email) {
      setToast({ message: 'Por favor completa todos los datos del titular (incluyendo correo electrónico)', type: 'error' });
      return;
    }

    // Validar beneficiarios (index > 0): deben tener parentesco
    const beneficiariosIncompletos = cotizantes.slice(1).some(c => 
      !c.nombre || !c.cedula || !c.telefono || !c.fechaNacimiento || !c.parentesco
    );

    if (beneficiariosIncompletos) {
      setToast({ message: 'Por favor completa todos los datos de los beneficiarios (incluyendo parentesco)', type: 'error' });
      return;
    }

    setShowResult(true);
    setToast({ message: 'Cotización calculada exitosamente', type: 'success' });
  };

  const handleEnviarCotizacion = async () => {
    const user = getCurrentUser();
    if (!user) {
      setToast({ message: 'Sesión expirada', type: 'error' });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simular envío a call center
      const cotizacion = {
        id: `COT-${Date.now()}`,
        cotizantes,
        mascotas,
        total: calcularTotal(),
        createdBy: user.name,
        createdByRole: user.role,
        createdAt: new Date().toISOString(),
        status: 'pending',
      };

      console.log('📨 [COTIZACIÓN] Enviando a Call Center:', cotizacion);

      // Guardar en localStorage (simular envío a base de datos)
      const cotizaciones = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
      cotizaciones.push(cotizacion);
      localStorage.setItem('cotizaciones', JSON.stringify(cotizaciones));

      await new Promise(resolve => setTimeout(resolve, 1000));

      setToast({ message: 'Cotización enviada a Call Center exitosamente', type: 'success' });
      
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      console.error('Error enviando cotización:', error);
      setToast({ message: 'Error al enviar cotización', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVenderPlan = async () => {
    const user = getCurrentUser();
    if (!user) {
      setToast({ message: 'Sesión expirada', type: 'error' });
      return;
    }

    setIsProcessing(true);

    try {
      const total = calcularTotal();
      const clientePrincipal = cotizantes[0];

      // Crear transacción en Wompi
      const transaction = await createWompiTransaction({
        amount: total,
        reference: `PLAN-${Date.now()}`,
        customerEmail: user.email,
        customerName: clientePrincipal.nombre,
        currency: 'COP',
        redirectUrl: window.location.origin + '/pagos/confirmacion',
      });

      console.log('💳 [VENTA] Transacción creada:', transaction);

      // Guardar venta en localStorage
      const venta = {
        id: `VENTA-${Date.now()}`,
        cotizantes,
        mascotas,
        total,
        vendidoPor: user.name,
        vendidoPorRole: user.role,
        metodoPago: 'Wompi PSE',
        transactionId: transaction.id,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      const ventas = JSON.parse(localStorage.getItem('ventas_mock') || '[]');
      ventas.push(venta);
      localStorage.setItem('ventas_mock', JSON.stringify(ventas));

      // Simular redirección a Wompi
      setToast({ message: 'Redirigiendo a Wompi PSE...', type: 'success' });

      setTimeout(() => {
        // En producción, redirigir a la URL de pago de Wompi
        router.push(`/pagos/wompi?transactionId=${transaction.id}&amount=${total}`);
      }, 2000);
    } catch (error) {
      console.error('Error procesando venta:', error);
      setToast({ message: 'Error al procesar venta', type: 'error' });
    } finally {
      setIsProcessing(false);
    }
  };

  const mayoresDe72 = cotizantes.filter(c => c.edad > 72).length;

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
        title="Cotizador de Planes Exequiales" 
        subtitle="Calcula el valor del plan según familiares y mascotas"
      />

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div 
            className="rounded-2xl p-6 border border-blue-200/50 shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-[#0049F3] flex items-center gap-2">
                  <User className="w-6 h-6" />
                  Titular y Beneficiarios
                </h2>
                <p className="text-sm text-gray-600 mt-1">1 Titular + Beneficiarios (Beneficiarios 7+ tienen costo adicional)</p>
              </div>
              <GlassButton 
                variant="primary" 
                onClick={agregarCotizante}
              >
                <Plus className="w-5 h-5" />
                Agregar Persona
              </GlassButton>
            </div>

            <div className="space-y-4">
              {cotizantes.map((cotizante, index) => (
                <div 
                  key={cotizante.id}
                  className="p-4 rounded-xl border border-blue-100 bg-blue-50/30"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[#0049F3]">
                      {index === 0 ? '👑 TITULAR' : `👥 BENEFICIARIO ${index}`}
                    </h3>
                    {cotizantes.length > 1 && index > 0 && (
                      <button
                        onClick={() => eliminarCotizante(cotizante.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        value={cotizante.nombre}
                        onChange={(e) => handleCotizanteChange(cotizante.id, 'nombre', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
                        placeholder="Ej: Juan Pérez"
                      />
                    </div>

                    {/* Email solo para el titular */}
                    {index === 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Correo Electrónico *
                        </label>
                        <input
                          type="email"
                          value={cotizante.email || ''}
                          onChange={(e) => handleCotizanteChange(cotizante.id, 'email', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
                          placeholder="Ej: correo@ejemplo.com"
                        />
                      </div>
                    )}

                    {/* Parentesco solo para beneficiarios */}
                    {index > 0 && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Parentesco *
                        </label>
                        <select
                          value={cotizante.parentesco || ''}
                          onChange={(e) => handleCotizanteChange(cotizante.id, 'parentesco', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none bg-white"
                        >
                          <option value="">Seleccionar...</option>
                          <option value="Cónyuge">Cónyuge</option>
                          <option value="Hijo/a">Hijo/a</option>
                          <option value="Padre/Madre">Padre/Madre</option>
                          <option value="Hermano/a">Hermano/a</option>
                          <option value="Abuelo/a">Abuelo/a</option>
                          <option value="Nieto/a">Nieto/a</option>
                          <option value="Otro">Otro</option>
                        </select>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Tipo Doc.
                        </label>
                        <select
                          value={cotizante.tipoCedula}
                          onChange={(e) => handleCotizanteChange(cotizante.id, 'tipoCedula', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none bg-white"
                        >
                          <option value="CC">CC</option>
                          <option value="CE">CE</option>
                          <option value="PEP">PEP</option>
                          <option value="Pasaporte">Pasaporte</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Número Documento *
                        </label>
                        <input
                          type="text"
                          value={cotizante.cedula}
                          onChange={(e) => handleCotizanteChange(cotizante.id, 'cedula', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
                          placeholder="Ej: 1234567890"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={cotizante.telefono}
                        onChange={(e) => handleCotizanteChange(cotizante.id, 'telefono', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
                        placeholder="Ej: 3001234567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={cotizante.fechaNacimiento}
                        onChange={(e) => handleCotizanteChange(cotizante.id, 'fechaNacimiento', e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
                      />
                    </div>

                    <div className="flex items-center justify-center md:justify-start space-x-3 pt-6">
                      <input
                        type="checkbox"
                        id={`pensionado-${cotizante.id}`}
                        checked={cotizante.esPensionado}
                        onChange={(e) => handleCotizanteChange(cotizante.id, 'esPensionado', e.target.checked)}
                        className="w-5 h-5 text-[#0049F3] border-gray-300 rounded focus:ring-2 focus:ring-[#0049F3]/20 cursor-pointer"
                      />
                      <label htmlFor={`pensionado-${cotizante.id}`} className="text-sm font-semibold text-gray-700 cursor-pointer">
                        ¿Eres pensionado?
                      </label>
                    </div>
                  </div>

                  {cotizante.edad > 0 && (
                    <div className="mt-3 p-3 bg-blue-100 rounded-lg">
                      <p className="text-sm font-semibold text-[#0049F3]">
                        Edad calculada: {cotizante.edad} años
                        {cotizante.edad > 72 && (
                          <span className="ml-2 text-orange-600">(Recargo aplicable: +$4,000)</span>
                        )}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div 
            className="rounded-2xl p-6 border border-green-200/50 shadow-lg"
            style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                🐾 Mascotas
              </h2>
              <GlassButton variant="success" onClick={agregarMascota}>
                <Plus className="w-5 h-5" />
                Agregar Mascota
              </GlassButton>
            </div>

            {mascotas.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No hay mascotas agregadas. Cada mascota tiene un costo de $7,000
              </p>
            ) : (
              <div className="space-y-3">
                {mascotas.map((mascota, index) => (
                  <div 
                    key={mascota.id}
                    className="p-4 rounded-xl border border-green-100 bg-green-50/30"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-bold text-green-600">Mascota {index + 1}</h3>
                      <button
                        onClick={() => eliminarMascota(mascota.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Nombre de la Mascota
                        </label>
                        <input
                          type="text"
                          value={mascota.nombre}
                          onChange={(e) => handleMascotaChange(mascota.id, 'nombre', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                          placeholder="Ej: Firulais"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Raza / Tipo
                        </label>
                        <select
                          value={mascota.raza}
                          onChange={(e) => handleMascotaChange(mascota.id, 'raza', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none bg-white"
                        >
                          {RAZAS_MASCOTAS.map(raza => (
                            <option key={raza} value={raza}>{raza}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                          Edad (años)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={mascota.edad || ''}
                          onChange={(e) => handleMascotaChange(mascota.id, 'edad', e.target.value)}
                          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
                          placeholder="Años"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <button
              onClick={handleCotizar}
              className="px-8 py-4 rounded-xl text-white text-lg font-bold hover:scale-105 transition-all shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <DollarSign className="w-6 h-6 inline mr-2" />
              Calcular Cotización
            </button>

            {showResult && (
              <div className="flex gap-4">
                <button
                  onClick={handleEnviarCotizacion}
                  disabled={isProcessing}
                  className="flex-1 px-8 py-4 rounded-xl text-white text-lg font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <Send className="w-6 h-6 inline mr-2" />
                  {isProcessing ? 'Enviando...' : 'Enviar Cotización'}
                </button>

                <button
                  onClick={handleVenderPlan}
                  disabled={isProcessing}
                  className="flex-1 px-8 py-4 rounded-xl text-white text-lg font-bold hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <CreditCard className="w-6 h-6 inline mr-2" />
                  {isProcessing ? 'Procesando...' : 'Vender Plan (Wompi PSE)'}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div 
            className="rounded-2xl p-6 border border-blue-200/50 shadow-lg sticky top-6"
            style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
          >
            <h2 className="text-2xl font-bold text-[#0049F3] mb-4">Resumen</h2>

            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-gray-700 font-semibold">Titular + Beneficiarios:</span>
                <span className="text-[#0049F3] font-bold">{cotizantes.length} persona{cotizantes.length > 1 ? 's' : ''}</span>
              </div>

              {cotizantes.length > 7 && (
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <span className="text-gray-700 font-semibold">Beneficiarios extras:</span>
                  <span className="text-orange-600 font-bold">{cotizantes.length - 7}</span>
                </div>
              )}

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-gray-700 font-semibold">Mayores de 72 años:</span>
                <span className="text-orange-600 font-bold">{mayoresDe72}</span>
              </div>

              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700 font-semibold">Mascotas:</span>
                <span className="text-green-600 font-bold">{mascotas.length}</span>
              </div>

              <hr className="my-4 border-gray-300" />

              <div className="space-y-2 text-sm text-gray-600">
                <p>• Valor base del plan: <strong>$25,000</strong> (1 Titular + hasta 6 Beneficiarios)</p>
                <p>• Beneficiario adicional (después del 6to): <strong>+$4,200 c/u</strong></p>
                <p>• Recargo mayor 72 años: <strong>+$4,000 c/u</strong></p>
                <p>• Valor por mascota: <strong>+$7,000 c/u</strong></p>
              </div>

              {showResult && (
                <>
                  <hr className="my-4 border-gray-300" />
                  <div className="p-4 rounded-xl text-center" style={{
                    background: 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)',
                  }}>
                    <p className="text-white text-sm font-semibold mb-1">VALOR TOTAL</p>
                    <p className="text-white text-4xl font-bold">{formatCurrency(calcularTotal())}</p>
                  </div>

                  <div className="mt-4 space-y-2 text-sm">
                    <p className="font-semibold text-gray-700">Desglose:</p>
                    <p>Plan base (1 Titular + {Math.min(cotizantes.length - 1, 6)} Beneficiario{cotizantes.length > 2 ? 's' : ''}): {formatCurrency(25000)}</p>
                    {cotizantes.length > 7 && (
                      <p className="text-orange-600">Beneficiarios extras ({cotizantes.length - 7}): +{formatCurrency(4200 * (cotizantes.length - 7))}</p>
                    )}
                    {mayoresDe72 > 0 && (
                      <p>Recargo mayores 72 años ({mayoresDe72}): +{formatCurrency(4000 * mayoresDe72)}</p>
                    )}
                    {mascotas.length > 0 && (
                      <p>Mascotas ({mascotas.length}): +{formatCurrency(7000 * mascotas.length)}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          <div 
            className="rounded-2xl p-4 border border-yellow-300/50"
            style={{ background: 'rgba(251, 191, 36, 0.1)', backdropFilter: 'blur(10px)' }}
          >
            <p className="text-sm text-yellow-800">
              💡 <strong>Modo Demo:</strong> Esta es una cotización simulada. En producción se guardará en la base de datos.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
