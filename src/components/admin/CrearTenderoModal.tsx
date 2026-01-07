'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { Modal } from '@/components/ui/Modal';
import { tenderoSchema } from '@/utils/validators';
import { crearTendero } from '@/services/admin.service';

interface TenderoFormData {
  name: string;
  email: string;
  phone: string;
  direccion: string;
  password: string;
}

interface CrearTenderoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CrearTenderoModal({ isOpen, onClose, onSuccess }: CrearTenderoModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TenderoFormData>({
    resolver: zodResolver(tenderoSchema),
  });

  const onSubmit = async (data: TenderoFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      await crearTendero(data);
      setSuccess('Tendero creado exitosamente');
      reset();
      setTimeout(() => {
        onClose();
        onSuccess();
      }, 2000);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el tendero';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear Nuevo Tendero" size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && <Alert type="error" message={error} onClose={() => setError('')} />}
        {success && <Alert type="success" message={success} />}
        
        <Input
          label="Nombre Completo"
          {...register('name')}
          error={errors.name?.message as string}
        />
        
        <Input
          label="Email"
          type="email"
          {...register('email')}
          error={errors.email?.message as string}
        />
        
        <Input
          label="Teléfono"
          type="tel"
          {...register('phone')}
          error={errors.phone?.message as string}
        />
        
        <Input
          label="Dirección"
          {...register('direccion')}
          error={errors.direccion?.message as string}
        />
        
        <Input
          label="Contraseña"
          type="password"
          {...register('password')}
          error={errors.password?.message as string}
        />
        
        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancelar
          </Button>
          <Button type="submit" isLoading={loading} className="flex-1">
            Crear Tendero
          </Button>
        </div>
      </form>
    </Modal>
  );
}
