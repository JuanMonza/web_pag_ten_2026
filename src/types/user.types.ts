export type UserRole = 'admin' | 'tendero' | 'callcenter';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  active: boolean;
  created_at: string;
}

export interface Tendero {
  id: string;
  user_id: string;
  direccion: string;
  comision_total: number;
  user?: User;
}

export interface Cliente {
  id: string;
  nombre: string;
  cedula: string;
  telefono: string;
  email: string;
  tendero_id: string;
  created_at: string;
}
