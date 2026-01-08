'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { downloadExcel } from '@/utils/excel';
import { getCurrentUser } from '@/lib/mock-auth';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassPagination } from '@/components/ui/GlassComponents';
import { CreditCard, Wallet, DollarSign } from 'lucide-react';

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
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            📥 Descargar Excel
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
    </div>
  );
}
