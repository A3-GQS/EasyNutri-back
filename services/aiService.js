const { OpenAI } = require('openai');
const config = require('../config/environment');
const logger = require('../config/logger');
const { MEAL_TYPES, FOOD_CATEGORIES } = require('../utils/constants');

class AIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: config.openai.apiKey,
      timeout: config.openai.timeout
    });
  }

  async generateDietPlan(userData) {
    const prompt = this._buildPrompt(userData);
    
    try {
      const response = await this.openai.chat.completions.create({
        model: config.openai.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: config.openai.temperature,
        max_tokens: config.openai.maxTokens,
        response_format: { type: "json_object" }
      });

      return this._parseResponse(response.choices[0].message.content);
    } catch (error) {
      logger.error('OpenAI API Error:', error);
      throw this._handleError(error);
    }
  }

_buildPrompt(userData) {
  // Converter campos string em arrays quando necessário
  const allergiesArray = userData.allergies
    ? typeof userData.allergies === 'string'
      ? userData.allergies.split(',')
      : userData.allergies
    : [];

  const foodPreferencesArray = userData.foodPreferences
    ? typeof userData.foodPreferences === 'string'
      ? userData.foodPreferences.split(',')
      : userData.foodPreferences
    : [];

  return `Você é um nutricionista especializado. Gere um plano alimentar detalhado em JSON com:
  
  - Dieta: ${userData.dietType}
  - Objetivo: ${userData.goal}
  - Dados: ${userData.age} anos, ${userData.height}cm, ${userData.weight}kg
  - Alergias: ${allergiesArray.join(', ') || 'Nenhuma'}
  - Preferências: ${JSON.stringify(foodPreferencesArray)}
    
    Retorne um JSON estruturado com:
    {
      "dietPlan": {
        "description": "string",
        "dailyCalories": number,
        "macronutrients": {
          "protein": { "grams": number, "percentage": number },
          "carbs": { "grams": number, "percentage": number },
          "fats": { "grams": number, "percentage": number }
        },
        "meals": [
          {
            "type": "${MEAL_TYPES.join('|')}",
            "foods": [
              {
                "name": "string",
                "category": "${FOOD_CATEGORIES.join('|')}",
                "quantity": "string",
                "calories": number,
                "notes": "string"
              }
            ]
          }
        ],
        "hydration": {
          "waterIntake": number,
          "recommendations": "string"
        },
        "nutritionalTips": "string"
      }
    }`;
  }

  _parseResponse(content) {
    try {
      const result = JSON.parse(content);
      
      // Validação básica da estrutura
      if (!result.dietPlan || !result.dietPlan.meals) {
        throw new Error('Resposta da IA em formato inválido');
      }
      
      return result.dietPlan;
    } catch (error) {
      logger.error('Error parsing AI response:', error);
      throw new Error('Falha ao processar resposta da IA');
    }
  }

  _handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: 'Erro na API OpenAI',
        details: error.response.data
      };
    }
    return {
      status: 500,
      message: 'Erro ao se comunicar com o serviço de IA',
      details: error.message
    };
  }
}

module.exports = new AIService();