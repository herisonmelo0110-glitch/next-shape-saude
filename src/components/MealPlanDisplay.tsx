'use client';

import { MealPlan } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Apple, Coffee, Sun, Sandwich, Moon, Lightbulb } from 'lucide-react';

interface MealPlanDisplayProps {
  mealPlan: MealPlan;
}

export default function MealPlanDisplay({ mealPlan }: MealPlanDisplayProps) {
  const mealIcons = {
    breakfast: Coffee,
    morningSnack: Sun,
    lunch: Sandwich,
    afternoonSnack: Apple,
    dinner: Moon
  };

  const mealNames = {
    breakfast: 'Café da Manhã',
    morningSnack: 'Lanche da Manhã',
    lunch: 'Almoço',
    afternoonSnack: 'Lanche da Tarde',
    dinner: 'Jantar'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4">
            <Apple className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Sua Dieta Personalizada
          </h1>
          <p className="text-lg text-gray-600">
            Criada especialmente para você pela IA
          </p>
        </div>

        {/* Daily Summary */}
        <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-1">Calorias Diárias</p>
              <p className="text-3xl font-bold">{mealPlan.dailyCalories}</p>
              <p className="text-xs opacity-75">kcal</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90 mb-1">Proteínas</p>
              <p className="text-3xl font-bold">{mealPlan.macros.protein}</p>
              <p className="text-xs opacity-75">g</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90 mb-1">Carboidratos</p>
              <p className="text-3xl font-bold">{mealPlan.macros.carbs}</p>
              <p className="text-xs opacity-75">g</p>
            </div>
            <div className="text-center">
              <p className="text-sm opacity-90 mb-1">Gorduras</p>
              <p className="text-3xl font-bold">{mealPlan.macros.fats}</p>
              <p className="text-xs opacity-75">g</p>
            </div>
          </div>
        </Card>

        {/* Meals */}
        <div className="space-y-6">
          {Object.entries(mealPlan.meals).map(([key, meal]) => {
            const Icon = mealIcons[key as keyof typeof mealIcons];
            const mealName = mealNames[key as keyof typeof mealNames];

            return (
              <Card key={key} className="overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
                  <div className="flex items-center gap-3">
                    <Icon className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">{mealName}</h2>
                  </div>
                  <div className="flex gap-4 mt-3 text-white text-sm">
                    <span>{meal.totalCalories} kcal</span>
                    <span>•</span>
                    <span>P: {meal.macros.protein}g</span>
                    <span>•</span>
                    <span>C: {meal.macros.carbs}g</span>
                    <span>•</span>
                    <span>G: {meal.macros.fats}g</span>
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {meal.foods.map((food, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-semibold text-gray-900">{food.name}</h4>
                          <p className="text-sm text-gray-600">{food.quantity}</p>
                        </div>
                        <Badge variant="outline">{food.calories} kcal</Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>Proteína: {food.protein}g</span>
                        <span>Carbo: {food.carbs}g</span>
                        <span>Gordura: {food.fats}g</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Substitutions */}
        {mealPlan.substitutions && mealPlan.substitutions.length > 0 && (
          <Card className="bg-blue-50 border-blue-200 p-6 mt-8">
            <div className="flex items-start gap-4">
              <Lightbulb className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-3">Substituições Inteligentes</h3>
                <ul className="space-y-2">
                  {mealPlan.substitutions.map((sub, index) => (
                    <li key={index} className="text-blue-800 text-sm">
                      • {sub}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
