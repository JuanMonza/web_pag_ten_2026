'use client';

import { Sidebar } from '@/components/Sidebar';
import { getCurrentUser } from '@/lib/mock-auth';
import { useEffect, useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [userName, setUserName] = useState('Usuario Demo');
  const [userRole, setUserRole] = useState<'admin' | 'callcenter' | 'tendero'>('admin');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setUserName(user.name);
      setUserRole(user.role);
      console.log('🎭 [LAYOUT] Usuario cargado:', user.name, '- Rol:', user.role);
    } else {
      console.warn('⚠️ [LAYOUT] No se encontró usuario en sesión');
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar userRole={userRole} userName={userName} />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
