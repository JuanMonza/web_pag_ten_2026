'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { formatDate } from '@/utils/formatters';
import { downloadExcel } from '@/utils/excel';
import { getCurrentUser } from '@/services/auth.service';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassPagination } from '@/components/ui/GlassComponents';

const MOCK_CLIENTES = [
  {
    id: '1',
    nombre: 'Carlos Rodríguez',
    cedula: '1234567890',
    telefono: '3001234567',
    email: 'carlos@email.com',
    ciudad: 'Bogotá',
    created_at: '2025-12-15T10:00:00Z',
  },
  {
    id: '2',
    nombre: 'María González',
    cedula: '9876543210',
    telefono: '3109876543',
    email: 'maria@email.com',
    ciudad: 'Medellín',
    created_at: '2025-12-20T14:30:00Z',
  },
  {
    id: '3',
    nombre: 'Juan Pérez',
    cedula: '5555555555',
    telefono: '3155555555',
    email: 'juan@email.com',
    ciudad: 'Cali',
    created_at: '2026-01-05T09:15:00Z',
  },
  {
    id: '4',
    nombre: 'Ana Martínez',
    cedula: '7777777777',
    telefono: '3207777777',
    email: 'ana@email.com',
    ciudad: 'Barranquilla',
    created_at: '2026-01-06T16:45:00Z',
  },
  {
    id: '5',
    nombre: 'Luis Fernández',
    cedula: '2222222222',
    telefono: '3002222222',
    email: 'luis@email.com',
    ciudad: 'Cartagena',
    created_at: '2026-01-07T11:20:00Z',
  },
];

export default function ClientesPage() {
  const [userRole, setUserRole] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadUser = async () => {
      const user = await getCurrentUser();
      setUserRole(user?.role || null);
    };
    loadUser();
  }, []);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(MOCK_CLIENTES.length / itemsPerPage);
  const paginatedData = MOCK_CLIENTES.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDownloadExcel = () => {
    downloadExcel(MOCK_CLIENTES, 'clientes');
  };

  return (
    <div>
      <PageHeader 
        title="Clientes" 
        subtitle="Gestión de clientes registrados en el sistema" 
      />
      
      <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <p className="text-yellow-700 font-medium">🚀 Modo Demo - Datos de ejemplo para demostración</p>
      </div>
      
      <div className="flex justify-end items-center mb-6">
        <div className="flex gap-3">
          <button
            onClick={handleDownloadExcel}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            📥 Descargar Excel
          </button>
          {userRole === 'admin' && (
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
              + Nuevo Cliente
            </button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Cédula</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Ciudad</TableHead>
                <TableHead>Fecha Registro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((cliente) => (
                <TableRow key={cliente.id}>
                  <TableCell>{cliente.nombre}</TableCell>
                  <TableCell>{cliente.cedula}</TableCell>
                  <TableCell>{cliente.telefono}</TableCell>
                  <TableCell>{cliente.email}</TableCell>
                  <TableCell>{cliente.ciudad}</TableCell>
                  <TableCell>{formatDate(cliente.created_at)}</TableCell>
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
