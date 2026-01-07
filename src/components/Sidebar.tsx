'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Calculator, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  User,
  LogOut,
  Menu,
  X,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { signOut } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  userRole: string;
  userName: string;
}

export function Sidebar({ userRole, userName }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin', 'tendero', 'callcenter'] },
    { href: '/cotizador', label: 'Cotizador', icon: Calculator, roles: ['tendero', 'callcenter'] },
    { href: '/clientes', label: 'Clientes', icon: Users, roles: ['admin', 'tendero', 'callcenter'] },
    { href: '/ventas', label: 'Ventas', icon: ShoppingCart, roles: ['admin', 'tendero', 'callcenter'] },
    { href: '/comisiones', label: 'Comisiones', icon: DollarSign, roles: ['admin', 'tendero'] },
    { href: '/admin/tenderos', label: 'Gestión Tenderos', icon: Settings, roles: ['admin'] },
    { href: '/perfil', label: 'Perfil', icon: User, roles: ['admin', 'tendero', 'callcenter'] },
  ];
  
  const filteredMenu = menuItems.filter(item => item.roles.includes(userRole));
  
  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };
  
  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold">Planes Exequiales</h1>
            <p className="text-sm text-gray-400 mt-1">{userName}</p>
            <p className="text-xs text-gray-500 capitalize">{userRole}</p>
          </div>
          
          <nav className="flex-1 px-4">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center px-4 py-3 mb-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={20} className="mr-3" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>
      
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
