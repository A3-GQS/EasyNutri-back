const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/paymentController');
const signatureMiddleware = require('../middlewares/paymentSignature');

// Rota para webhook de pagamento
router.post('/webhook', signatureMiddleware, async (req, res) => {
  try {
    const result = await PaymentController.handlePaymentConfirmation(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao processar pagamento'
    });
  }
});

module.exports = router;