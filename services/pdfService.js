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
    // Cabeçalho com fundo branco e texto preto
    doc
      .fill('#ffffff')
      .rect(0, 0, 612, 80)
      .fill();
    
    // Título principal
    doc
      .fillColor('#009688') // Verde água para o título
      .fontSize(22)
      .font('Helvetica-Bold')
      .text('PLANO NUTRICIONAL PERSONALIZADO', { 
        align: 'center',
        lineGap: 5,
        paragraphGap: 0,
        y: 30
      });
    
    // Subtítulo
    doc
      .fontSize(14)
      .font('Helvetica')
      .fillColor('#333333') // Cinza escuro
      .text(`Preparado para ${userData.name || ''}`, { 
        align: 'center',
        y: 60
      });

    // Linha decorativa
    doc
      .strokeColor('#009688')
      .lineWidth(1)
      .moveTo(50, 90)
      .lineTo(562, 90)
      .stroke()
      .moveDown(2);
  }

  static _addUserInfo(doc, userData) {
    // Título da seção
    doc
      .fillColor('#009688')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('● Informações do Usuário', { underline: false })
      .moveDown(0.5);

    const imc = CalculationService.calculateIMC(userData);
    const imcCategory = CalculationService.getIMCCategory(imc);
    
    // Formatação segura do IMC
    const imcNumber = typeof imc === 'number' ? imc : parseFloat(imc) || 0;
    const formattedIMC = !isNaN(imcNumber) ? imcNumber.toFixed(1) : 'N/A';

    // Lista de informações
    doc
      .fillColor('#444444')
      .fontSize(12)
      .font('Helvetica')
      .text(`• Idade: ${userData.age || 'N/A'} anos`, { indent: 10 })
      .text(`• Altura: ${userData.height || 'N/A'} cm`, { indent: 10 })
      .text(`• Peso: ${userData.weight || 'N/A'} kg`, { indent: 10 })
      .text(`• IMC: ${formattedIMC} (${imcCategory || 'N/A'})`, { indent: 10 })
      .text(`• Objetivo: ${userData.goal || 'Não especificado'}`, { indent: 10 })
      .text(`• Tipo de Dieta: ${userData.dietType || 'Padrão'}`, { indent: 10 })
      .moveDown(1);

    // Linha divisória
    doc
      .strokeColor('#eeeeee')
      .lineWidth(1)
      .moveTo(50, doc.y)
      .lineTo(562, doc.y)
      .stroke()
      .moveDown(1);
  }

  static _addNutritionalSummary(doc, recommendation, userData) {
    // Título da seção
    doc
      .fillColor('#009688')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('● Resumo Nutricional', { underline: false })
      .moveDown(0.5);

    // Dados nutricionais
    doc
      .fillColor('#444444')
      .fontSize(12)
      .text(`• Calorias Diárias: ${recommendation.dailyCalories?.toFixed(0) || 'N/A'} kcal`, { indent: 10 })
      .text(`• Ingestão de Água: ${recommendation.waterIntake || 'N/A'} ml`, { indent: 10 })
      .moveDown(1);

    // Tabela de macronutrientes
    const macronutrients = recommendation.macronutrients || {};
    const startX = 50;
    const startY = doc.y;

    // Cabeçalho da tabela
    doc
      .fill('#009688')
      .rect(startX, startY, 500, 25)
      .fill()
      .font('Helvetica-Bold')
      .fillColor('#ffffff')
      .text('MACRONUTRIENTE', startX + 15, startY + 7)
      .text('GRAMAS', startX + 200, startY + 7)
      .text('% DIÁRIA', startX + 350, startY + 7);

    // Linhas da tabela
    const rows = [
      { name: 'Proteínas', grams: macronutrients.protein?.grams || 0, percent: macronutrients.protein?.percentage || 0 },
      { name: 'Carboidratos', grams: macronutrients.carbs?.grams || 0, percent: macronutrients.carbs?.percentage || 0 },
      { name: 'Gorduras', grams: macronutrients.fats?.grams || 0, percent: macronutrients.fats?.percentage || 0 },
    ];

    let currentY = startY + 25;
    doc.font('Helvetica');

    rows.forEach((row, i) => {
      const bgColor = i % 2 === 0 ? '#f8f8f8' : '#ffffff';
      doc
        .fill(bgColor)
        .rect(startX, currentY, 500, 25)
        .fill()
        .fillColor('#333333')
        .text(row.name, startX + 15, currentY + 7)
        .text(row.grams.toFixed(0), startX + 200, currentY + 7)
        .text(row.percent.toFixed(0) + '%', startX + 350, currentY + 7);
      
      currentY += 25;
    });

    doc.moveDown(2);
  }

  static _addMealPlan(doc, recommendation) {
    doc
      .fillColor('#009688')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('● Plano Alimentar Diário', { underline: false })
      .moveDown(0.5);

    recommendation.meals?.forEach(meal => {
      // Card para cada refeição
      doc
        .fill('#f0f9f8')
        .rect(50, doc.y, 512, 30)
        .fill()
        .fillColor('#009688')
        .font('Helvetica-Bold')
        .text(meal.mealType?.toUpperCase() || 'REFEIÇÃO', 60, doc.y + 8)
        .moveDown(1.5);

      meal.foods?.forEach(food => {
        doc
          .fillColor('#333333')
          .font('Helvetica')
          .text(`- ${food.name || 'Alimento'} (${food.quantity || 'N/A'})`, { indent: 20 })
          .text(`  Calorias: ${food.calories || 'N/A'} kcal | Categoria: ${food.category || 'N/A'}`, { 
            indent: 40,
            color: '#555555',
            fontSize: 11
          });
        
        if (food.notes) {
          doc
            .fontSize(10)
            .text(`  Observações: ${food.notes}`, { 
              indent: 40, 
              color: '#666666' 
            })
            .fontSize(12);
        }
        doc.moveDown(0.3);
      });
      doc.moveDown(0.5);
    });
  }

  static _addTipsAndFooter(doc, recommendation) {
    doc
      .moveDown(1)
      .fillColor('#009688')
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('● Dicas Nutricionais', { underline: false })
      .moveDown(0.5);

    // Card de dicas
    doc
      .fill('#f0f9f8')
      .rect(50, doc.y, 512, 60)
      .fill()
      .fillColor('#333333')
      .fontSize(12)
      .font('Helvetica')
      .text(recommendation.nutritionalTips || 'Nenhuma dica específica fornecida.', {
        x: 60,
        y: doc.y + 10,
        width: 492,
        align: 'left'
      })
      .moveDown(3);

    // Rodapé
    doc
      .fillColor('#009688')
      .fontSize(10)
      .text('Este plano foi gerado automaticamente com base em suas informações. Consulte um nutricionista para orientações personalizadas.', { 
        align: 'center',
        lineGap: 5
      })
      .fillColor('#888888')
      .text('© ' + new Date().getFullYear() + ' NutriApp - Todos os direitos reservados', { 
        align: 'center' 
      });
  }
}

module.exports = PDFService;