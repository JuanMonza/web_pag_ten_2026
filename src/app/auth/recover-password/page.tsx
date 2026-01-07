'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { recoverPasswordSchema } from '@/utils/validators';
import { recoverPassword } from '@/services/auth.service';

interface RecoverPasswordFormData {
  email: string;
}

export default function RecoverPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(recoverPasswordSchema),
  });
  
  const onSubmit = async (data: RecoverPasswordFormData) => {
    setLoading(true);
    setError('');
    
    try {
      await recoverPassword(data.email);
      setSuccess(true);
    } catch {
      setError('Error al enviar el correo de recuperación');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Recuperar Contraseña</CardTitle>
          <p className="text-center text-gray-600 mt-2">
            Te enviaremos un enlace para restablecer tu contraseña
          </p>
        </CardHeader>
        <CardContent>
          {success ? (
            <div className="space-y-4">
              <Alert
                type="success"
                message="Correo enviado exitosamente. Revisa tu bandeja de entrada."
              />
              <Link href="/auth/login">
                <Button className="w-full">Volver al inicio de sesión</Button>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {error && <Alert type="error" message={error} onClose={() => setError('')} />}
              
              <Input
                label="Correo Electrónico"
                type="email"
                {...register('email')}
                error={errors.email?.message as string}
              />
              
              <Button type="submit" isLoading={loading} className="w-full">
                Enviar Enlace de Recuperación
              </Button>
              
              <Link href="/auth/login">
                <Button variant="ghost" className="w-full">
                  Volver al inicio de sesión
                </Button>
              </Link>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
