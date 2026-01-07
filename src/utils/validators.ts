import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const recoverPasswordSchema = z.object({
  email: z.string().email('Correo electrónico inválido'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

export const clienteSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  cedula: z.string().min(6, 'Cédula inválida'),
  telefono: z.string().min(10, 'Teléfono inválido'),
  email: z.string().email('Correo electrónico inválido'),
});

export const tenderoSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  email: z.string().email('Correo electrónico inválido'),
  phone: z.string().min(10, 'Teléfono inválido'),
  direccion: z.string().min(5, 'La dirección debe tener al menos 5 caracteres'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const cotizacionSchema = z.object({
  numero_personas: z.number().min(1).max(7, 'Máximo 7 personas (1 titular + 6 beneficiarios)'),
  edades: z.array(z.number().min(0).max(120)),
}).refine((data) => data.edades.length === data.numero_personas, {
  message: 'Debe ingresar la edad de todas las personas',
});

export function validateCotizacion(data: Record<string, unknown>) {
  const edades = (data.edades as number[]) || [];
  const adultosMayores = edades.filter((edad: number) => edad > 70).length;
  
  if (adultosMayores > 2) {
    return {
      valid: false,
      error: 'Máximo 2 adultos mayores de 70 años',
    };
  }
  
  return { valid: true };
}
