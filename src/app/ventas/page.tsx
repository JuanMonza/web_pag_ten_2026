'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadExcel } from '@/utils/excel';
import { getCurrentUser } from '@/lib/mock-auth';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassPagination, GlassModal, GlassButton } from '@/components/ui/GlassComponents';
import { CreditCard, Wallet, DollarSign, Printer, FileText } from 'lucide-react';
import { ThermalReceipt } from '@/components/receipts/ThermalReceipt';
import { useReactToPrint } from 'react-to-print';

const MOCK_VENTAS = [
  {
    id: '1',
    cliente: 'Carlos Rodríguez',
    plan: 'Plan Premium',
    monto_total: 3000000,
    metodo_pago: 'Tarjeta de crédito',
    estado: 'completada',
    estado_pago: 'APPROVED',
    created_at: '2026-01-05T10:30:00Z',
  },
  {
    id: '2',
    cliente: 'María González',
    plan: 'Plan Básico',
    monto_total: 3000000,
    metodo_pago: 'PSE',
    estado: 'completada',
    estado_pago: 'APPROVED',
    created_at: '2026-01-06T14:15:00Z',
  },
  {
    id: '3',
    cliente: 'Juan Pérez',
    plan: 'Plan Estándar',
    monto_total: 3000000,
    metodo_pago: 'Efectivo',
    estado: 'pendiente',
    estado_pago: 'PENDING',
    created_at: '2026-01-07T09:45:00Z',
  },
  {
    id: '4',
    cliente: 'Ana Martínez',
    plan: 'Plan Premium',
    monto_total: 3000000,
    metodo_pago: 'Tarjeta débito',
    estado: 'completada',
    estado_pago: 'APPROVED',
    created_at: '2026-01-08T11:20:00Z',
  },
];

