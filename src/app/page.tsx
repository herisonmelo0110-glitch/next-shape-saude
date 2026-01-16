'use client';

import { useState } from 'react';
import { UserProfile, WorkoutPlan, MealPlan, ScannedFood } from '@/lib/types';
import { generateWorkoutPlan, generateMealPlan } from './actions';
import Quiz from '@/components/Quiz';
import WorkoutDisplay from '@/components/WorkoutDisplay';
import MealPlanDisplay from '@/components/MealPlanDisplay';
import FoodScanner from '@/components/FoodScanner';
import { Button } from '@/components/ui/button';
import { Dumbbell, Apple, Activity, Camera, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';

export default function Home() {
  const [stage, setStage] = useState<'welcome' | 'quiz' | 'loading' | 'results'>('welcome');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [workoutPlan, setWorkoutPlan] = useState<WorkoutPlan | null>(null);
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null);
  const [activeTab, setActiveTab] = useState<'workout' | 'meal' | 'scanner'>('workout');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const [scannedFoods, setScannedFoods] = useState<ScannedFood[]>([]);
  const [dailyCaloriesConsumed, setDailyCaloriesConsumed] = useState(0);

  const handleQuizComplete = async (profile: UserProfile) => {
    setUserProfile(profile);
    setStage('loading');
    setErrorMessage(null);

    try {
      // Gerar treino e dieta em paralelo
      const [workout, meal] = await Promise.all([
        generateWorkoutPlan(profile),
        generateMealPlan(profile)
      ]);

      setWorkoutPlan(workout);
      setMealPlan(meal);
      setStage('results');
    } catch (error) {
      console.error('Erro ao gerar planos:', error);
      
      // Capturar mensagem de erro específica
      const message = error instanceof Error ? error.message : 'Erro desconhecido ao gerar planos';
      setErrorMessage(message);
      setStage('quiz');
    }
  };

  const handleFoodScanned = (food: ScannedFood) => {
    setScannedFoods(prev => [...prev, food]);
    setDailyCaloriesConsumed(prev => prev + food.calories);
  };

  const removeScannedFood = (index: number) => {
    const food = scannedFoods[index];
    setScannedFoods(prev => prev.filter((_, i) => i !== index));
    setDailyCaloriesConsumed(prev => prev - food.calories);
  };

  if (stage === 'welcome') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center">
          {/* Logo */}
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-8 shadow-2xl">
            <Sparkles className="w-12 h-12 text-indigo-600" />
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
            NEXT SHAPE
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 mb-12 font-light">
            A inteligência que molda o seu corpo
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Treinos Personalizados</h3>
              <p className="text-white/80 text-sm">
                IA cria treinos adaptados ao seu corpo e objetivos
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Apple className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Dieta Inteligente</h3>
              <p className="text-white/80 text-sm">
                Plano alimentar balanceado e sustentável
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Scanner de Alimentos</h3>
              <p className="text-white/80 text-sm">
                Escaneie alimentos e veja informações nutricionais
              </p>
            </div>
          </div>

          {/* CTA */}
          <Button
            onClick={() => setStage('quiz')}
            size="lg"
            className="h-16 px-12 text-xl bg-white text-indigo-600 hover:bg-gray-100 shadow-2xl"
          >
            Começar Agora
            <ArrowRight className="w-6 h-6 ml-2" />
          </Button>

          <p className="text-white/70 text-sm mt-8">
            ⚠️ Este app não substitui acompanhamento profissional
          </p>
        </div>
      </div>
    );
  }

  if (stage === 'quiz') {
    return (
      <>
        {errorMessage && (
          <div className="fixed top-0 left-0 right-0 z-50 bg-red-500 text-white px-4 py-3 shadow-lg">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">
                  {errorMessage}
                </p>
              </div>
              <Button
                onClick={() => setErrorMessage(null)}
                size="sm"
                variant="ghost"
                className="text-white hover:bg-red-600 flex-shrink-0"
              >
                Fechar
              </Button>
            </div>
          </div>
        )}
        <Quiz onComplete={handleQuizComplete} />
      </>
    );
  }

  if (stage === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-3xl mb-8 shadow-2xl animate-pulse">
            <Sparkles className="w-12 h-12 text-indigo-600" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Criando seu plano personalizado...
          </h2>
          <p className="text-xl text-white/80">
            Nossa IA está analisando seus dados
          </p>
          <div className="mt-8 flex justify-center gap-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'results' && workoutPlan && mealPlan) {
    return (
      <>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          {/* Navigation Tabs */}
          <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex gap-2 py-4">
                <button
                  onClick={() => setActiveTab('workout')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    activeTab === 'workout'
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Dumbbell className="w-5 h-5 inline mr-2" />
                  Treino
                </button>
                <button
                  onClick={() => setActiveTab('meal')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    activeTab === 'meal'
                      ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Apple className="w-5 h-5 inline mr-2" />
                  Dieta
                </button>
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all ${
                    activeTab === 'scanner'
                      ? 'bg-gradient-to-r from-orange-600 to-pink-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Camera className="w-5 h-5 inline mr-2" />
                  Scanner
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {activeTab === 'workout' && <WorkoutDisplay workout={workoutPlan} />}
          {activeTab === 'meal' && <MealPlanDisplay mealPlan={mealPlan} />}
          {activeTab === 'scanner' && (
            <div className="max-w-6xl mx-auto p-6">
              {/* Header do Scanner */}
              <div className="bg-gradient-to-r from-orange-600 to-pink-600 rounded-2xl p-8 mb-6 text-white">
                <h2 className="text-3xl font-bold mb-2">Scanner de Alimentos</h2>
                <p className="text-white/90 mb-6">
                  Use a câmera para escanear alimentos e obter informações nutricionais instantâneas
                </p>
                <Button
                  onClick={() => setShowScanner(true)}
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-gray-100"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Escanear Alimento
                </Button>
              </div>

              {/* Resumo Diário */}
              {mealPlan && (
                <div className="bg-white rounded-2xl p-6 mb-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo Diário</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                      <p className="text-gray-600 text-sm mb-1">Meta Diária</p>
                      <p className="text-3xl font-bold text-indigo-600">{mealPlan.dailyCalories}</p>
                      <p className="text-gray-500 text-xs">kcal</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 rounded-xl p-4">
                      <p className="text-gray-600 text-sm mb-1">Consumido</p>
                      <p className="text-3xl font-bold text-orange-600">{dailyCaloriesConsumed}</p>
                      <p className="text-gray-500 text-xs">kcal</p>
                    </div>
                  </div>
                  
                  {/* Barra de progresso */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progresso</span>
                      <span>{Math.round((dailyCaloriesConsumed / mealPlan.dailyCalories) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-orange-600 to-pink-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((dailyCaloriesConsumed / mealPlan.dailyCalories) * 100, 100)}%` }}
                      />
                    </div>
                    {dailyCaloriesConsumed > mealPlan.dailyCalories && (
                      <p className="text-red-600 text-sm mt-2 font-semibold">
                        ⚠️ Você excedeu sua meta diária em {dailyCaloriesConsumed - mealPlan.dailyCalories} kcal
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Lista de Alimentos Escaneados */}
              {scannedFoods.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800">Alimentos Escaneados Hoje</h3>
                  {scannedFoods.map((food, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-md border border-gray-200">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-lg font-bold text-gray-800">{food.name}</h4>
                          <p className="text-gray-500 text-sm">{food.portion}g</p>
                        </div>
                        <button
                          onClick={() => removeScannedFood(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Remover
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-3">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center">
                          <p className="text-gray-600 text-xs mb-1">Calorias</p>
                          <p className="text-indigo-600 text-lg font-bold">{food.calories}</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 text-center">
                          <p className="text-gray-600 text-xs mb-1">Proteínas</p>
                          <p className="text-blue-600 text-lg font-bold">{food.protein}g</p>
                        </div>
                        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-3 text-center">
                          <p className="text-gray-600 text-xs mb-1">Carbos</p>
                          <p className="text-yellow-600 text-lg font-bold">{food.carbs}g</p>
                        </div>
                        <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg p-3 text-center">
                          <p className="text-gray-600 text-xs mb-1">Gorduras</p>
                          <p className="text-pink-600 text-lg font-bold">{food.fats}g</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                  <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum alimento escaneado</h3>
                  <p className="text-gray-500">
                    Clique em "Escanear Alimento" para começar a registrar suas refeições
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal do Scanner */}
        {showScanner && (
          <FoodScanner
            onFoodScanned={handleFoodScanned}
            onClose={() => setShowScanner(false)}
          />
        )}
      </>
    );
  }

  return null;
}
