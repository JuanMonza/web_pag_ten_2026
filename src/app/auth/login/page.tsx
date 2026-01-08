'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema } from '@/utils/validators';
import { signIn } from '@/services/auth.service';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });
  
  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    
    try {
      await signIn(data.email, data.password);
      router.push('/dashboard');
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : '';
      if (errorMessage.includes('Supabase no está configurado')) {
        setError('⚠️ La base de datos no está configurada. Revisa el archivo SETUP_GUIDE.md para instrucciones de configuración.');
      } else {
        setError('Credenciales inválidas. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden p-4">
      {/* Fondo con degradado Royal Blue */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, #0049F3, #003BBF, #081338)' }}>
        {/* Patrón de cuadrícula sutil */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.03) 41px),
                             repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, transparent 1px, transparent 40px, rgba(255,255,255,0.03) 41px)`
          }}></div>
        </div>
      </div>

      {/* Efectos de luz brillantes */}
      <div className="absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(38, 109, 248, 0.2)' }}></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(38, 109, 248, 0.2)', animationDelay: '1s' }}></div>

      {/* Card principal con glassmorphism */}
      <div className="relative w-full max-w-md z-10">
        {/* Glow effect detrás del card */}
        <div className="absolute inset-0 rounded-3xl blur-2xl scale-95" style={{ background: 'rgba(38, 109, 248, 0.3)' }}></div>
        
        {/* Card glassmorphism */}
        <div className="relative backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8" style={{ background: 'rgba(8, 19, 56, 0.4)' }}>
          {/* Header con icono */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 shadow-lg animate-float" style={{ 
              background: 'linear-gradient(to bottom right, #266df8, #0049F3)',
              boxShadow: '0 10px 40px rgba(38, 109, 248, 0.5)'
            }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">Planes Exequiales</h1>
            <p className="text-blue-200 text-lg">Inicia sesión para continuar</p>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-400/50 backdrop-blur-sm rounded-2xl p-4 animate-pulse">
                <p className="text-red-200 text-sm font-medium">{error}</p>
              </div>
            )}
            
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-100 ml-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  {...register('email')}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300/60 focus:outline-none focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                  style={{ boxShadow: '0 0 0 2px transparent' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #266df8'}
                  onBlur={(e) => e.target.style.boxShadow = '0 0 0 2px transparent'}
                  placeholder="tu@email.com"
                />
              </div>
              {errors.email && (
                <p className="mt-2 text-sm text-red-300 ml-1">{errors.email.message as string}</p>
              )}
            </div>
            
            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-100 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  {...register('password')}
                  className="w-full pl-12 pr-4 py-4 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300/60 focus:outline-none focus:border-transparent backdrop-blur-sm transition-all duration-300 hover:bg-white/15"
                  style={{ boxShadow: '0 0 0 2px transparent' }}
                  onFocus={(e) => e.target.style.boxShadow = '0 0 0 2px #266df8'}
                  onBlur={(e) => e.target.style.boxShadow = '0 0 0 2px transparent'}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300 ml-1">{errors.password.message as string}</p>
              )}
            </div>
            
            {/* Recordarme y Olvidaste */}
            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-white/30 bg-white/10 cursor-pointer" style={{ accentColor: '#266df8' }} />
                <span className="ml-2 text-sm text-blue-200 group-hover:text-white transition-colors">Recordarme</span>
              </label>
              <Link
                href="/auth/recover-password"
                className="text-sm text-blue-200 hover:text-white transition-colors font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            
            {/* Botón de envío */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 text-white font-bold rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
              style={{
                background: 'linear-gradient(to right, #266df8, #0049F3)',
                boxShadow: '0 10px 40px rgba(38, 109, 248, 0.5)'
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(to right, #0049F3, #003BBF)';
                  e.currentTarget.style.boxShadow = '0 15px 50px rgba(38, 109, 248, 0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(to right, #266df8, #0049F3)';
                  e.currentTarget.style.boxShadow = '0 10px 40px rgba(38, 109, 248, 0.5)';
                }
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Iniciando sesión...
                </span>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-blue-200">
              ¿Problemas para acceder?{' '}
              <a href="#" className="text-white hover:text-brand-500 font-semibold transition-colors">
                Contacta soporte
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
