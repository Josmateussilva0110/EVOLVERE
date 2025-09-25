function formatMessageTeacherApproved(username) {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; 
                border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; 
                background-color: #ffffff;">
        <div style="text-align: center;">
            <h2 style="color: #060060; font-size: 24px;">🎉 Conta Aprovada</h2>
            <p style="font-size: 16px; color: #333; margin-top: 20px;">
                <strong>Olá ${username}</strong>, temos uma ótima notícia!
            </p>
            <p style="font-size: 16px; color: #333;">
                Sua conta como <strong>Professor</strong> na plataforma <strong>Evolvere</strong> foi 
                <span style="color: #060060; font-weight: bold;">aprovada</span>.
            </p>
            <p style="font-size: 16px; color: #333; margin-top: 15px;">
                Agora você já pode acessar sua conta, criar turmas, gerenciar alunos e utilizar todos os recursos disponíveis.
            </p>
            <div style="margin: 30px 0;">
                <a href="http://localhost:5173/login" 
                   style="display: inline-block; background-color: #060060; color: #fff; 
                          padding: 12px 25px; border-radius: 6px; text-decoration: none; 
                          font-weight: bold; font-size: 16px;">
                   Acessar Plataforma
                </a>
            </div>
            <p style="font-size: 14px; color: #999; margin-top: 15px;">
                Se você não solicitou esta conta, ignore este e-mail.
            </p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="font-size: 12px; color: #ccc;">
                &copy; 2025 Evolvere. Todos os direitos reservados.
            </p>
        </div>
    </div>
    `;
    return { html }
}

module.exports = formatMessageTeacherApproved
