'use server';

import { ScannedFood } from '@/lib/types';

export async function scanFood(imageBase64: string): Promise<ScannedFood> {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `Você é um nutricionista especializado em análise nutricional de alimentos. 
            Analise a imagem e identifique o alimento, estimando valores nutricionais precisos.
            SEMPRE responda em JSON válido com a estrutura exata solicitada.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analise esta imagem de alimento e forneça informações nutricionais detalhadas.

FORMATO DE RESPOSTA (JSON):
{
  "name": "Nome do alimento identificado",
  "portion": 100,
  "calories": 250,
  "protein": 15,
  "carbs": 30,
  "fats": 8,
  "fiber": 5,
  "sugar": 10,
  "sodium": 400,
  "calorieLevel": "medium",
  "nutritionalQuality": "good",
  "recommendation": "maintenance"
}

REGRAS:
- portion: estimativa em gramas da porção visível
- calorieLevel: "low" (<200 kcal), "medium" (200-400), "high" (>400)
- nutritionalQuality: "excellent", "good", "moderate", "poor"
- recommendation: "weight-loss", "maintenance", "muscle-gain", "all"
- Seja preciso e realista nas estimativas`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error('Erro ao analisar alimento');
    }

    const data = await response.json();
    const foodData = JSON.parse(data.choices[0].message.content);

    return foodData as ScannedFood;
  } catch (error) {
    console.error('Erro ao escanear alimento:', error);
    throw new Error('Não foi possível analisar o alimento. Tente novamente.');
  }
}
