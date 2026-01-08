// Simulación de integración con Wompi PSE
// En producción, usar la API real de Wompi

export interface WompiPaymentData {
  amount: number;
  reference: string;
  customerEmail: string;
  customerName: string;
  currency: string;
  redirectUrl: string;
}

export interface WompiTransaction {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED' | 'ERROR';
  reference: string;
  amount: number;
  paymentMethod: 'PSE' | 'CREDIT_CARD' | 'NEQUI';
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

// Simular transacción de Wompi
export const createWompiTransaction = async (data: WompiPaymentData): Promise<WompiTransaction> => {
  console.log('💳 [WOMPI] Iniciando transacción:', data);
  
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const transaction: WompiTransaction = {
    id: `WOMPI-${Date.now()}`,
    status: 'PENDING',
    reference: data.reference,
    amount: data.amount,
    paymentMethod: 'PSE',
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    createdAt: new Date().toISOString(),
  };
  
  console.log('✅ [WOMPI] Transacción creada:', transaction);
  
  return transaction;
};

// Simular aprobación de transacción (en producción vendría del webhook de Wompi)
export const simulateWompiApproval = async (transactionId: string): Promise<WompiTransaction> => {
  console.log('⏳ [WOMPI] Simulando aprobación para:', transactionId);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const transaction: WompiTransaction = {
    id: transactionId,
    status: Math.random() > 0.1 ? 'APPROVED' : 'DECLINED', // 90% éxito
    reference: `REF-${Date.now()}`,
    amount: 0,
    paymentMethod: 'PSE',
    customerName: '',
    customerEmail: '',
    createdAt: new Date().toISOString(),
  };
  
  console.log('✅ [WOMPI] Estado de transacción:', transaction.status);
  
  return transaction;
};

// Enviar email de confirmación
export const sendPurchaseConfirmationEmail = (
  customerEmail: string,
  customerName: string,
  amount: number,
  reference: string
) => {
  console.log('📧 [EMAIL] Enviando confirmación de compra...');
  console.log('📧 Para:', customerEmail);
  console.log('📧 Cliente:', customerName);
  console.log('📧 Monto:', amount);
  console.log('📧 Referencia:', reference);
  console.log('✅ [EMAIL] Confirmación enviada (modo demo)');
  
  // En producción, usar un servicio de email como SendGrid, AWS SES, etc.
  return true;
};
