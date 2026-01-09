'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/Table';
import { GlassModal, GlassButton, Toast, GlassPagination } from '@/components/ui/GlassComponents';
import { Input } from '@/components/ui/Input';
import { Edit2, Trash2, Power, UserPlus, X, Check } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

interface Tendero {
  id: string;
  nombre: string;
  tipoDocumento: 'CC' | 'NIT' | 'PEP';
  numeroDocumento: string;
  telefono: string;
  ciudad: string;
  nombreTienda: string;
  direccionTienda: string;
  comision: number;
  active: boolean;
}

const INITIAL_TENDEROS: Tendero[] = [
  {
    id: '1',
    nombre: 'Juan Pérez',
    tipoDocumento: 'CC',
    numeroDocumento: '1234567890',
    telefono: '3101111111',
    ciudad: 'Bogotá',
    nombreTienda: 'Tienda Don Juan',
    direccionTienda: 'Calle 123 #45-67',
    comision: 15,
    active: true,
  },
  {
    id: '2',
    nombre: 'Carlos R',
    tipoDocumento: 'CC',
    numeroDocumento: '9876543210',
    telefono: '3202222222',
    ciudad: 'Medellín',
    nombreTienda: 'Supermercado Carlos',
    direccionTienda: 'Carrera 50 #20-30',
    comision: 10,
    active: true,
  },
  {
    id: '3',
    nombre: 'Ana López',
    tipoDocumento: 'CC',
    numeroDocumento: '5555555555',
    telefono: '3153333333',
    ciudad: 'Cali',
    nombreTienda: 'Minimercado Ana',
    direccionTienda: 'Avenida 6 #10-15',
    comision: 17.5,
    active: false,
  },
];

