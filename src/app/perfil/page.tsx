'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { GlassModal, GlassButton, Toast } from '@/components/ui/GlassComponents';
import { Input } from '@/components/ui/Input';
import { User, Mail, Phone, Shield, Edit2, MapPin, Building, Store, Camera } from 'lucide-react';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCurrentUser } from '@/lib/mock-auth';
import Image from 'next/image';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  ciudad: string;
  direccion: string;
  nombreTienda: string;
  direccionTienda: string;
  avatar: string;
  role: string;
  active: boolean;
}

export default function PerfilPage() {
  const [profile, setProfile] = useState<ProfileData | null>(() => {
    // Inicializador perezoso: se ejecuta solo en el cliente durante el primer render
    if (typeof window === 'undefined') return null;
    
    const user = getCurrentUser();
    if (!user) return null;
    
    return {
      name: user.name || 'Usuario',
      email: user.email || '',
      phone: user.phone || '',
      ciudad: user.ciudad || '',
      direccion: user.direccion || '',
      nombreTienda: user.nombreTienda || '',
      direccionTienda: user.direccionTienda || '',
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Usuario')}&background=0049F3&color=fff&size=200`,
      role: user.role || '',
      active: true,
    };
  });
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<ProfileData | null>(() => {
    if (typeof window === 'undefined') return null;
    const user = getCurrentUser();
    if (!user) return null;
    return {
      name: user.name || 'Usuario',
      email: user.email || '',
      phone: user.phone || '',
      ciudad: user.ciudad || '',
      direccion: user.direccion || '',
      nombreTienda: user.nombreTienda || '',
      direccionTienda: user.direccionTienda || '',
      avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Usuario')}&background=0049F3&color=fff&size=200`,
      role: user.role || '',
      active: true,
    };
  });
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
      
      {!profile ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Cargando perfil...</p>
        </div>
      ) : (
        <>
          <div className="mb-6 bg-linear-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 p-4 rounded-lg shadow-sm">
            <p className="text-yellow-800 font-medium">Modo Demo - Datos específicos para {profile.name}</p>
          </div>
      
      <div className="flex justify-end items-center mb-8">
        <GlassButton
          onClick={handleEdit}
          className="bg-linear-to-r from-[#266df8] to-[#0049F3] text-white"
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
          {/* Avatar */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#0049F3] shadow-lg">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={handleEdit}
                className="absolute bottom-0 right-0 p-2 bg-[#0049F3] text-white rounded-full shadow-lg hover:bg-[#266df8] transition-colors"
                title="Cambiar avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <User className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.name}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Mail className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.email}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Phone className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Teléfono</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.phone}</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Store className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Nombre de Tienda</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.nombreTienda}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Building className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Dirección de Tienda</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.direccionTienda}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <Shield className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Rol</label>
                <p className="mt-1 text-lg font-semibold text-gray-900 capitalize">{profile.role}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <MapPin className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Ciudad</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">{profile.ciudad}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="p-3 bg-linear-to-br from-[#266df8]/20 to-[#0049F3]/20 rounded-lg">
                <MapPin className="w-6 h-6 text-[#266df8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Dirección Personal</label>
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
            <label className="block text-sm font-medium text-white mb-1">Avatar URL</label>
            <Input
              value={editForm?.avatar || ''}
              onChange={(e) => setEditForm(editForm ? { ...editForm, avatar: e.target.value } : null)}
              placeholder="URL de la imagen de avatar"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
            <p className="text-xs text-white/80 mt-1">Ejemplo: https://ui-avatars.com/api/?name=Tu+Nombre</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Nombre</label>
            <Input
              value={editForm?.name || ''}
              onChange={(e) => setEditForm(editForm ? { ...editForm, name: e.target.value } : null)}
              placeholder="Nombre completo"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <Input
              value={editForm?.email || ''}
              disabled
              className="bg-gray-200 text-gray-700 cursor-not-allowed border-white/30 shadow-lg"
            />
            <p className="text-xs text-white/80 mt-1">El email no se puede modificar</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Teléfono</label>
            <Input
              value={editForm?.phone || ''}
              onChange={(e) => setEditForm(editForm ? { ...editForm, phone: e.target.value } : null)}
              placeholder="Número de teléfono"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Nombre de Tienda</label>
            <Input
              value={editForm?.nombreTienda || ''}
              onChange={(e) => setEditForm(editForm ? { ...editForm, nombreTienda: e.target.value } : null)}
              placeholder="Nombre de la tienda"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Dirección de Tienda</label>
            <Input
              value={editForm?.direccionTienda || ''}
              onChange={(e) => setEditForm(editForm ? { ...editForm, direccionTienda: e.target.value } : null)}
              placeholder="Dirección completa de la tienda"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Ciudad</label>
            <Input
              value={editForm?.ciudad || ''}
              onChange={(e) => setEditForm(editForm ? { ...editForm, ciudad: e.target.value } : null)}
              placeholder="Ciudad"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Dirección Personal</label>
            <Input
              value={editForm?.direccion || ''}
              onChange={(e) => setEditForm(editForm ? { ...editForm, direccion: e.target.value } : null)}
              placeholder="Dirección completa"
              className="bg-white text-gray-900 border-white/30 shadow-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">Rol</label>
            <Input
              value={editForm?.role || ''}
              disabled
              className="bg-gray-200 text-gray-700 cursor-not-allowed border-white/30 shadow-lg"
            />
            <p className="text-xs text-white/80 mt-1">El rol no se puede modificar</p>
          </div>

          <div className="flex gap-3 pt-4">
            <GlassButton
              onClick={handleSave}
              className="flex-1 bg-linear-to-r from-[#266df8] to-[#0049F3] text-white"
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

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
      )}
    </div>
  );
}
