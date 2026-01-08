'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassPagination } from '@/components/ui/GlassComponents';

// DATOS MOCK PARA DEMO
const MOCK_COMISIONES = [
  {
    id: '1',
    monto: 450000,
    porcentaje: 15,
    estado: 'pagada',
    fecha_pago: '2025-12-15',
    created_at: '2025-12-01',
    tendero: { user: { name: 'Juan Pérez' } },
    venta: {
      monto_total: 3000000,
      cotizacion: {
        cliente: { nombre: 'María González', documento: '12345678' }
      }
    }
  },
  {
    id: '2',
    monto: 300000,
    porcentaje: 10,
    estado: 'pendiente',
    fecha_pago: null,
    created_at: '2025-12-10',
    tendero: { user: { name: 'Carlos Rodríguez' } },
    venta: {
      monto_total: 3000000,
      cotizacion: {
        cliente: { nombre: 'Pedro Martínez', documento: '87654321' }
      }
    }
  },
  {
    id: '3',
    monto: 525000,
    porcentaje: 17.5,
    estado: 'pagada',
    fecha_pago: '2025-11-20',
    created_at: '2025-11-05',
    tendero: { user: { name: 'Ana López' } },
    venta: {
      monto_total: 3000000,
      cotizacion: {
        cliente: { nombre: 'Laura Sánchez', documento: '11223344' }
      }
    }
  },
];

export default function ComisionesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalComisiones = MOCK_COMISIONES.reduce((sum, c) => sum + c.monto, 0);
  const comisionesPagadas = MOCK_COMISIONES.filter(c => c.estado === 'pagada').length;
  const comisionesPendientes = MOCK_COMISIONES.filter(c => c.estado === 'pendiente').length;

  const itemsPerPage = 10;
  const totalPages = Math.ceil(MOCK_COMISIONES.length / itemsPerPage);
  const paginatedData = MOCK_COMISIONES.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Comisiones" 
        subtitle="Control de comisiones y pagos a tenderos" 
      />
      
      {/* Banner DEMO */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-800 font-semibold">
          🚀 Modo Demo - Datos de ejemplo para demostración
        </p>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Comisiones</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-blue-600">
              {formatCurrency(totalComisiones)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pagadas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {comisionesPagadas}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-orange-600">
              {comisionesPendientes}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Comisiones */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Comisiones</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Tendero</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Venta</TableHead>
                <TableHead>%</TableHead>
                <TableHead>Comisión</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha Pago</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((comision) => (
                <TableRow key={comision.id}>
                  <TableCell>{formatDate(comision.created_at)}</TableCell>
                  <TableCell>{comision.tendero.user.name}</TableCell>
                  <TableCell>
                    {comision.venta.cotizacion.cliente.nombre}
                    <br />
                    <span className="text-xs text-gray-500">
                      {comision.venta.cotizacion.cliente.documento}
                    </span>
                  </TableCell>
                  <TableCell>{formatCurrency(comision.venta.monto_total)}</TableCell>
                  <TableCell>{comision.porcentaje}%</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(comision.monto)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        comision.estado === 'pagada'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {comision.estado === 'pagada' ? 'Pagada' : 'Pendiente'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {comision.fecha_pago ? formatDate(comision.fecha_pago) : '-'}
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
        </CardContent>
      </Card>
    </div>
  );
}
