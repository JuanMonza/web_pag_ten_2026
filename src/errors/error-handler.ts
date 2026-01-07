export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class AuthError extends AppError {
  constructor(message: string = 'Error de autenticación') {
    super(message, 401, 'AUTH_ERROR');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Recurso no encontrado') {
    super(message, 404, 'NOT_FOUND');
  }
}

export function handleError(error: any): string {
  if (error instanceof AppError) {
    return error.message;
  }
  
  if (error.code === 'PGRST116') {
    return 'Recurso no encontrado';
  }
  
  if (error.message?.includes('duplicate key')) {
    return 'El registro ya existe';
  }
  
  if (error.message?.includes('foreign key')) {
    return 'Error de referencia: el recurso relacionado no existe';
  }
  
  console.error('Error no manejado:', error);
  return 'Ha ocurrido un error inesperado';
}
