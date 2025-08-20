import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email } = req.body;

    // Validar dados de entrada
    if (!email) {
      return res.status(400).json({ error: 'Email é obrigatório' });
    }

    // Validar formato do email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    // Simular verificação se o email existe no banco de dados
    // Em um ambiente real, você verificaria no banco de dados
    const emailsValidos = [
      'admin@coinbitclub.com',
      'user@test.com',
      'demo@coinbitclub.com'
    ];

    const emailExiste = emailsValidos.some(e => 
      e.toLowerCase() === email.toLowerCase()
    );

    // Por segurança, sempre retorne sucesso mesmo se o email não existir
    // Isso evita que atacantes descobram quais emails estão cadastrados
    
    if (emailExiste) {
      // Aqui você geraria um token de recuperação e enviaria por email
      console.log(`[SIMULAÇÃO] Enviando email de recuperação para: ${email}`);
      
      // Exemplo de como seria a implementação real:
      // 1. Gerar token único com expiração
      // const resetToken = generateSecureToken();
      // const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutos
      
      // 2. Salvar no banco de dados
      // await savePasswordResetToken(email, resetToken, expiresAt);
      
      // 3. Enviar email via serviço (SendGrid, AWS SES, etc.)
      // await sendPasswordResetEmail(email, resetToken);
    }

    // Simular delay de processamento
    await new Promise(resolve => setTimeout(resolve, 1000));

    return res.status(200).json({ 
      success: true, 
      message: 'Se o email estiver cadastrado, você receberá as instruções de recuperação.' 
    });

  } catch (error) {
    console.error('Erro ao processar recuperação de senha:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
}
