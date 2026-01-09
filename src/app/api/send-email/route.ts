import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Email de prueba permitido (tu email verificado en Resend)
const ALLOWED_TEST_EMAIL = 'juanmonza@icloud.com';

export async function POST(request: Request) {
  try {
    const { to, subject, html, text } = await request.json();

    if (!to || !subject || (!html && !text)) {
      return Response.json(
        { error: 'Faltan parámetros requeridos' },
        { status: 400 }
      );
    }

    // SIEMPRE enviar al email permitido excepto en producción explícita
    // Por seguridad, por defecto usamos el email de prueba
    const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL_ENV === 'production';
    const emailTo = isProduction ? to : ALLOWED_TEST_EMAIL;
    
    console.log('📧 ===============================');
    console.log('📧 NODE_ENV:', process.env.NODE_ENV);
    console.log('📧 VERCEL_ENV:', process.env.VERCEL_ENV);
    console.log('📧 Modo:', isProduction ? 'PRODUCCIÓN' : 'DESARROLLO');
    console.log('📧 Email original:', to);
    console.log('📧 Email destino:', emailTo);
    console.log('📧 ===============================');

    const { data, error } = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_EMAIL_FROM || 'onboarding@resend.dev',
      to: [emailTo],
      subject: isProduction ? subject : `[DEMO] ${subject}`,
      html: isProduction ? html : `
        <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px;">
          <p style="margin: 0; color: #92400e;">
            <strong>⚠️ MODO DEMO:</strong> Este email debería enviarse a: <strong>${to}</strong>
          </p>
        </div>
        ${html || text}
      ` : html,
      text: isProduction ? text : `[MODO DEMO] Email para: ${to}\n\n${text}`,
    });

    if (error) {
      console.error('Error enviando email:', error);
      return Response.json({ error: error.message }, { status: 500 });
    }

    console.log('✅ Email enviado exitosamente');
    return Response.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Error en API de email:', error);
    return Response.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
