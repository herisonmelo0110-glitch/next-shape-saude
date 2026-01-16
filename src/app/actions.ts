'use server';

import { UserProfile, WorkoutPlan, MealPlan, DayWorkout, Exercise, Meal } from '@/lib/types';

// Função para gerar treino personalizado com IA
export async function generateWorkoutPlan(profile: UserProfile): Promise<WorkoutPlan> {
  try {
    // Validar se a API key existe
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Configure sua chave da OpenAI nas variáveis de ambiente');
    }

    const prompt = `Você é um personal trainer profissional e especialista em biomecânica. Crie um plano de treino COMPLETO e SEGURO baseado nos seguintes dados:

DADOS DO USUÁRIO:
- Peso: ${profile.weight}kg
- Altura: ${profile.height}cm
- Idade: ${profile.age} anos
- Sexo: ${profile.sex}
- Peso desejado: ${profile.desiredWeight}kg
- Nível: ${profile.experienceLevel}
- Local: ${profile.trainingLocation}
- Foco: ${profile.focusArea}
- Dias por semana: ${profile.daysPerWeek}
- Condições de saúde: ${profile.healthConditions.join(', ') || 'Nenhuma'}
- Limitações físicas: ${profile.physicalLimitations.join(', ') || 'Nenhuma'}

INSTRUÇÕES CRÍTICAS:
1. SEGURANÇA PRIMEIRO: Adapte todos os exercícios às limitações físicas
2. Respeite biomecânica e sobrecarga progressiva
3. Inclua aquecimento específico e alongamento
4. Forneça instruções CLARAS e DIDÁTICAS
5. Sugira cargas apropriadas ao nível e equipamentos disponíveis
6. Inclua alertas de segurança e prevenção de lesões
7. Organize por dia da semana com dias de descanso estratégicos
8. Forneça sugestões de progressão semanal

FORMATO DE RESPOSTA (JSON):
{
  "weeklySchedule": [
    {
      "day": "Segunda-feira",
      "isRestDay": false,
      "warmup": [
        {
          "name": "Nome do exercício",
          "sets": 1,
          "reps": "5-10 minutos",
          "rest": "0",
          "instructions": "Instruções detalhadas",
          "safetyTips": "Dicas de segurança"
        }
      ],
      "mainWorkout": [
        {
          "name": "Nome do exercício",
          "sets": 3,
          "reps": "12-15",
          "rest": "60 segundos",
          "load": "Peso moderado ou peso corporal",
          "instructions": "Instruções passo a passo",
          "safetyTips": "Alertas importantes",
          "adaptations": "Adaptações para limitações"
        }
      ],
      "cooldown": [
        {
          "name": "Alongamento",
          "sets": 1,
          "reps": "30 segundos cada",
          "rest": "0",
          "instructions": "Como executar"
        }
      ],
      "notes": "Observações importantes do dia"
    }
  ],
  "progressionNotes": "Como progredir semanalmente",
  "safetyAlerts": ["Alerta 1", "Alerta 2"]
}

Gere um plano COMPLETO para ${profile.daysPerWeek} dias de treino.`;

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
            content: 'Você é um personal trainer profissional especializado em criar treinos seguros e eficazes. SEMPRE responda em JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
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

    const workoutData = JSON.parse(data.choices[0].message.content);

    return {
      id: `workout-${Date.now()}`,
      userId: 'user-1',
      createdAt: new Date(),
      weeklySchedule: workoutData.weeklySchedule,
      progressionNotes: workoutData.progressionNotes,
      safetyAlerts: workoutData.safetyAlerts
    };
  } catch (error) {
    console.error('Erro ao gerar treino:', error);
    throw error;
  }
}

