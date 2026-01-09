// Utilidad para descargar datos como Excel (simulado con CSV)
export function downloadExcel(data: Record<string, unknown>[], filename: string) {
  // Convertir array de objetos a CSV
  if (data.length === 0) {
    alert('No hay datos para descargar');
    return;
  }

  const headers = Object.keys(data[0]);
  const csvRows = [];

  // Agregar encabezados
  csvRows.push(headers.join(','));

  // Agregar filas
  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header];
      // Escapar valores con comas o comillas
      const escaped = ('' + value).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(','));
  }

  // Crear blob y descargar
  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

import { sendEmail, emailTemplates } from '@/services/email.service';

// Envío de correo con Resend
export async function sendEmailNotification(to: string, subject: string, message: string, html?: string) {
  console.log('📧 Enviando correo a:', to);
  console.log('Asunto:', subject);
  
  try {
    const success = await sendEmail({
      to,
      subject,
      html: html || `<p>${message.replace(/\n/g, '<br>')}</p>`,
      text: message,
    });

    if (success) {
      console.log('✅ Correo enviado exitosamente');
    } else {
      console.error('❌ Error al enviar correo');
    }
    
    return success;
  } catch (error) {
    console.error('❌ Error en sendEmailNotification:', error);
    return false;
  }
}

// Enviar correos de confirmación al registrar nuevo usuario
export async function sendRegistrationEmails(clienteEmail: string, clienteNombre: string, adminEmail: string = 'admin@demo.com') {
  // Correo al cliente
  const clienteTemplate = emailTemplates.registroCliente(clienteNombre);
  await sendEmail({
    to: clienteEmail,
    subject: clienteTemplate.subject,
    html: clienteTemplate.html,
    text: clienteTemplate.text,
  });

  // Correo al admin
  const adminTemplate = emailTemplates.notificacionAdmin(clienteNombre, clienteEmail);
  await sendEmail({
    to: adminEmail,
    subject: adminTemplate.subject,
    html: adminTemplate.html,
    text: adminTemplate.text,
  });

  return true;
}
