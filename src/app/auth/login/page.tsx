'use client';

import { useState } from 'react';
import { signIn } from '@/services/auth.service';
import { Toast } from '@/components/ui/GlassComponents';
import { Footer } from '@/components/ui/Footer';
import Link from 'next/link';
import { User, Lock, Rocket, Phone, Lightbulb } from 'lucide-react';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [toast, setToast] = useState<{show: boolean, message: string, type: 'success' | 'error' | 'info'}>({show: false, message: '', type: 'success'});

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn(email, password);
      
      if (rememberMe) {
        localStorage.setItem('remember_email', email);
      } else {
        localStorage.removeItem('remember_email');
      }
      
      showToast('Ingreso exitoso. Bienvenido!', 'success');
      
      setTimeout(() => {
        window.location.replace('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      showToast('Error al iniciar sesión', 'error');
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    setEmail(userEmail);
    setPassword(userPassword);
    setLoading(true);
    setError('');

    try {
      await signIn(userEmail, userPassword);
      showToast('Ingreso exitoso. Bienvenido!', 'success');
      
      setTimeout(() => {
        window.location.replace('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      showToast('Error al iniciar sesión', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #0049F3, #003BBF, #081338)' }}>
        <div className="w-full max-w-md">
          {/* Banner de credenciales */}
          <div className="mb-6 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-4" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
            <p className="font-semibold text-yellow-100 mb-3 text-center flex items-center justify-center gap-2">
              <Rocket className="w-5 h-5" />
              Modo Demo Local - Click para login rápido:
            </p>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => quickLogin('admin@demo.com', 'admin123')}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Admin: admin@demo.com
              </button>
              <button
                type="button"
                onClick={() => quickLogin('callcenter@demo.com', 'callcenter123')}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4" />
                Call Center: callcenter@demo.com
              </button>
              <button
                type="button"
                onClick={() => quickLogin('tendero@demo.com', 'tendero123')}
                className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <User className="w-4 h-4" />
                Tendero: tendero@demo.com
              </button>
            </div>
          </div>

          {/* Card de login */}
          <div className="backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8" style={{ background: 'rgba(8, 19, 56, 0.4)' }}>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-3">Planes Exequiales</h1>
              <p className="text-blue-200 text-lg">Inicia sesión para continuar</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-400/50 backdrop-blur-sm rounded-2xl p-4">
                  <p className="text-red-200 text-sm font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-2">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-blue-100 mb-2">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-white placeholder-blue-300/60 focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-sm"
                  placeholder="••••••••"
                />
              </div>

              {/* Recordarme y Recuperar Contraseña */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-white/20 bg-white/10 text-blue-500 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-blue-100">Recordarme</span>
                </label>
                <Link
                  href="/auth/recover-password"
                  className="text-sm text-blue-200 hover:text-white transition-colors font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 text-white font-bold rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: loading ? '#666' : 'linear-gradient(to right, #266df8, #0049F3)',
                  boxShadow: '0 10px 40px rgba(38, 109, 248, 0.5)'
                }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <Footer />

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
