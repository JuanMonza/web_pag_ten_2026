// Sistema de autenticación MOCK para desarrollo local
// Reemplazar con Supabase en producción

interface MockUser {
  id: string;
  email: string;
  password: string;
  name: string;
  phone: string;
  role: 'admin' | 'callcenter' | 'tendero';
  active: boolean;
}

// Usuarios de prueba
const MOCK_USERS: MockUser[] = [
  {
    id: '1',
    email: 'admin@demo.com',
    password: 'admin123',
    name: 'Administrador Demo',
    phone: '3001234567',
    role: 'admin',
    active: true,
  },
  {
    id: '2',
    email: 'callcenter@demo.com',
    password: 'callcenter123',
    name: 'Carlos Call Center',
    phone: '3009876543',
    role: 'callcenter',
    active: true,
  },
  {
    id: '3',
    email: 'tendero@demo.com',
    password: 'tendero123',
    name: 'Juan Tendero',
    phone: '3005551234',
    role: 'tendero',
    active: true,
  },
];

// Almacenamiento en memoria de la sesión
let currentSession: { user: MockUser; token: string } | null = null;

export const mockAuth = {
  // Login
  signIn: async (email: string, password: string) => {
    console.log('🔍 Mock Auth - Buscando usuario:', email);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simular delay de red
    
    const user = MOCK_USERS.find(
      u => u.email === email && u.password === password && u.active
    );
    
    if (!user) {
      console.log('❌ Mock Auth - Usuario no encontrado o credenciales inválidas');
      throw new Error('Credenciales inválidas');
    }
    
    console.log('✅ Mock Auth - Usuario encontrado:', user.name, user.role);
    
    const token = btoa(JSON.stringify({ userId: user.id, exp: Date.now() + 86400000 }));
    currentSession = { user, token };
    
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_session', JSON.stringify(currentSession));
      console.log('💾 Mock Auth - Sesión guardada en localStorage');
    }
    
    return {
      user: {
        id: user.id,
        email: user.email,
        user_metadata: {
          name: user.name,
          phone: user.phone,
          role: user.role,
        },
      },
      session: { access_token: token },
    };
  },
  
  // Logout
  signOut: async () => {
    currentSession = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_session');
    }
  },
  
  // Obtener usuario actual
  getUser: async () => {
    // Intentar cargar de localStorage
    if (typeof window !== 'undefined' && !currentSession) {
      const stored = localStorage.getItem('mock_session');
      if (stored) {
        currentSession = JSON.parse(stored);
      }
    }
    
    if (!currentSession) {
      return { user: null };
    }
    
    return {
      user: {
        id: currentSession.user.id,
        email: currentSession.user.email,
        user_metadata: {
          name: currentSession.user.name,
          phone: currentSession.user.phone,
          role: currentSession.user.role,
        },
      },
    };
  },
  
  // Recuperar contraseña (simulado)
  resetPasswordForEmail: async (email: string) => {
    const user = MOCK_USERS.find(u => u.email === email);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    console.log(`📧 Email de recuperación enviado a: ${email}`);
    console.log(`🔑 Contraseña actual: ${user.password}`);
  },
  
  // Actualizar contraseña (simulado)
  updateUser: async () => {
    if (!currentSession) {
      throw new Error('No hay sesión activa');
    }
    console.log('🔐 Contraseña actualizada (modo demo)');
  },
};

// Datos mock para perfiles de usuario
export const mockUserProfiles = {
  getUserProfile: async (userId: string) => {
    const user = MOCK_USERS.find(u => u.id === userId);
    if (!user) throw new Error('Usuario no encontrado');
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      active: user.active,
      created_at: '2024-01-01T00:00:00Z',
    };
  },
};

// Verificar si estamos en modo MOCK
export const isMockMode = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://demo.supabase.co';
};

// Obtener usuario actual de forma sincrónica
export const getCurrentUser = (): MockUser | null => {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('mock_session');
  if (!stored) return null;
  
  try {
    const session = JSON.parse(stored);
    return session.user || null;
  } catch {
    return null;
  }
};
