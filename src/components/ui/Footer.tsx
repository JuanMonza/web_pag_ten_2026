'use client';

import { Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-blue-200/30" style={{ background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(240, 247, 255, 0.95))' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Jardines del Renacer */}
          <div>
            <h3 className="text-lg font-bold text-[#0049F3] mb-4">Jardines del Renacer</h3>
            <div className="space-y-3">
              <a
                href="https://facebook.com/jardinesdelrenacer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <a
                href="https://instagram.com/jardinesdelrenacer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/>
                </svg>
                <span>Instagram</span>
              </a>
              <a
                href="https://twitter.com/jardinesrenacer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span>Twitter</span>
              </a>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <h3 className="text-lg font-bold text-[#0049F3] mb-4">Contacto</h3>
            <div className="space-y-3">
              <a
                href="mailto:info@jardinesdelrenacer.com"
                className="flex items-center gap-2 text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">info@jardinesdelrenacer.com</span>
              </a>
              <a
                href="tel:+573001234567"
                className="flex items-center gap-2 text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                <Phone className="w-5 h-5" />
                <span className="text-sm">+57 300 123 4567</span>
              </a>
              <div className="flex items-start gap-2 text-gray-700">
                <MapPin className="w-5 h-5 mt-0.5 shrink-0" />
                <span className="text-sm">Calle 123 #45-67, Bogotá, Colombia</span>
              </div>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-bold text-[#0049F3] mb-4">Legal</h3>
            <div className="space-y-2">
              <Link
                href="/terminos"
                className="block text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                Términos y Condiciones
              </Link>
              <Link
                href="/politica-privacidad"
                className="block text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                Política de Privacidad
              </Link>
              <Link
                href="/cookies"
                className="block text-gray-700 hover:text-[#0049F3] transition-colors"
              >
                Política de Cookies
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-blue-200/30 text-center">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} <span className="font-semibold text-[#0049F3]">Jardines del Renacer</span> - Todos los derechos reservados
          </p>
          <p className="text-gray-500 text-xs mt-2">
            Desarrollado por <span className="font-semibold text-[#0049F3]">Juan Monsalve</span> - 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
