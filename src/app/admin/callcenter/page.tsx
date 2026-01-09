'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { GlassModal, GlassButton, Toast, GlassPagination } from '@/components/ui/GlassComponents';
import { Plus, Edit2, Trash2, Mail, Phone, Lightbulb } from 'lucide-react';

interface CallCenter {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  fechaIngreso: string;
  estado: 'activo' | 'inactivo';
}

const MOCK_CALLCENTERS: CallCenter[] = [
  {
    id: '1',
    nombre: 'Carlos Call Center',
    email: 'callcenter@demo.com',
    telefono: '3001234567',
    fechaIngreso: '2025-01-01',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'Ana Rodríguez',
    email: 'ana.rodriguez@demo.com',
    telefono: '3109876543',
    fechaIngreso: '2025-01-05',
    estado: 'activo',
  },
];

export default function CallCenterManagementPage() {
  const [callcenters, setCallcenters] = useState<CallCenter[]>(MOCK_CALLCENTERS);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingCallCenter, setEditingCallCenter] = useState<CallCenter | null>(null);
  const [selectedCallCenter, setSelectedCallCenter] = useState<CallCenter | null>(null);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'info'}>({
    show: false,
    message: '',
    type: 'success',
  });

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(callcenters.length / itemsPerPage);
  const paginatedCallCenters = callcenters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCreate = () => {
    setEditingCallCenter(null);
    setFormData({ nombre: '', email: '', telefono: '' });
    setShowModal(true);
  };

  const handleEdit = (callcenter: CallCenter) => {
    setEditingCallCenter(callcenter);
    setFormData({
      nombre: callcenter.nombre,
      email: callcenter.email,
      telefono: callcenter.telefono,
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.nombre || !formData.email || !formData.telefono) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }

    if (editingCallCenter) {
      setCallcenters(callcenters.map(c => 
        c.id === editingCallCenter.id 
          ? { ...c, ...formData }
          : c
      ));
      showToast('Call Center actualizado correctamente', 'success');
    } else {
      const newCallCenter: CallCenter = {
        id: Date.now().toString(),
        ...formData,
        fechaIngreso: new Date().toISOString().split('T')[0],
        estado: 'activo',
      };
      setCallcenters([...callcenters, newCallCenter]);
      showToast('Call Center creado correctamente', 'success');
    }

    setShowModal(false);
    setFormData({ nombre: '', email: '', telefono: '' });
  };

  const handleToggleEstado = (callcenter: CallCenter) => {
    setCallcenters(callcenters.map(c => 
      c.id === callcenter.id 
        ? { ...c, estado: c.estado === 'activo' ? 'inactivo' : 'activo' }
        : c
    ));
    showToast(
      `Call Center ${callcenter.estado === 'activo' ? 'desactivado' : 'activado'} correctamente`,
      'info'
    );
  };

  const handleDeleteClick = (callcenter: CallCenter) => {
    setSelectedCallCenter(callcenter);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedCallCenter) {
      setCallcenters(callcenters.filter(c => c.id !== selectedCallCenter.id));
      showToast('Call Center eliminado correctamente', 'success');
      setShowDeleteModal(false);
      setSelectedCallCenter(null);
    }
  };

  return (
    <div>
      <PageHeader 
        title="Gestión de Call Centers" 
        subtitle="Administra los perfiles de los agentes de call center"
      />

      <div className="mb-6 bg-linear-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
        <p className="text-yellow-800 font-semibold flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          <strong>Modo Demo:</strong> Los cambios son temporales y se perderán al recargar la página.
        </p>
      </div>

      <div 
        className="rounded-2xl p-6 border border-blue-200/50 shadow-lg"
        style={{ background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#0049F3]">
            Lista de Call Centers ({callcenters.length})
          </h2>
          <GlassButton variant="primary" onClick={handleCreate}>
            <Plus className="w-5 h-5" />
            Nuevo Call Center
          </GlassButton>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-[#0049F3]/20">
                <th className="text-left p-4 font-bold text-[#0049F3]">Nombre</th>
                <th className="text-left p-4 font-bold text-[#0049F3]">Email</th>
                <th className="text-left p-4 font-bold text-[#0049F3]">Teléfono</th>
                <th className="text-left p-4 font-bold text-[#0049F3]">Fecha Ingreso</th>
                <th className="text-left p-4 font-bold text-[#0049F3]">Estado</th>
                <th className="text-center p-4 font-bold text-[#0049F3]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCallCenters.map((callcenter) => (
                <tr 
                  key={callcenter.id}
                  className="border-b border-gray-200 hover:bg-blue-50/50 transition-colors"
                >
                  <td className="p-4 font-semibold text-gray-800">{callcenter.nombre}</td>
                  <td className="p-4 text-gray-700 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#0049F3]" />
                    {callcenter.email}
                  </td>
                  <td className="p-4 text-gray-700">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#0049F3]" />
                      {callcenter.telefono}
                    </div>
                  </td>
                  <td className="p-4 text-gray-700">{callcenter.fechaIngreso}</td>
                  <td className="p-4">
                    <span 
                      className={`px-3 py-1 rounded-full text-sm font-bold ${
                        callcenter.estado === 'activo' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {callcenter.estado === 'activo' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(callcenter)}
                        className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleEstado(callcenter)}
                        className={`px-3 py-2 rounded-lg text-white font-semibold transition-colors ${
                          callcenter.estado === 'activo' 
                            ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : 'bg-green-500 hover:bg-green-600'
                        }`}
                      >
                        {callcenter.estado === 'activo' ? 'Desactivar' : 'Activar'}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(callcenter)}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <GlassPagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      {/* Modal Crear/Editar */}
      <GlassModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingCallCenter ? 'Editar Call Center' : 'Nuevo Call Center'}
        maxWidth="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nombre Completo *
            </label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
              placeholder="Ej: Carlos Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
              placeholder="Ej: carlos@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#0049F3] focus:ring-2 focus:ring-[#0049F3]/20 outline-none"
              placeholder="Ej: 3001234567"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <GlassButton variant="primary" onClick={handleSubmit} className="flex-1">
              {editingCallCenter ? 'Actualizar' : 'Crear'}
            </GlassButton>
            <GlassButton variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancelar
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {/* Modal Eliminar */}
      <GlassModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <p className="text-gray-700 mb-6">
          ¿Estás seguro de que deseas eliminar a <strong>{selectedCallCenter?.nombre}</strong>?
        </p>
        <div className="flex gap-3">
          <GlassButton variant="danger" onClick={handleDeleteConfirm} className="flex-1">
            Eliminar
          </GlassButton>
          <GlassButton variant="secondary" onClick={() => setShowDeleteModal(false)} className="flex-1">
            Cancelar
          </GlassButton>
        </div>
      </GlassModal>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
