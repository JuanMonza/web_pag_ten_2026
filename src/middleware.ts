import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // ⚠️ MIDDLEWARE TEMPORALMENTE DESHABILITADO PARA MODO DEMO LOCAL
  // En modo demo, no bloqueamos ninguna ruta
  console.log('🔓 Middleware: Permitiendo acceso a', request.nextUrl.pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/cotizador/:path*',
    '/clientes/:path*',
    '/ventas/:path*',
    '/comisiones/:path*',
    '/perfil/:path*',
    '/auth/:path*',
  ],
};
