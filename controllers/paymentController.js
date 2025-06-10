const PDFService = require('../services/pdfService');
const EmailService = require('../services/emailService');
const RecommendationService = require('../services/recommendationService');
const logger = require('../config/logger');

class PaymentController {
  async handlePaymentConfirmation(paymentData) {
    try {
      // 1. Verificar dados do pagamento
      if (!this._validatePayment(paymentData)) {
        throw new Error('Dados de pagamento inválidos');
      }

      // 2. Gerar recomendação com IA
      const recommendation = await RecommendationService.generateRecommendation(
        paymentData.userId,
        paymentData.userData
      );

      // 3. Gerar PDF
      const pdfPath = await PDFService.generateDietPDF(
        paymentData.userData,
        recommendation
      );

      // 4. Enviar por email
      await EmailService.sendDietPDF(
        paymentData.userData.email,
        pdfPath,
        paymentData.userData.name
      );

      // 5. Atualizar status no banco de dados
      await this._updateUserAccess(paymentData.userId);

      logger.info(`PDF enviado com sucesso para ${paymentData.userData.email}`);
      return { success: true };

    } catch (error) {
      logger.error('Erro no processamento de pagamento:', error);
      throw error;
    }
  }

  _validatePayment(paymentData) {
    return (
      paymentData &&
      paymentData.userId &&
      paymentData.userData &&
      paymentData.status === 'approved'
    );
  }

  async _updateUserAccess(userId) {
    // Implemente a lógica para atualizar o status do usuário no banco
    // Exemplo: UserModel.updateAccess(userId, { hasPaid: true, accessExpires: ... })
  }
}

module.exports = new PaymentController();