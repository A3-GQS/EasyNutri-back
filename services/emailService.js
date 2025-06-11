const nodemailer = require('nodemailer');
const config = require('../config/environment');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: config.email.service,
      auth: {
        user: config.email.user,
        pass: config.email.pass
      }
    });
  }

  async sendDietPDF(email, pdfPath, userName) {
    try {
      const mailOptions = {
        from: config.email.from,
        to: email,
        subject: 'Seu Plano Alimentar Personalizado - EasyNutri',
        text: `Olá ${userName},\n\nSegue em anexo seu plano alimentar personalizado.\n\nAtenciosamente,\nEquipe EasyNutri`,
        attachments: [{
          filename: 'plano-alimentar-easynutri.pdf',
          path: pdfPath
        }]
      };

      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();