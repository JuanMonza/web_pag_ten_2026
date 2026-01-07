interface WompiPaymentData {
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  reference: string;
  redirect_url: string;
}

export async function crearTransaccionWompi(data: WompiPaymentData) {
  const response = await fetch('https://production.wompi.co/v1/transactions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    throw new Error('Error al crear transacción en Wompi');
  }
  
  return response.json();
}

export async function verificarTransaccion(transactionId: string) {
  const response = await fetch(`https://production.wompi.co/v1/transactions/${transactionId}`, {
    headers: {
      'Authorization': `Bearer ${process.env.NEXT_PUBLIC_WOMPI_PUBLIC_KEY}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Error al verificar transacción');
  }
  
  return response.json();
}

export function generarReferenciaUnica(): string {
  return `REF-${Date.now()}-${Math.random().toString(36).substring(7)}`;
}
