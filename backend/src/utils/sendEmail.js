const nodemailer = require("nodemailer")

require('dotenv').config({ path: '../../.env' })


/**
 * Envia um e-mail usando o serviço SMTP do Gmail.
 * 
 * Configura um transporte seguro com autenticação usando as variáveis de ambiente:
 * - EMAIL: endereço de e-mail remetente
 * - EMAIL_PASS: senha ou app password do e-mail
 * 
 * @async
 * @function sendEmail
 * @param {string} to - Destinatário do e-mail.
 * @param {string} subject - Assunto do e-mail.
 * @param {string} htmlContent - Conteúdo HTML do e-mail.
 * @returns {Promise<void>} Retorna uma Promise que resolve quando o e-mail é enviado com sucesso. 
 *                          Caso haja erro, ele será logado no console.
 * 
 * @example
 * const sendEmail = require('./sendEmail');
 * 
 * sendEmail('usuario@exemplo.com', 'Teste de Email', '<h1>Olá!</h1>')
 *   .then(() => console.log('E-mail enviado com sucesso'))
 *   .catch(err => console.error('Falha ao enviar e-mail', err));
 */
const sendEmail = async (to, subject, htmlContent) => {
  const transport = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    }
  })

  try {
    await transport.sendMail({
      from: `Evolvere <${process.env.EMAIL}>`,
      to,
      subject,
      html: htmlContent
    })

  } catch (err) {
    console.error('Erro ao enviar: ', err)
  }
}

module.exports = sendEmail
