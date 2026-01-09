'use client';

import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { X, Home, ArrowLeft, ChevronLeft, ChevronRight, CheckCircle, XCircle, Info } from 'lucide-react';

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export function GlassModal({ isOpen, onClose, title, children, maxWidth = 'md' }: GlassModalProps) {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(8, 19, 56, 0.8)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div 
        className={`w-full ${widthClasses[maxWidth]} rounded-3xl border border-white/20 shadow-2xl transform transition-all`}
        style={{ 
          background: 'linear-gradient(to bottom right, rgba(38, 109, 248, 0.95), rgba(0, 73, 243, 0.95))',
          backdropFilter: 'blur(20px)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

interface GlassButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  type?: 'button' | 'submit';
  disabled?: boolean;
  className?: string;
}

export function GlassButton({ 
  children, 
  onClick, 
  variant = 'primary', 
  type = 'button',
  disabled = false,
  className = ''
}: GlassButtonProps) {
  const styles = {
    primary: 'bg-white text-blue-600 hover:bg-blue-50',
    secondary: 'bg-white/20 text-white hover:bg-white/30',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  const styles = {
    success: 'from-green-500 to-green-600',
    error: 'from-red-500 to-red-600',
    info: 'from-blue-500 to-blue-600',
  };

  const IconComponent = {
    success: CheckCircle,
    error: XCircle,
    info: Info,
  }[type];

  return (
    <div 
      className={`fixed top-4 right-4 z-50 bg-linear-to-r ${styles[type]} text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}
      style={{ backdropFilter: 'blur(10px)', animation: 'slideIn 0.3s ease-out' }}
    >
      <IconComponent className="w-6 h-6" />
      <span className="font-semibold">{message}</span>
      <button onClick={onClose} className="ml-4 hover:opacity-75">
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}

// Navegación con glassmorphism
interface GlassNavigationProps {
  showBack?: boolean;
  showHome?: boolean;
}

export function GlassNavigation({ showBack = true, showHome = true }: GlassNavigationProps) {
  const router = useRouter();

  return (
    <div className="flex gap-3 mb-6">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 transition-all shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <ArrowLeft className="w-5 h-5" />
          Volver Atrás
        </button>
      )}
      {showHome && (
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-white font-semibold hover:scale-105 transition-all shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Home className="w-5 h-5" />
          Ir al Inicio
        </button>
      )}
    </div>
  );
}

// Paginación con glassmorphism
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function GlassPagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
        style={{
          background: currentPage === 1 ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">...</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            className="px-4 py-2 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              background: currentPage === page 
                ? 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)'
                : 'rgba(255, 255, 255, 0.8)',
              color: currentPage === page ? 'white' : '#0049F3',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(0, 73, 243, 0.2)',
            }}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-all"
        style={{
          background: currentPage === totalPages ? 'rgba(107, 114, 128, 0.5)' : 'linear-gradient(135deg, #266df8 0%, #0049F3 100%)',
          backdropFilter: 'blur(10px)',
        }}
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
