'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Users, ShoppingCart, DollarSign, Calculator, TrendingUp, Award } from 'lucide-react';
import { formatCurrency } from '@/utils/formatters';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from '@/lib/mock-auth';

const MOCK_STATS = {
  totalCotizaciones: 45,
  totalVentas: 32,
  totalComisiones: 4500000,
  totalTenderos: 18,
  ventasMes: 12,
  comisionesMes: 1250000,
};

export default function DashboardPage() {
  const router = useRouter();
  const user = getCurrentUser();
  const userRole = user?.role || null;

  const allStatsCards = [
    {
      title: 'Cotizaciones',
      value: MOCK_STATS.totalCotizaciones,
      icon: Calculator,
      gradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%)',
      border: 'border-purple-300/30',
      label: 'Total',
      link: '/cotizador',
      roles: ['tendero', 'callcenter', 'admin'],
    },
    {
      title: 'Ventas Cerradas',
      value: MOCK_STATS.totalVentas,
      icon: ShoppingCart,
      gradient: 'linear-gradient(135deg, #34d399 0%, #10b981 100%)',
      border: 'border-green-300/30',
      label: 'Total',
      link: '/ventas',
      roles: ['tendero', 'callcenter', 'admin'],
    },
    {
      title: 'Comisiones',
      value: formatCurrency(MOCK_STATS.totalComisiones),
      icon: DollarSign,
      gradient: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
      border: 'border-yellow-300/30',
      label: 'Total',
      link: '/comisiones',
      roles: ['tendero', 'admin'],
    },
    {
      title: 'Tenderos',
      value: MOCK_STATS.totalTenderos,
      icon: Users,
      gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%)',
      border: 'border-blue-300/30',
      label: 'Activos',
      link: '/admin/tenderos',
      roles: ['admin'],
    },
    {
      title: 'Ventas del Mes',
      value: MOCK_STATS.ventasMes,
      icon: TrendingUp,
      gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 100%)',
      border: 'border-pink-300/30',
      label: 'Mes actual',
      link: '/ventas',
      roles: ['tendero', 'callcenter', 'admin'],
    },
    {
      title: 'Comisiones del Mes',
      value: formatCurrency(MOCK_STATS.comisionesMes),
      icon: Award,
      gradient: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)',
      border: 'border-indigo-300/30',
      label: 'Mes actual',
      link: '/comisiones',
      roles: ['tendero', 'admin'],
    },
  ];

  const statsCards = userRole 
    ? allStatsCards.filter(card => card.roles.includes(userRole))
    : [];

  return (
    <div className='space-y-6'>
      {/* Banner Bienvenida */}
      <div 
        className='rounded-3xl p-8 border border-white/20 shadow-2xl'
        style={{ 
          background: 'linear-gradient(135deg, #266df8 0%, #0049F3 50%, #003BBF 100%)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <h1 className='text-4xl font-bold text-white mb-2'>
          ¡Bienvenido al Dashboard! 🎉
        </h1>
        <p className='text-blue-100 text-lg'>
          Aquí puedes ver todas las estadísticas y gestionar tu plataforma
        </p>
      </div>

      {/* Grid de Estadísticas */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {statsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <button
              key={index}
              onClick={() => router.push(card.link)}
              className={`rounded-2xl p-6 border ${card.border} shadow-lg transform hover:scale-105 transition-all duration-300 text-left cursor-pointer`}
              style={{ background: card.gradient }}
            >
              <div className='flex items-center justify-between mb-4'>
                <div className='p-3 bg-white/20 rounded-xl backdrop-blur-sm'>
                  <Icon className='w-8 h-8 text-white' />
                </div>
                <span className='text-white/80 text-sm font-semibold'>{card.label}</span>
              </div>
              <h3 className='text-white/90 font-semibold mb-1'>{card.title}</h3>
              <p className='text-4xl font-bold text-white'>{card.value}</p>
            </button>
          );
        })}
      </div>

      {/* Actividad Reciente */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#0049F3]">📈 Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            <div className='flex items-center gap-4 p-3 bg-green-50 rounded-lg'>
              <div className='p-2 bg-green-500 rounded-lg'>
                <ShoppingCart className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='font-semibold text-gray-800'>Nueva venta cerrada</p>
                <p className='text-sm text-gray-600'>Cliente: María González - ,000,000</p>
              </div>
            </div>
            <div className='flex items-center gap-4 p-3 bg-blue-50 rounded-lg'>
              <div className='p-2 bg-blue-500 rounded-lg'>
                <Calculator className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='font-semibold text-gray-800'>Nueva cotización creada</p>
                <p className='text-sm text-gray-600'>Cliente: Pedro Martínez - Plan Familiar</p>
              </div>
            </div>
            <div className='flex items-center gap-4 p-3 bg-purple-50 rounded-lg'>
              <div className='p-2 bg-purple-500 rounded-lg'>
                <Users className='w-5 h-5 text-white' />
              </div>
              <div>
                <p className='font-semibold text-gray-800'>Nuevo tendero registrado</p>
                <p className='text-sm text-gray-600'>Juan Pérez - Comisión 15%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Demo Badge */}
      <div className='backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-4' style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
        <div className='flex items-center gap-3'>
          <svg className='w-6 h-6 text-yellow-600' fill='currentColor' viewBox='0 0 20 20'>
            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
          </svg>
          <div className='flex-1'>
            <p className='font-semibold text-yellow-800'>🚀 Modo Demo Local - Listo para mostrar</p>
            <p className='text-sm text-yellow-700 mt-1'>Plataforma funcional con datos de ejemplo. Cuando despliegues con Supabase, verás datos reales.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
