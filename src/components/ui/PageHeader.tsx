'use client';

import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { GlassNavigation } from './GlassComponents';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showNavigation?: boolean;
  showLogout?: boolean;
}

export function PageHeader({ 
  title, 
  subtitle, 
  showNavigation = true, 
  showLogout = true 
}: PageHeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('mock_user');
    router.push('/auth/login');
  };

  return (
    <div className="mb-6 space-y-4">
      {showNavigation && <GlassNavigation />}
      
      <div className="flex items-center justify-between">
        <div>
          <h1 
            className="text-4xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p className="text-gray-600 text-lg">{subtitle}</p>
          )}
        </div>
        
        {showLogout && (
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 transition-all shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        )}
      </div>
    </div>
  );
}
