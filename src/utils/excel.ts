// Utilidad para descargar datos como Excel (simulado con CSV)
export function downloadExcel(data: any[], filename: string) {
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

// Simular envío de correo
export function sendEmailNotification(to: string, subject: string, message: string) {
  console.log('📧 Enviando correo...');
  console.log('Para:', to);
  console.log('Asunto:', subject);
  console.log('Mensaje:', message);
  
  // En producción, aquí se llamaría a un endpoint de backend
  return true;
}

// Enviar correos de confirmación al registrar nuevo usuario
export function sendRegistrationEmails(clienteEmail: string, clienteNombre: string, adminEmail: string = 'admin@demo.com') {
  // Correo al cliente
  sendEmailNotification(
    clienteEmail,
    '¡Bienvenido a Planes Exequiales!',
    `Hola ${clienteNombre},\n\nTu cuenta ha sido creada exitosamente. Gracias por confiar en nosotros.\n\nSaludos,\nEquipo Planes Exequiales`
  );

  // Correo al admin
  sendEmailNotification(
    adminEmail,
    'Nuevo registro en el sistema',
    `Un nuevo usuario se ha registrado:\n\nNombre: ${clienteNombre}\nEmail: ${clienteEmail}\n\nRevisa el panel de administración para más detalles.`
  );

  return true;
}