// Função para gerar dieta personalizada com IA
export async function generateMealPlan(profile: UserProfile): Promise<MealPlan> {
  try {
    // Validar se a API key existe
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('Configure sua chave da OpenAI nas variáveis de ambiente');
    }

    const bmr = calculateBMR(profile);
    const tdee = calculateTDEE(bmr, profile.daysPerWeek);
    const targetCalories = adjustCaloriesForGoal(tdee, profile.goal);

    const prompt = `Você é um nutricionista profissional. Crie um plano alimentar COMPLETO e EQUILIBRADO baseado nos seguintes dados:

DADOS DO USUÁRIO:
- Peso atual: ${profile.weight}kg
- Peso desejado: ${profile.desiredWeight}kg
- Altura: ${profile.height}cm
- Idade: ${profile.age} anos
- Sexo: ${profile.sex}
- Objetivo: ${profile.goal}
- Calorias diárias: ${targetCalories} kcal
- Restrições: ${profile.dietaryRestrictions.join(', ') || 'Nenhuma'}
- Dias de treino: ${profile.daysPerWeek}

INSTRUÇÕES:
1. Crie refeições PRÁTICAS e REALISTAS
2. Respeite TODAS as restrições alimentares
3. Distribua macronutrientes de forma equilibrada
4. Forneça quantidades aproximadas
5. Inclua substituições inteligentes
6. Foque em alimentos acessíveis e sustentáveis

DISTRIBUIÇÃO DE MACROS:
${getMacroDistribution(profile.goal)}

FORMATO DE RESPOSTA (JSON):
{
  "dailyCalories": ${targetCalories},
  "macros": {
    "protein": 150,
    "carbs": 200,
    "fats": 60
  },
  "meals": {
    "breakfast": {
      "name": "Café da manhã",
      "foods": [
        {
          "name": "Alimento",
          "quantity": "quantidade",
          "calories": 100,
          "protein": 10,
          "carbs": 20,
          "fats": 5
        }
      ],
      "totalCalories": 400,
      "macros": { "protein": 20, "carbs": 50, "fats": 10 }
    },
    "morningSnack": { ... },
    "lunch": { ... },
    "afternoonSnack": { ... },
    "dinner": { ... }
  },
  "substitutions": ["Sugestão 1", "Sugestão 2"]
}`;

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
            content: 'Você é um nutricionista profissional especializado em criar dietas equilibradas e sustentáveis. SEMPRE responda em JSON válido.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7
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

    const mealData = JSON.parse(data.choices[0].message.content);

    return {
      id: `meal-${Date.now()}`,
      userId: 'user-1',
      createdAt: new Date(),
      ...mealData
    };
  } catch (error) {
    console.error('Erro ao gerar dieta:', error);
    throw error;
  }
}

// Calcular Taxa Metabólica Basal (BMR)
function calculateBMR(profile: UserProfile): number {
  // Fórmula de Mifflin-St Jeor
  const { weight, height, age, sex } = profile;
  
  if (sex === 'male') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Calcular Gasto Energético Diário Total (TDEE)
function calculateTDEE(bmr: number, daysPerWeek: number): number {
  // Fator de atividade baseado em dias de treino
  const activityFactors: { [key: number]: number } = {
    2: 1.375, // Levemente ativo
    3: 1.465, // Moderadamente ativo
    4: 1.55,  // Muito ativo
    5: 1.635, // Extremamente ativo
    6: 1.725  // Atleta
  };
  
  const factor = activityFactors[daysPerWeek] || 1.55;
  return Math.round(bmr * factor);
}

// Ajustar calorias baseado no objetivo
function adjustCaloriesForGoal(tdee: number, goal: string): number {
  switch (goal) {
    case 'weight-loss':
      return Math.round(tdee - 500); // Déficit de 500 kcal
    case 'muscle-gain':
      return Math.round(tdee + 300); // Superávit de 300 kcal
    case 'maintenance':
    default:
      return tdee;
  }
}

// Distribuição de macronutrientes por objetivo
function getMacroDistribution(goal: string): string {
  switch (goal) {
    case 'weight-loss':
      return 'Proteína: 35% | Carboidratos: 35% | Gorduras: 30%';
    case 'muscle-gain':
      return 'Proteína: 30% | Carboidratos: 45% | Gorduras: 25%';
    case 'maintenance':
    default:
      return 'Proteína: 30% | Carboidratos: 40% | Gorduras: 30%';
  }
}
