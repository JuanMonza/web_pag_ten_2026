import React from 'react';
import { cn } from '@/utils/cn';
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
}

export function Alert({ type, message, onClose }: AlertProps) {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };
  
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };
  
  const Icon = icons[type];
  
  return (
    <div className={cn('flex items-center p-4 border rounded-lg', styles[type])}>
      <Icon className="mr-3 flex-shrink-0" size={20} />
      <p className="flex-1">{message}</p>
      {onClose && (
        <button onClick={onClose} className="ml-3 flex-shrink-0">
          <XCircle size={20} />
        </button>
      )}
    </div>
  );
}