export default function AdminTenderosPage() {
  const [tenderos, setTenderos] = useState<Tendero[]>(INITIAL_TENDEROS);
  const [isCreateEditModalOpen, setIsCreateEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentTendero, setCurrentTendero] = useState<Tendero | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    nombre: '', 
    tipoDocumento: 'CC' as 'CC' | 'NIT' | 'PEP',
    numeroDocumento: '',
    telefono: '', 
    ciudad: '', 
    nombreTienda: '',
    direccionTienda: '',
    comision: 0 
  });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;
  const totalPages = Math.ceil(tenderos.length / itemsPerPage);
  const paginatedData = tenderos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreate = () => {
    setCurrentTendero(null);
    setFormData({ 
      nombre: '', 
      tipoDocumento: 'CC',
      numeroDocumento: '',
      telefono: '', 
      ciudad: '', 
      nombreTienda: '',
      direccionTienda: '',
      comision: 0 
    });
    setIsCreateEditModalOpen(true);
  };

  const handleEdit = (tendero: Tendero) => {
    setCurrentTendero(tendero);
    setFormData({
      nombre: tendero.nombre,
      tipoDocumento: tendero.tipoDocumento,
      numeroDocumento: tendero.numeroDocumento,
      telefono: tendero.telefono,
      ciudad: tendero.ciudad,
      nombreTienda: tendero.nombreTienda,
      direccionTienda: tendero.direccionTienda,
      comision: tendero.comision,
    });
    setIsCreateEditModalOpen(true);
  };

  const handleSave = () => {
    if (currentTendero) {
      setTenderos(tenderos.map(t =>
        t.id === currentTendero.id ? { ...t, ...formData } : t
      ));
      showToast('Tendero actualizado exitosamente');
    } else {
      const newTendero: Tendero = {
        id: String(Date.now()),
        ...formData,
        active: true,
      };
      setTenderos([...tenderos, newTendero]);
      showToast('Tendero creado exitosamente');
    }
    setIsCreateEditModalOpen(false);
  };

  const handleToggleActive = (id: string) => {
    setTenderos(tenderos.map(t =>
      t.id === id ? { ...t, active: !t.active } : t
    ));
    const tendero = tenderos.find(t => t.id === id);
    showToast(`Tendero ${tendero?.active ? 'desactivado' : 'activado'} exitosamente`);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      setTenderos(tenderos.filter(t => t.id !== deleteId));
      showToast('Tendero eliminado exitosamente');
    }
    setIsDeleteModalOpen(false);
    setDeleteId(null);
  };

  return (
    <div>
      <PageHeader 
        title="Gestión de Tenderos" 
        subtitle="Administra los tenderos y sus comisiones" 
      />
      
      <div className="mb-6 bg-linear-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
        <p className="text-yellow-800 font-medium">🚀 Modo Demo - Datos de ejemplo para demostración</p>
      </div>
      
      <div className="flex justify-end items-center mb-8">
        <GlassButton
          onClick={handleCreate}
          className="bg-linear-to-r from-[#266df8] to-[#0049F3] text-white"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          + Nuevo Tendero
        </GlassButton>
      </div>
      
      <Card className="backdrop-blur-md bg-white/80 shadow-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Lista de Tenderos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-linear-to-r from-[#266df8]/10 to-[#0049F3]/10">
                  <TableHead className="font-bold text-gray-700">Nombre</TableHead>
                  <TableHead className="font-bold text-gray-700">Teléfono</TableHead>
                  <TableHead className="font-bold text-gray-700">Ciudad</TableHead>
                  <TableHead className="font-bold text-gray-700">Comisión %</TableHead>
                  <TableHead className="font-bold text-gray-700">Estado</TableHead>
                  <TableHead className="font-bold text-gray-700 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((tendero) => (
                  <TableRow key={tendero.id} className="hover:bg-[#266df8]/5 transition-colors">
                    <TableCell className="font-semibold text-gray-900">{tendero.nombre}</TableCell>
                    <TableCell className="text-gray-700">{tendero.telefono}</TableCell>
                    <TableCell className="text-gray-700">{tendero.ciudad}</TableCell>
                    <TableCell>
                      <span className="px-3 py-1 bg-linear-to-r from-[#266df8]/20 to-[#0049F3]/20 rounded-full text-sm font-bold text-[#0049F3]">
                        {tendero.comision}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1 ${
                        tendero.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tendero.active ? (
                          <>
                            <Check className="w-3 h-3" />
                            Activo
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" />
                            Inactivo
                          </>
                        )}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(tendero)}
                          className="p-2 hover:bg-[#266df8]/10 rounded-lg transition-colors group"
                          title="Editar"
                        >
                          <Edit2 className="w-4 h-4 text-[#266df8] group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(tendero.id)}
                          className="p-2 hover:bg-green-100 rounded-lg transition-colors group"
                          title={tendero.active ? 'Desactivar' : 'Activar'}
                        >
                          <Power className={`w-4 h-4 group-hover:scale-110 transition-transform ${
                            tendero.active ? 'text-green-600' : 'text-gray-400'
                          }`} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(tendero.id)}
                          className="p-2 hover:bg-red-100 rounded-lg transition-colors group"
                          title="Eliminar"
                        >
                          <Trash2 className="w-4 h-4 text-red-600 group-hover:scale-110 transition-transform" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <GlassPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <GlassModal
        isOpen={isCreateEditModalOpen}
        onClose={() => setIsCreateEditModalOpen(false)}
        title={currentTendero ? 'Editar Tendero' : 'Nuevo Tendero'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Nombre Completo</label>
            <Input
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: Juan Pérez"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Tipo de Documento</label>
            <select
              value={formData.tipoDocumento}
              onChange={(e) => setFormData({ ...formData, tipoDocumento: e.target.value as 'CC' | 'NIT' | 'PEP' })}
              className="w-full px-3 py-2 rounded-lg border border-white/30 bg-white text-gray-900 shadow-lg focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="NIT">NIT</option>
              <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Número de Documento</label>
            <Input
              value={formData.numeroDocumento}
              onChange={(e) => setFormData({ ...formData, numeroDocumento: e.target.value })}
              placeholder="Ej: 1234567890"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Teléfono</label>
            <Input
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              placeholder="Ej: 3001234567"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Ciudad</label>
            <Input
              value={formData.ciudad}
              onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
              placeholder="Ej: Bogotá"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Nombre de la Tienda</label>
            <Input
              value={formData.nombreTienda}
              onChange={(e) => setFormData({ ...formData, nombreTienda: e.target.value })}
              placeholder="Ej: Tienda Don Juan"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Dirección de la Tienda</label>
            <Input
              value={formData.direccionTienda}
              onChange={(e) => setFormData({ ...formData, direccionTienda: e.target.value })}
              placeholder="Ej: Calle 123 #45-67"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Comisión (%)</label>
            <Input
              type="number"
              step="0.5"
              value={formData.comision}
              onChange={(e) => setFormData({ ...formData, comision: parseFloat(e.target.value) || 0 })}
              placeholder="Ej: 15"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <GlassButton
              onClick={handleSave}
              className="flex-1 bg-linear-to-r from-[#266df8] to-[#0049F3] text-white"
              disabled={!formData.nombre || !formData.numeroDocumento || !formData.telefono || !formData.ciudad || !formData.nombreTienda || !formData.direccionTienda}
            >
              {currentTendero ? 'Guardar Cambios' : 'Crear Tendero'}
            </GlassButton>
            <GlassButton
              onClick={() => setIsCreateEditModalOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      <GlassModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Eliminación"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            ¿Estás seguro de que deseas eliminar este tendero? Esta acción no se puede deshacer.
          </p>
          <div className="flex gap-3 pt-4">
            <GlassButton
              onClick={handleDeleteConfirm}
              className="flex-1 bg-linear-to-r from-red-500 to-red-600"
            >
              Sí, Eliminar
            </GlassButton>
            <GlassButton
              onClick={() => setIsDeleteModalOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
}
