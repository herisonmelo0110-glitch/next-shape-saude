'use server';

import { ScannedFood } from '@/lib/types';

// Função para analisar alimento usando IA de visão
export async function analyzeFoodImage(imageBase64: string): Promise<ScannedFood> {
  try {
    // Validar se a API key existe
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Configure sua chave da OpenAI nas variáveis de ambiente');
    }

    const prompt = `Você é um nutricionista especializado em análise nutricional. Analise esta imagem de alimento e forneça informações nutricionais PRECISAS e COMPLETAS.

INSTRUÇÕES CRÍTICAS:
1. Identifique o alimento com precisão
2. Estime a porção em gramas (seja realista)
3. Calcule valores nutricionais baseados na porção
4. Classifique o nível calórico (low: <200kcal, medium: 200-400kcal, high: >400kcal)
5. Avalie qualidade nutricional (excellent/good/moderate/poor)
6. Indique para qual objetivo é mais adequado

FORMATO DE RESPOSTA (JSON):
{
  "name": "Nome do alimento identificado",
  "portion": 150,
  "calories": 250,
  "protein": 12,
  "carbs": 35,
  "fats": 8,
  "fiber": 5,
  "sugar": 10,
  "sodium": 300,
  "calorieLevel": "medium",
  "nutritionalQuality": "good",
  "recommendation": "weight-loss"
}

IMPORTANTE:
- Se não conseguir identificar com certeza, seja honesto
- Valores devem ser realistas e baseados em tabelas nutricionais
- Considere preparação e ingredientes visíveis`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'Você é um nutricionista especializado em análise nutricional de alimentos. SEMPRE responda em JSON válido com informações precisas.'
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64
                }
              }
            ]
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.3,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorMessage = errorData?.error?.message || `Erro HTTP ${response.status}`;
      
      // Tratamento específico para erro de quota
      if (errorMessage.includes('quota') || errorMessage.includes('billing')) {
        throw new Error('Sua conta OpenAI excedeu a cota disponível. Verifique seu plano e detalhes de cobrança em https://platform.openai.com/account/billing');
      }
      
      console.error('Erro da API OpenAI:', errorMessage, errorData);
      throw new Error(`Erro ao conectar com a API: ${errorMessage}`);
    }

    const data = await response.json();
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Resposta inválida da API');
    }

    const foodData = JSON.parse(data.choices[0].message.content);

    return foodData;
  } catch (error) {
    console.error('Erro ao analisar alimento:', error);
    throw error;
  }
}
