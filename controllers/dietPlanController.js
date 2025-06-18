// @filename: controllers/dietPlanController.js
const AIService = require('../services/aiService');
const PDFService = require('../services/pdfService');
const WhatsAppService = require('../services/whatsAppService');
const logger = require('../config/logger');
const { v4: uuidv4 } = require('uuid');

class DietPlanController {
  /**
   * @desc    Generate diet plan using AI
   * @route   POST /api/diet-plans/generate
   */
  static async generateDietPlan(req, res) {
    try {
      const { userData } = req.body;

      if (!userData) {
        return res.status(400).json({ error: "User data is required" });
      }

      const dietPlan = await AIService.generateDietPlan(userData);
      res.status(200).json({ success: true, dietPlan });

    } catch (error) {
      logger.error('Generate diet plan error:', error);
      res.status(500).json({ error: "Failed to generate diet plan" });
    }
  }

  /**
   * @desc    Send existing diet plan via WhatsApp
   * @route   POST /api/diet-plans/send-whatsapp
   */
  static async sendDietPlanViaWhatsApp(req, res) {
    try {
      const { phoneNumber, userData, pdfPath } = req.body;

      if (!phoneNumber || !pdfPath) {
        return res.status(400).json({ error: "Phone number and PDF path are required" });
      }

      await WhatsAppService.sendDietPlan(phoneNumber, userData || {}, pdfPath);
      res.status(200).json({ success: true });

    } catch (error) {
      logger.error('Send WhatsApp error:', error);
      res.status(500).json({ error: "Failed to send via WhatsApp" });
    }
  }

  /**
   * @desc    Complete process: generate + send
   * @route   POST /api/diet-plans/full-process
   */
  static async fullProcess(req, res) {
    try {
      const { userData } = req.body;
      const correlationId = uuidv4();

      if (!userData?.phone) {
        return res.status(400).json({ error: "User phone number is required" });
      }

      // 1. Generate plan
      const dietPlan = await AIService.generateDietPlan(userData);

      // 2. Create PDF
      const pdfPath = await PDFService.generateDietPDF(
        dietPlan, 
        userData, 
        process.env.PDF_TEMP_DIR || '/tmp'
      );

      // 3. Send via WhatsApp
      await WhatsAppService.sendDietPlan(
        userData.phone,
        userData,
        pdfPath
      );

      res.status(200).json({ 
        success: true,
        correlationId,
        pdfPath: pdfPath // Consider returning a download URL in production
      });

    } catch (error) {
      logger.error('Full process error:', error);
      res.status(500).json({ 
        error: "Failed to complete diet plan process",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = DietPlanController;