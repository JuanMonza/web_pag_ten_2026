// Servicio de envío de correos usando Resend

interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
}

export async function sendEmail({ to, subject, html, text }: EmailOptions): Promise<boolean> {
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html, text }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error enviando email:', data.error);
      return false;
    }

    console.log('✅ Email enviado exitosamente');
    return true;
  } catch (error) {
    console.error('Error en sendEmail:', error);
    return false;
  }
}

// Plantillas de correo
export const emailTemplates = {
  registroCliente: (nombre: string) => ({
    subject: '¡Bienvenido a Jardines del Renacer!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0049F3 0%, #266df8 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { background: #0049F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>¡Bienvenido a Jardines del Renacer!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${nombre}</strong>,</p>
              <p>Tu cuenta ha sido creada exitosamente en nuestro sistema de Planes Exequiales.</p>
              <p>Ahora puedes acceder a tu panel de usuario y gestionar tus planes y cotizaciones.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/login" class="button">Iniciar Sesión</a>
              <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
              <p><strong>Equipo Jardines del Renacer</strong></p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Jardines del Renacer - Todos los derechos reservados</p>
              <p>Carrera 7 #32-16, Bogotá, Colombia | Tel: (601) 123-4567</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Hola ${nombre},\n\nTu cuenta ha sido creada exitosamente en Jardines del Renacer.\n\nGracias por confiar en nosotros.\n\nSaludos,\nEquipo Jardines del Renacer`
  }),

  notificacionAdmin: (clienteNombre: string, clienteEmail: string) => ({
    subject: 'Nuevo registro en el sistema',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #10b981; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info { background: white; padding: 15px; border-left: 4px solid #0049F3; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>Nuevo Usuario Registrado</h2>
            </div>
            <div class="content">
              <p>Se ha registrado un nuevo usuario en el sistema:</p>
              <div class="info">
                <p><strong>Nombre:</strong> ${clienteNombre}</p>
                <p><strong>Email:</strong> ${clienteEmail}</p>
                <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-CO')}</p>
              </div>
              <p>Revisa el panel de administración para más detalles.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Nuevo usuario registrado:\n\nNombre: ${clienteNombre}\nEmail: ${clienteEmail}\nFecha: ${new Date().toLocaleString('es-CO')}`
  }),

  confirmacionVenta: (cliente: string, plan: string, monto: number, factura: string) => ({
    subject: 'Confirmación de Compra - Jardines del Renacer',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .total { font-size: 24px; color: #0049F3; font-weight: bold; text-align: center; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✅ ¡Compra Confirmada!</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${cliente}</strong>,</p>
              <p>Tu compra ha sido procesada exitosamente.</p>
              <div class="info">
                <p><strong>Plan:</strong> ${plan}</p>
                <p><strong>Factura:</strong> ${factura}</p>
                <div class="total">Total: $${monto.toLocaleString('es-CO')}</div>
              </div>
              <p>Recibirás tu póliza y documentación en los próximos días.</p>
              <p>¡Gracias por confiar en Jardines del Renacer!</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Jardines del Renacer</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `¡Compra Confirmada!\n\nHola ${cliente},\n\nPlan: ${plan}\nFactura: ${factura}\nTotal: $${monto.toLocaleString('es-CO')}\n\nGracias por tu compra.\n\nJardines del Renacer`
  }),

  recuperarContrasena: (nombre: string, resetLink: string) => ({
    subject: 'Recuperación de Contraseña - Jardines del Renacer',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f59e0b; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { background: #0049F3; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <p>Hola <strong>${nombre}</strong>,</p>
              <p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
              <a href="${resetLink}" class="button">Restablecer Contraseña</a>
              <div class="warning">
                <p><strong>⚠️ Importante:</strong></p>
                <p>Este enlace expirará en 1 hora.</p>
                <p>Si no solicitaste este cambio, ignora este correo.</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Recuperación de Contraseña\n\nHola ${nombre},\n\nHaz clic en el siguiente enlace para restablecer tu contraseña:\n${resetLink}\n\nEste enlace expira en 1 hora.\n\nJardines del Renacer`
  })
};
