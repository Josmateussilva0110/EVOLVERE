function formatMessageTeacherRejected(username) {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; 
                border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; 
                background-color: #ffffff;">
        <div style="text-align: center;">
            <h2 style="color: #e53935; font-size: 24px;">❌ Conta Não Aprovada</h2>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">
                <strong>Olá ${username}</strong>, analisamos sua solicitação de cadastro como <strong>Professor</strong> na plataforma <strong>Evolvere</strong>.
            </p>
            <p style="font-size: 16px; color: #333; margin-top: 15px;">
                Infelizmente, sua conta não foi <span style="color: #e53935; font-weight: bold;">aprovada</span> neste momento.
            </p>
            <p style="font-size: 16px; color: #333; margin-top: 15px;">
                Caso deseje, você pode revisar seus dados e tentar novamente.
            </p>
            <div style="margin: 30px 0;">
                <a href="http://localhost:5173/help" 
                   style="display: inline-block; background-color: #e53935; color: #fff; 
                          padding: 12px 25px; border-radius: 6px; text-decoration: none; 
                          font-weight: bold; font-size: 16px;">
                   Falar com Suporte
                </a>
            </div>
            <p style="font-size: 14px; color: #999; margin-top: 15px;">
                Se você acredita que houve um engano, entre em contato com nossa equipe de suporte.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #ccc;">
                &copy; 2025 Evolvere. Todos os direitos reservados.
            </p>
        </div>
    </div>
    `;
    return { html };
}

module.exports = formatMessageTeacherRejected