export default function VentasPage() {
  const [ventas, setVentas] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setUserRole] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [selectedVenta, setSelectedVenta] = useState<any>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptType, setReceiptType] = useState<'cliente' | 'cierre'>('cliente');
  const receiptRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserRole(user.role);
      setUserName(user.name);
      loadVentas(user.role, user.name);
    }
  }, []);

  const loadVentas = (role: string, name: string) => {
    // Cargar ventas desde localStorage
    const ventasMock = JSON.parse(localStorage.getItem('ventas_mock') || '[]');
    const ventasDemo = MOCK_VENTAS;

    // Combinar ventas demo + ventas reales
    let allVentas = [...ventasDemo, ...ventasMock];

    // Filtrar según el rol
    if (role === 'tendero') {
      // El tendero solo ve sus propias ventas
      allVentas = allVentas.filter((v: any) => v.vendidoPor === name);
    }
    // Admin y callcenter ven todas las ventas

    // Ordenar por fecha más reciente
    allVentas.sort((a: any, b: any) => {
      const dateA = new Date(a.created_at || a.createdAt || 0);
      const dateB = new Date(b.created_at || b.createdAt || 0);
      return dateB.getTime() - dateA.getTime();
    });

    setVentas(allVentas);
  };

  const itemsPerPage = 10;
  const totalPages = Math.ceil(ventas.length / itemsPerPage);
  const paginatedData = ventas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Estadísticas de métodos de pago (solo para admin y tendero)
  const getPaymentStats = () => {
    const stats: any = {
      'Wompi PSE': { count: 0, total: 0 },
      'Tarjeta de crédito': { count: 0, total: 0 },
      'PSE': { count: 0, total: 0 },
      'Efectivo': { count: 0, total: 0 },
      'Tarjeta débito': { count: 0, total: 0 },
    };

    ventas.forEach((venta: any) => {
      const metodo = venta.metodoPago || venta.metodo_pago || 'Desconocido';
      const monto = venta.total || venta.monto_total || 0;
      
      if (!stats[metodo]) {
        stats[metodo] = { count: 0, total: 0 };
      }
      stats[metodo].count++;
      stats[metodo].total += monto;
    });

    return stats;
  };

  const paymentStats = getPaymentStats();

  const handleDownloadExcel = () => {
    downloadExcel(ventas, 'ventas');
  };

  const handlePrintReceipt = () => {
    // Crear un iframe oculto para imprimir
    const printContent = receiptRef.current;
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    
    document.body.appendChild(iframe);
    
    const iframeDoc = iframe.contentWindow?.document;
    if (!iframeDoc) return;

    iframeDoc.open();
    iframeDoc.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Factura-${selectedVenta?.id || 'N/A'}</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              font-family: 'Courier New', monospace;
            }
            @media print {
              body {
                width: 80mm;
              }
            }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `);
    iframeDoc.close();

    // Esperar a que el contenido cargue
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        
        // Remover el iframe después de imprimir
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 250);
    };
  };

  const openReceiptModal = (venta: any, type: 'cliente' | 'cierre') => {
    setSelectedVenta(venta);
    setReceiptType(type);
    setShowReceiptModal(true);
  };

  const printCierreDia = () => {
    const ventasHoy = ventas.filter(v => {
      const ventaDate = new Date(v.created_at || v.createdAt);
      const today = new Date();
      return ventaDate.toDateString() === today.toDateString();
    });

    if (ventasHoy.length === 0) {
      alert('No hay ventas registradas hoy para generar el cierre.');
      return;
    }

    const totalDia = ventasHoy.reduce((sum, v) => sum + (v.total || v.monto_total || 0), 0);
    const cierreData = {
      id: 'CIERRE-' + new Date().toISOString().split('T')[0],
      cliente: `Cierre del Día - ${ventasHoy.length} ventas`,
      plan: 'Resumen Diario',
      total: totalDia,
      monto_total: totalDia,
      metodoPago: 'Múltiples',
      estado: 'completada',
      created_at: new Date().toISOString(),
      ventasDetalle: ventasHoy,
    };

    openReceiptModal(cierreData, 'cierre');
  };

  const showPaymentStats = userRole === 'admin' || userRole === 'tendero';

  return (
    <div>
      <PageHeader 
        title="Ventas" 
        subtitle="Historial de transacciones y ventas realizadas" 
      />
      
      <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-yellow-700 font-medium">🚀 Modo Demo - Datos de ejemplo para demostración</p>
      </div>

      {/* Estadísticas de Métodos de Pago (solo Admin y Tendero) */}
      {showPaymentStats && Object.keys(paymentStats).filter(k => paymentStats[k].count > 0).length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {Object.entries(paymentStats)
            .filter(([_, stats]: any) => stats.count > 0)
            .map(([metodo, stats]: any) => (
              <div
                key={metodo}
                className="rounded-xl p-4 border border-blue-200/50 shadow-sm"
                style={{ background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}
              >
                <div className="flex items-center gap-2 mb-2">
                  {metodo.includes('Wompi') || metodo.includes('PSE') ? (
                    <Wallet className="w-5 h-5 text-[#0049F3]" />
                  ) : metodo.includes('Tarjeta') ? (
                    <CreditCard className="w-5 h-5 text-[#0049F3]" />
                  ) : (
                    <DollarSign className="w-5 h-5 text-[#0049F3]" />
                  )}
                  <p className="text-sm font-semibold text-gray-700">{metodo}</p>
                </div>
                <p className="text-2xl font-bold text-[#0049F3] mb-1">{stats.count}</p>
                <p className="text-xs text-gray-600">{formatCurrency(stats.total)}</p>
              </div>
            ))}
        </div>
      )}
      
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={printCierreDia}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            Cierre del Día
          </button>
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Descargar Excel
          </button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Historial de Ventas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Método de Pago</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((venta) => {
                const cliente = venta.cliente || (venta.cotizantes && venta.cotizantes[0]?.nombre) || 'Cliente';
                const plan = venta.plan || 'Plan Familiar';
                const monto = venta.monto_total || venta.total || 0;
                const metodo = venta.metodoPago || venta.metodo_pago || 'Desconocido';
                const estado = venta.estado || venta.status || 'pending';
                const fecha = venta.created_at || venta.createdAt || new Date().toISOString();
                const vendedor = venta.vendidoPor || 'Sistema';

                return (
                  <TableRow key={venta.id}>
                    <TableCell>
                      <div>
                        <p className="font-semibold">{cliente}</p>
                        {vendedor !== 'Sistema' && (
                          <p className="text-xs text-gray-500">Vendido por: {vendedor}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{plan}</TableCell>
                    <TableCell>{formatCurrency(monto)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {metodo.includes('Wompi') || metodo.includes('PSE') ? (
                          <Wallet className="w-4 h-4 text-blue-600" />
                        ) : metodo.includes('Tarjeta') ? (
                          <CreditCard className="w-4 h-4 text-purple-600" />
                        ) : (
                          <DollarSign className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm">{metodo}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        estado === 'completada' || estado === 'approved'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {estado === 'completada' || estado === 'approved' ? 'Completada' : 'Pendiente'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(fecha)}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openReceiptModal(venta, 'cliente')}
                          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          title="Imprimir Factura"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          
          <GlassPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Modal de Factura */}
      <GlassModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        title={receiptType === 'cliente' ? 'Factura de Venta' : 'Cierre del Día'}
        maxWidth="lg"
      >
        <div className="space-y-4">
          {/* Contenedor con scroll para previsualización */}
          <div 
            style={{ 
              maxHeight: '70vh', 
              overflowY: 'auto',
              overflowX: 'hidden',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb'
            }}
          >
            <div ref={receiptRef} style={{ padding: '20px', backgroundColor: 'white', margin: '10px' }}>
              {selectedVenta && (
                <ThermalReceipt
                  venta={selectedVenta}
                  tipo={receiptType}
                />
              )}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <GlassButton
              onClick={handlePrintReceipt}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </GlassButton>
            <GlassButton
              variant="secondary"
              onClick={() => setShowReceiptModal(false)}
              className="flex-1"
            >
              Cerrar
            </GlassButton>
          </div>
        </div>
      </GlassModal>
    </div>
  );
}
