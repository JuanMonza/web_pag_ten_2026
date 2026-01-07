'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { CrearTenderoModal } from '@/components/admin/CrearTenderoModal';
import { formatDate } from '@/utils/formatters';
import { Plus } from 'lucide-react';
import { Tendero } from '@/types/cotizacion.types';

interface TenderosListProps {
  tenderos: Tendero[];
}

export function TenderosList({ tenderos: initialTenderos }: TenderosListProps) {
  const [showModal, setShowModal] = useState(false);
  const [tenderos] = useState(initialTenderos);
  
  const handleSuccess = () => {
    // Recargar la página para mostrar el nuevo tendero
    window.location.reload();
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Tenderos</h1>
        <Button onClick={() => setShowModal(true)}>
          <Plus size={20} className="mr-2" />
          Crear Tendero
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lista de Tenderos</CardTitle>
        </CardHeader>
        <CardContent>
          {tenderos.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay tenderos registrados
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tenderos.map((tendero: Tendero) => (
                  <TableRow key={tendero.id}>
                    <TableCell>{tendero.user?.name}</TableCell>
                    <TableCell>{tendero.user?.email}</TableCell>
                    <TableCell>{tendero.user?.phone}</TableCell>
                    <TableCell>{tendero.direccion}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        tendero.user?.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tendero.user?.active ? 'Activo' : 'Inactivo'}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(tendero.created_at || tendero.fecha_registro)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <CrearTenderoModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
}
