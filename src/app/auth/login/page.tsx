'use client';

import { useState } from 'react';
import { signIn } from '@/services/auth.service';

export default function SimpleLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('� [FORM] Login iniciado con:', email);
      const result = await signIn(email, password);
      console.log('✅ [FORM] Login exitoso:', result);
      
      // NO redirigir, simplemente mostrar mensaje
      alert('✅ Login exitoso! Usuario: ' + email);
      setLoading(false);
    } catch (err) {
      console.error('❌ [FORM] Error:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  const quickLogin = async (userEmail: string, userPassword: string) => {
    console.log('🎯 [QUICK] Quick login iniciado para:', userEmail);
    setEmail(userEmail);
    setPassword(userPassword);
    setLoading(true);
    setError('');

    try {
      console.log('🔐 [QUICK] Llamando signIn...');
      const result = await signIn(userEmail, userPassword);
      console.log('✅ [QUICK] signIn completado:', result);
      
      console.log('💾 [QUICK] Verificando localStorage...');
      const session = localStorage.getItem('mock_session');
      console.log('💾 [QUICK] Sesión en localStorage:', session ? 'SÍ EXISTE' : 'NO EXISTE');
      
      if (session) {
        const sessionData = JSON.parse(session);
        console.log('💾 [QUICK] Contenido sesión:', sessionData);
        console.log('👤 [QUICK] Usuario:', sessionData.user?.name);
        console.log('🎭 [QUICK] Rol:', sessionData.user?.role);
      }
      
      console.log('🚀 [QUICK] Forzando recarga completa para aplicar cambios...');
      
      // Forzar recarga completa de la página para que el layout y sidebar se actualicen
      window.location.replace('/dashboard');
      
    } catch (err) {
      console.error('❌ [QUICK] Error:', err);
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(to bottom right, #0049F3, #003BBF, #081338)' }}>
      <div className="w-full max-w-md">
        {/* Banner de credenciales */}
        <div className="mb-6 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-4" style={{ background: 'rgba(251, 191, 36, 0.1)' }}>
          <p className="font-semibold text-yellow-100 mb-3 text-center">🚀 Modo Demo Local - Click para login rápido:</p>
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => quickLogin('admin@demo.com', 'admin123')}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              👤 Admin: admin@demo.com
            </button>
            <button
              type="button"
              onClick={() => quickLogin('callcenter@demo.com', 'callcenter123')}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              📞 Call Center: callcenter@demo.com
            </button>
            <button
              type="button"
              onClick={() => quickLogin('tendero@demo.com', 'tendero123')}
              className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              👤 Tendero: tendero@demo.com
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 text-white font-bold rounded-2xl shadow-lg transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: loading ? '#666' : 'linear-gradient(to right, #266df8, #0049F3)',
                boxShadow: '0 10px 40px rgba(38, 109, 248, 0.5)'
              }}
            >
              {loading ? '⏳ Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
