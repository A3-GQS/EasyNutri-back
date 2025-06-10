const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const config = require("../config/environment");

class PDFService {
  static async generateDietPDF(userData, dietPlan) {
    return new Promise((resolve, reject) => {
      try {
        // Cria diretório se não existir
        if (!fs.existsSync(config.pdfStoragePath)) {
          fs.mkdirSync(config.pdfStoragePath, { recursive: true });
        }

        const fileName = `dieta-${userData.userId}-${Date.now()}.pdf`;
        const filePath = path.join(config.pdfStoragePath, fileName);
        const doc = new PDFDocument();

        // Pipe para arquivo
        const stream = fs.createWriteStream(filePath);
        doc.pipe(stream);

        // Cabeçalho
        doc
          .fontSize(20)
          .text("EasyNutri - Plano Alimentar Personalizado", {
            align: "center",
          })
          .moveDown(1);

        // Informações do cliente
        doc
          .fontSize(14)
          .text(`Cliente: ${userData.name}`)
          .text(`Data: ${new Date().toLocaleDateString()}`)
          .text(`Objetivo: ${userData.goal}`)
          .text(`Tipo de Dieta: ${userData.dietType}`)
          .moveDown(1);

        // Plano alimentar
        doc.fontSize(16).text("Plano Alimentar Diário:", { underline: true });
        dietPlan.meals.forEach((meal) => {
          doc
            .fontSize(14)
            .text(`${meal.mealType}:`, { continued: true })
            .fontSize(12)
            .text(meal.foods.map((f) => f.name).join(", "))
            .moveDown(0.5);
        });

        // Dicas nutricionais
        doc
          .addPage()
          .fontSize(16)
          .text("Recomendações Nutricionais:", { underline: true })
          .fontSize(12)
          .text(dietPlan.nutritionalTips)
          .moveDown(2);

        // Rodapé
        doc.fontSize(10).text("EasyNutri - Todos os direitos reservados", {
          align: "center",
        });

        doc.end();

        stream.on("finish", () => resolve(filePath));
        stream.on("error", reject);
      } catch (error) {
        reject(error);
      }
    });
  }
  
}

module.exports = PDFService;
