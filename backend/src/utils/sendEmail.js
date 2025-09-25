const nodemailer = require("nodemailer")

require('dotenv').config({ path: '../../.env' })


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
