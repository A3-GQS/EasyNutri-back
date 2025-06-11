const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const logger = require('../config/logger');
const CalculationService = require('./calculationService');

class PDFService {
  static async generateDietPDF(recommendation, userData, outputPath = '') {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const fileName = `diet_plan_${userData.name || 'user'}_${Date.now()}.pdf`;
        const fullPath = path.join(outputPath, fileName);
        const stream = fs.createWriteStream(fullPath);

        doc.pipe(stream);

        // Add header
        this._addHeader(doc, userData);

        // Add user information section
        this._addUserInfo(doc, userData);

        // Add nutritional summary
        this._addNutritionalSummary(doc, recommendation, userData);

        // Add meal plan
        this._addMealPlan(doc, recommendation);

        // Add tips and footer
        this._addTipsAndFooter(doc, recommendation);

        doc.end();

        stream.on('finish', () => resolve(fullPath));
        stream.on('error', reject);
      } catch (error) {
        logger.error('PDF generation error:', error);
        reject(error);
      }
    });
  }

  static _addHeader(doc, userData) {
    doc
      .fillColor('#333333')
      .fontSize(20)
      .text('Plano Nutricional Personalizado', { align: 'center' })
      .moveDown(0.5);

    doc
      .fontSize(14)
      .text(`Cliente: ${userData.name || ''}`, { align: 'center' })
      .text(`Data: ${new Date().toLocaleDateString()}`, { align: 'center' })
      .moveDown(1);

    // Add a decorative line
    doc
      .strokeColor('#009688')
      .lineWidth(2)
      .moveTo(50, doc.y)
      .lineTo(550, doc.y)
      .stroke();
  }

  static _addUserInfo(doc, userData) {
    doc
      .fillColor('#333333')
      .fontSize(14)
      .text('Informações do Usuário', { underline: true })
      .moveDown(0.3);

    const imc = CalculationService.calculateIMC(userData);
    const imcCategory = CalculationService.getIMCCategory(imc);

    doc
      .fontSize(12)
      .text(`Idade: ${userData.age} anos`)
      .text(`Altura: ${userData.height} cm`)
      .text(`Peso: ${userData.weight} kg`)
      .text(`IMC: ${imc} (${imcCategory})`)
      .text(`Objetivo: ${userData.goal || 'Não especificado'}`)
      .text(`Tipo de Dieta: ${userData.dietType || 'Padrão'}`)
      .moveDown(1);
  }

  static _addNutritionalSummary(doc, recommendation, userData) {
    doc
      .fillColor('#333333')
      .fontSize(14)
      .text('Resumo Nutricional', { underline: true })
      .moveDown(0.3);

    doc
      .fontSize(12)
      .text(`Calorias Diárias: ${recommendation.dailyCalories.toFixed(0)} kcal`)
      .text(`Ingestão de Água: ${recommendation.waterIntake} ml`)
      .moveDown(0.5);

    // Macronutrients table
    const macronutrients = recommendation.macronutrients || {};
    const startX = 50;
    const startY = doc.y;

    // Table header
    doc
      .font('Helvetica-Bold')
      .fillColor('#ffffff')
      .rect(startX, startY, 500, 20)
      .fill('#009688')
      .text('Macronutriente', startX + 10, startY + 5)
      .text('Gramas', startX + 200, startY + 5)
      .text('%', startX + 350, startY + 5)
      .font('Helvetica');

    // Table rows
    const rows = [
      { name: 'Proteínas', grams: macronutrients.protein?.grams || 0, percent: macronutrients.protein?.percentage || 0 },
      { name: 'Carboidratos', grams: macronutrients.carbs?.grams || 0, percent: macronutrients.carbs?.percentage || 0 },
      { name: 'Gorduras', grams: macronutrients.fats?.grams || 0, percent: macronutrients.fats?.percentage || 0 },
    ];

    let currentY = startY + 20;
    doc.fillColor('#333333');

    rows.forEach((row, i) => {
      const bgColor = i % 2 === 0 ? '#f5f5f5' : '#ffffff';
      doc
        .rect(startX, currentY, 500, 20)
        .fill(bgColor)
        .text(row.name, startX + 10, currentY + 5)
        .text(row.grams.toFixed(0), startX + 200, currentY + 5)
        .text(row.percent.toFixed(0), startX + 350, currentY + 5);
      currentY += 20;
    });

    doc.moveDown(2);
  }

  static _addMealPlan(doc, recommendation) {
    doc
      .fillColor('#333333')
      .fontSize(14)
      .text('Plano Alimentar Diário', { underline: true })
      .moveDown(0.5);

    recommendation.meals.forEach(meal => {
      doc
        .font('Helvetica-Bold')
        .text(meal.mealType)
        .font('Helvetica');

      meal.foods.forEach(food => {
        doc
          .text(`- ${food.name} (${food.quantity})`, { indent: 20 })
          .text(`  Calorias: ${food.calories || 'N/A'} kcal | Categoria: ${food.category || 'N/A'}`, { indent: 40 });
        
        if (food.notes) {
          doc
            .fontSize(10)
            .text(`  Observações: ${food.notes}`, { indent: 40, color: '#666666' })
            .fontSize(12);
        }
      });

      doc.moveDown(0.5);
    });
  }

  static _addTipsAndFooter(doc, recommendation) {
    doc
      .moveDown(1)
      .fillColor('#333333')
      .fontSize(14)
      .text('Dicas Nutricionais', { underline: true })
      .moveDown(0.3);

    doc
      .fontSize(12)
      .text(recommendation.nutritionalTips || 'Nenhuma dica específica fornecida.')
      .moveDown(1);

    // Footer
    doc
      .fontSize(10)
      .fillColor('#666666')
      .text('Este plano foi gerado automaticamente com base em suas informações. Consulte um nutricionista para orientações personalizadas.', { align: 'center' })
      .text('© ' + new Date().getFullYear() + ' NutriApp - Todos os direitos reservados', { align: 'center' });
  }
}

module.exports = PDFService;