function formatMessageSendPassword(code, username) {
    const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; 
                border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px; 
                background-color: #ffffff;">
        <div style="text-align: center;">
            <h2 style="color: #4CAF50;">🔐 Recuperação de Senha</h2>
            <p style="font-size: 16px; color: #333;">
                <strong>Olá ${username}</strong>, você solicitou a recuperação da sua senha na plataforma <strong>Evolvere</strong>.
            </p>
            <p style="font-size: 16px; color: #333;">
                Utilize o código abaixo para redefinir sua senha. Este código é válido por <strong>2 minutos</strong>.
            </p>
            <div style="margin: 30px 0;">
                <div style="
                    display: inline-block;
                    padding: 15px 30px;
                    font-size: 32px;
                    background-color: #f4f4f4;
                    color: #333;
                    border-radius: 8px;
                    border: 1px dashed #4CAF50;
                    font-weight: bold;
                    letter-spacing: 5px;
                ">
                    ${code}
                </div>
            </div>
            <p style="font-size: 14px; color: #999;">
                Caso você não tenha solicitado a recuperação, ignore este e-mail.
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

module.exports = formatMessageSendPassword
