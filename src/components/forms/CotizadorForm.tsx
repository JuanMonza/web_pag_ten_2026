'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Alert } from '@/components/ui/Alert';
import { formatCurrency } from '@/utils/formatters';
import { calcularCotizacion } from '@/services/cotizacion.service';
import { validateCotizacion } from '@/utils/validators';
import type { CotizacionResult } from '@/types/cotizacion.types';

interface CotizadorFormProps {
  onCotizacionCalculada: (resultado: CotizacionResult) => void;
}

export function CotizadorForm({ onCotizacionCalculada }: CotizadorFormProps) {
  const [numeroPersonas, setNumeroPersonas] = useState(1);
  const [edades, setEdades] = useState<number[]>([]);
  const [error, setError] = useState('');
  const [resultado, setResultado] = useState<CotizacionResult | null>(null);
  
  const handleNumeroPersonasChange = (num: number) => {
    if (num < 1 || num > 7) return;
    setNumeroPersonas(num);
    setEdades(new Array(num).fill(0));
    setResultado(null);
  };
  
  const handleEdadChange = (index: number, edad: number) => {
    const nuevasEdades = [...edades];
    nuevasEdades[index] = edad;
    setEdades(nuevasEdades);
  };
  
  const handleCalcular = () => {
    setError('');
    
    const validation = validateCotizacion({
      numero_personas: numeroPersonas,
      edades,
    });
    
    if (!validation.valid) {
      setError(validation.error || 'Error de validación');
      return;
    }
    
    const result = calcularCotizacion({
      numero_personas: numeroPersonas,
      edades,
    });
    
    setResultado(result);
    onCotizacionCalculada(result);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Configuración del Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de personas (1 titular + hasta 6 beneficiarios)
              </label>
              <Input
                type="number"
                min="1"
                max="7"
                value={numeroPersonas}
                onChange={(e) => handleNumeroPersonasChange(parseInt(e.target.value))}
              />
            </div>
            
            {edades.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Edades de los beneficiarios
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {edades.map((edad, index) => (
                    <Input
                      key={index}
                      type="number"
                      min="0"
                      max="120"
                      placeholder={`Persona ${index + 1}`}
                      value={edad || ''}
                      onChange={(e) => handleEdadChange(index, parseInt(e.target.value) || 0)}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {error && <Alert type="error" message={error} onClose={() => setError('')} />}
            
            <Button onClick={handleCalcular} className="w-full">
              Calcular Cotización
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {resultado && (
        <Card className="bg-blue-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle>Resumen de la Cotización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="font-medium">Número de personas:</span>
                <span>{resultado.numero_personas}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Adultos mayores (+ 70 años):</span>
                <span>{resultado.adultos_mayores}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Valor base:</span>
                <span>{formatCurrency(resultado.valor_base)}</span>
              </div>
              
              {resultado.valor_adultos_mayores > 0 && (
                <div className="flex justify-between">
                  <span className="font-medium">Adicional adultos mayores:</span>
                  <span>{formatCurrency(resultado.valor_adultos_mayores)}</span>
                </div>
              )}
              
              <div className="border-t-2 border-blue-300 pt-3 mt-3">
                <div className="flex justify-between text-lg font-bold">
                  <span>VALOR TOTAL:</span>
                  <span className="text-blue-600">{formatCurrency(resultado.valor_total)}</span>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-3 mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Tu comisión:</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(resultado.comision_tendero)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
