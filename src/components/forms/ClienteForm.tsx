'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { clienteSchema } from '@/utils/validators';
import { crearCliente, buscarClientePorCedula } from '@/services/clientes.service';
import { Cliente } from '@/types/cotizacion.types';

interface ClienteFormData {
  cedula: string;
  nombre: string;
  email: string;
  telefono: string;
}

interface ClienteFormProps {
  tenderoId: string;
  onSuccess: (cliente: Cliente) => void;
}

export function ClienteForm({ tenderoId, onSuccess }: ClienteFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<ClienteFormData>({
    resolver: zodResolver(clienteSchema),
  });
  
  const buscarCliente = async (cedula: string) => {
    if (cedula.length < 6) return;
    
    try {
      const cliente = await buscarClientePorCedula(cedula);
      if (cliente) {
        setValue('nombre', cliente.nombre);
        setValue('telefono', cliente.telefono);
        setValue('email', cliente.email);
        setSuccess('Cliente encontrado en la base de datos');
      }
    } catch {
      // Cliente no existe, continuar con el registro
    }
  };

  const onSubmit = async (data: ClienteFormData) => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const cliente = await crearCliente({
        nombre: data.nombre,
        cedula: data.cedula,
        telefono: data.telefono,
        email: data.email,
        tendero_id: tenderoId,
      });
      
      setSuccess('Cliente registrado exitosamente');
      onSuccess(cliente);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el cliente';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && <Alert type="error" message={error} onClose={() => setError('')} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
      
      <Input
        label="Cédula"
        {...register('cedula')}
        error={errors.cedula?.message as string}
        onBlur={(e) => buscarCliente(e.target.value)}
      />
      
      <Input
        label="Nombre Completo"
        {...register('nombre')}
        error={errors.nombre?.message as string}
      />
      
      <Input
        label="Teléfono"
        type="tel"
        {...register('telefono')}
        error={errors.telefono?.message as string}
      />
      
      <Input
        label="Email"
        type="email"
        {...register('email')}
        error={errors.email?.message as string}
      />
      
      <Button type="submit" isLoading={loading} className="w-full">
        Registrar Cliente
      </Button>
    </form>
  );
}
