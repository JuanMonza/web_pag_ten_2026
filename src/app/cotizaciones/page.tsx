'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassPagination, Toast } from '@/components/ui/GlassComponents';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { getCurrentUser } from '@/lib/mock-auth';
import { CheckCircle, XCircle, Eye } from 'lucide-react';

interface Cotizacion {
  id: string;
  cotizantes: Array<{ nombre: string; cedula: string; telefono: string; fechaNacimiento: string; edad: number }>;
  mascotas: Array<{ nombre: string; raza: string; edad: number }>;
  total: number;
  createdBy: string;
  createdByRole: string;
  createdAt: string;
  status: string;
  completedBy?: string;
}

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCotizacion, setSelectedCotizacion] = useState<Cotizacion | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    // Cargar cotizaciones una sola vez al montar
    const loadData = () => {
      const stored = JSON.parse(localStorage.getItem('cotizaciones') || '[]');
      stored.sort((a: Cotizacion, b: Cotizacion) => {
        const dateA = new Date(a.createdAt || 0);
        const dateB = new Date(b.createdAt || 0);
        return dateB.getTime() - dateA.getTime();
      });
      setCotizaciones(stored);
    };
    loadData();
  }, []);

  const handleVerDetalle = (cotizacion: Cotizacion) => {
    setSelectedCotizacion(cotizacion);
    setShowModal(true);
  };

  const handleCompletarVenta = async (cotizacion: Cotizacion) => {
    const user = getCurrentUser();
    if (!user) {
      setToast({ message: 'Sesión expirada', type: 'error' });
      return;
    }

    try {
      // Crear venta desde la cotización
      const venta = {
        id: `VENTA-${Date.now()}`,
        cotizantes: cotizacion.cotizantes,
        mascotas: cotizacion.mascotas,
        total: cotizacion.total,
        vendidoPor: user.name,
        vendidoPorRole: user.role,
        cotizacionOriginal: cotizacion.createdBy, // El tendero que hizo la cotización
        metodoPago: 'Venta Directa (Call Center)',
        status: 'approved',
        createdAt: new Date().toISOString(),
        approvedAt: new Date().toISOString(),
      };

      // Guardar venta
      const ventas = JSON.parse(localStorage.getItem('ventas_mock') || '[]');
      ventas.push(venta);
      localStorage.setItem('ventas_mock', JSON.stringify(ventas));

      // Marcar cotización como completada
      const cotizacionesActualizadas = cotizaciones.map(c => 
        c.id === cotizacion.id ? { ...c, status: 'completed', completedBy: user.name } : c
      );
      localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesActualizadas));
      setCotizaciones(cotizacionesActualizadas);

      console.log('✅ [VENTA] Venta completada por Call Center:', venta);
      console.log('📊 [INFO] Cotización original de:', cotizacion.createdBy);
      console.log('📊 [INFO] Venta asignada a tendero:', cotizacion.createdBy);

      setToast({ message: `Venta completada exitosamente. Asignada a ${cotizacion.createdBy}`, type: 'success' });
      setShowModal(false);
    } catch (error) {
      console.error('Error completando venta:', error);
      setToast({ message: 'Error al completar la venta', type: 'error' });
    }
  };

  const handleRechazar = (cotizacion: Cotizacion) => {
    const cotizacionesActualizadas = cotizaciones.map(c =>
      c.id === cotizacion.id ? { ...c, status: 'rejected' } : c
    );
    localStorage.setItem('cotizaciones', JSON.stringify(cotizacionesActualizadas));
    setCotizaciones(cotizacionesActualizadas);
    setToast({ message: 'Cotización rechazada', type: 'error' });
    setShowModal(false);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(cotizaciones.length / itemsPerPage);
  const paginatedData = cotizaciones.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pendingCount = cotizaciones.filter(c => c.status === 'pending').length;
  const completedCount = cotizaciones.filter(c => c.status === 'completed').length;

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
        title="Cotizaciones Recibidas"
        subtitle="Gestiona las cotizaciones enviadas por tenderos"
      />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div
            className="rounded-xl p-6 border border-blue-200/50 shadow-sm"
            style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
          >
            <p className="text-sm font-semibold text-gray-700 mb-1">Total Cotizaciones</p>
            <p className="text-3xl font-bold text-[#0049F3]">{cotizaciones.length}</p>
          </div>

          <div
            className="rounded-xl p-6 border border-yellow-200/50 shadow-sm"
            style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
          >
            <p className="text-sm font-semibold text-gray-700 mb-1">Pendientes</p>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>

          <div
            className="rounded-xl p-6 border border-green-200/50 shadow-sm"
            style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
          >
            <p className="text-sm font-semibold text-gray-700 mb-1">Completadas</p>
            <p className="text-3xl font-bold text-green-600">{completedCount}</p>
          </div>
        </div>

        {/* Tabla */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Cotizaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {cotizaciones.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">No hay cotizaciones recibidas</p>
                <p className="text-sm text-gray-400">Las cotizaciones enviadas por tenderos aparecerán aquí</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Creado por</TableHead>
                      <TableHead>Cotizantes</TableHead>
                      <TableHead>Mascotas</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((cotizacion) => (
                      <TableRow key={cotizacion.id}>
                        <TableCell className="font-mono text-xs">{cotizacion.id.slice(-8)}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{cotizacion.createdBy}</p>
                            <p className="text-xs text-gray-500">{cotizacion.createdByRole}</p>
                          </div>
                        </TableCell>
                        <TableCell>{cotizacion.cotizantes?.length || 0}</TableCell>
                        <TableCell>{cotizacion.mascotas?.length || 0}</TableCell>
                        <TableCell className="font-bold text-[#0049F3]">
                          {formatCurrency(cotizacion.total)}
                        </TableCell>
                        <TableCell>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            cotizacion.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : cotizacion.status === 'rejected'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {cotizacion.status === 'completed' ? 'Completada' :
                             cotizacion.status === 'rejected' ? 'Rechazada' : 'Pendiente'}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(cotizacion.createdAt)}</TableCell>
                        <TableCell>
                          <button
                            onClick={() => handleVerDetalle(cotizacion)}
                            className="p-2 rounded-lg hover:bg-blue-100 transition-colors"
                            title="Ver detalle"
                          >
                            <Eye className="w-5 h-5 text-[#0049F3]" />
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <GlassPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modal de Detalle */}
      {showModal && selectedCotizacion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div
            className="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl p-8 border border-blue-200/50 shadow-2xl"
            style={{ background: 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(20px)' }}
          >
            <h2 className="text-2xl font-bold text-[#0049F3] mb-6">Detalle de Cotización</h2>

            {/* Info del Vendedor */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600">Creada por</p>
              <p className="text-lg font-bold text-[#0049F3]">{selectedCotizacion.createdBy}</p>
              <p className="text-sm text-gray-500">{selectedCotizacion.createdByRole}</p>
              <p className="text-xs text-gray-500 mt-1">{formatDate(selectedCotizacion.createdAt)}</p>
            </div>

            {/* Cotizantes */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Cotizantes ({selectedCotizacion.cotizantes?.length})</h3>
              <div className="space-y-3">
                {selectedCotizacion.cotizantes?.map((cot, idx: number) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-gray-800">{cot.nombre}</p>
                      {idx === 0 && <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded">TITULAR</span>}
                      {idx > 0 && <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">BENEFICIARIO</span>}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <p>
                        <span className="font-semibold">{cot.tipoCedula || 'CC'}:</span> {cot.cedula}
                      </p>
                      <p>Edad: {cot.edad} años</p>
                      <p>Teléfono: {cot.telefono}</p>
                      <p>Fecha Nac: {cot.fechaNacimiento}</p>
                      {idx === 0 && cot.email && <p className="col-span-2">Email: {cot.email}</p>}
                      {idx > 0 && cot.parentesco && <p className="col-span-2">Parentesco: {cot.parentesco}</p>}
                      {cot.esPensionado && (
                        <p className="col-span-2 font-semibold text-purple-600">✓ Pensionado</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mascotas */}
            {selectedCotizacion.mascotas?.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3">Mascotas ({selectedCotizacion.mascotas?.length})</h3>
                <div className="space-y-2">
                  {selectedCotizacion.mascotas?.map((mascota, idx: number) => (
                    <div key={idx} className="p-3 bg-green-50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">{mascota.nombre}</span>
                        <span className="text-sm text-gray-500">{mascota.edad} años</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{mascota.raza}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total */}
            <div className="mb-6 p-6 rounded-xl text-center"
              style={{ background: 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)' }}>
              <p className="text-white text-sm font-semibold mb-1">TOTAL</p>
              <p className="text-white text-4xl font-bold">{formatCurrency(selectedCotizacion.total)}</p>
            </div>

            {/* Botones de Acción */}
            {selectedCotizacion.status === 'pending' && (
              <div className="flex gap-4">
                <button
                  onClick={() => handleCompletarVenta(selectedCotizacion)}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <CheckCircle className="w-5 h-5 inline mr-2" />
                  Completar Venta
                </button>

                <button
                  onClick={() => handleRechazar(selectedCotizacion)}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-bold hover:scale-105 transition-all shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }}
                >
                  <XCircle className="w-5 h-5 inline mr-2" />
                  Rechazar
                </button>
              </div>
            )}

            {selectedCotizacion.status === 'completed' && (
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <p className="text-green-700 font-semibold">
                  ✅ Venta completada por {selectedCotizacion.completedBy}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Esta venta fue asignada al tendero {selectedCotizacion.createdBy}
                </p>
              </div>
            )}

            <button
              onClick={() => setShowModal(false)}
              className="w-full mt-4 px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-all"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
