'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GlassModal, GlassButton, Toast } from '@/components/ui/GlassComponents';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, Shield, Edit2, MapPin, Building } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';

const MOCK_PROFILE = {
  name: 'Usuario Demo',
  email: 'admin@demo.com',
  phone: '3001234567',
  ciudad: 'Bogotá',
  direccion: 'Calle 123 #45-67',
  role: 'admin',
  active: true,
};

export default function PerfilPage() {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState(MOCK_PROFILE);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const handleEdit = () => {
    setEditForm(profile);
    setIsEditModalOpen(true);
  };

  const handleSave = () => {
    setProfile(editForm);
    setIsEditModalOpen(false);
    setToast({
      message: 'Perfil actualizado. Correos enviados a cliente y admin',
      type: 'success'
    });
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <PageHeader 
        title="Mi Perfil" 
        subtitle="Administra tu información personal" 
      />
      
      <div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
        <p className="text-yellow-800 font-medium">🚀 Modo Demo - Datos de ejemplo para demostración</p>
      </div>
      
      <div className="flex justify-end items-center mb-8">
        <GlassButton
          onClick={handleEdit}
          className="bg-gradient-to-r from-[#266df8] to-[#0049F3]"
        >
          <Edit2 className="w-4 h-4 mr-2" />
          Editar Perfil
        </GlassButton>
      </div>
      
      <Card className="backdrop-blur-md bg-white/80 shadow-xl border border-white/20">
        <CardHeader>
          <CardTitle className="text-2xl text-gray-800">Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <User className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.name}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Mail className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.email}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Phone className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Shield className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Rol</label>
                <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <MapPin className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Ciudad</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.ciudad}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-gradient-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Building className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Dirección</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.direccion}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <GlassModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Perfil"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <Input
              value={editForm.name}
              onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              placeholder="Nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              value={editForm.email}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">El email no se puede modificar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
            <Input
              value={editForm.phone}
              onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
              placeholder="Número de teléfono"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
            <Input
              value={editForm.ciudad}
              onChange={(e) => setEditForm({ ...editForm, ciudad: e.target.value })}
              placeholder="Ciudad"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
            <Input
              value={editForm.direccion}
              onChange={(e) => setEditForm({ ...editForm, direccion: e.target.value })}
              placeholder="Dirección completa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <Input
              value={editForm.role}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">El rol no se puede modificar</p>
          </div>

          <div className="flex gap-3 pt-4">
            <GlassButton
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-[#266df8] to-[#0049F3]"
            >
              Guardar Cambios
            </GlassButton>
            <GlassButton
              onClick={() => setIsEditModalOpen(false)}
              variant="secondary"
              className="flex-1"
            >
              Cancelar
            </GlassButton>
          </div>
        </div>
      </GlassModal>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
