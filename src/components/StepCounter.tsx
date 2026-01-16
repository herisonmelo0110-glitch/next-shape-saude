'use client';

import { useState, useEffect } from 'react';
import { DailyActivity } from '@/lib/types';
import { DAILY_STEPS_GOAL, CALORIES_PER_STEP } from '@/lib/constants';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Activity, Flame, Target, TrendingUp, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function StepCounter() {
  const [dailyActivity, setDailyActivity] = useState<DailyActivity>({
    date: new Date().toISOString().split('T')[0],
    steps: 0,
    caloriesBurned: 0,
    goal: DAILY_STEPS_GOAL,
    scannedFoods: [],
    totalCaloriesConsumed: 0
  });

  const [isTracking, setIsTracking] = useState(false);
  const [weeklyData, setWeeklyData] = useState<DailyActivity[]>([]);

  // Simular contador de passos (em produção, usar API do dispositivo)
  useEffect(() => {
    if (isTracking) {
      const interval = setInterval(() => {
        setDailyActivity(prev => {
          const newSteps = prev.steps + Math.floor(Math.random() * 10);
          const newCalories = Math.round(newSteps * CALORIES_PER_STEP);
          
          return {
            ...prev,
            steps: newSteps,
            caloriesBurned: newCalories
          };
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isTracking]);

  // Carregar dados da semana (simulado)
  useEffect(() => {
    const mockWeeklyData: DailyActivity[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      mockWeeklyData.push({
        date: date.toISOString().split('T')[0],
        steps: Math.floor(Math.random() * 15000),
        caloriesBurned: Math.floor(Math.random() * 600),
        goal: DAILY_STEPS_GOAL,
        scannedFoods: [],
        totalCaloriesConsumed: 0
      });
    }
    setWeeklyData(mockWeeklyData);
  }, []);

  const progressPercentage = (dailyActivity.steps / dailyActivity.goal) * 100;
  const isGoalReached = dailyActivity.steps >= dailyActivity.goal;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Atividade Diária
          </h1>
          <p className="text-lg text-gray-600">
            Acompanhe seus passos e calorias
          </p>
        </div>

        {/* Main Stats Card */}
        <Card className="p-8 mb-6 bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
          <div className="text-center mb-6">
            <div className="text-6xl md:text-8xl font-bold mb-2">
              {dailyActivity.steps.toLocaleString()}
            </div>
            <p className="text-xl opacity-90">passos hoje</p>
          </div>

          <Progress 
            value={Math.min(progressPercentage, 100)} 
            className="h-4 mb-4 bg-white/20"
          />

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm opacity-90">
              Meta: {dailyActivity.goal.toLocaleString()} passos
            </span>
            <span className="text-sm font-semibold">
              {Math.round(progressPercentage)}%
            </span>
          </div>

          {isGoalReached && (
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center">
              <p className="font-semibold">🎉 Parabéns! Meta atingida!</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Flame className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">{dailyActivity.caloriesBurned}</p>
              <p className="text-sm opacity-90">kcal queimadas</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
              <Target className="w-6 h-6 mx-auto mb-2" />
              <p className="text-2xl font-bold">
                {Math.round((dailyActivity.steps / dailyActivity.goal) * 100)}%
              </p>
              <p className="text-sm opacity-90">da meta</p>
            </div>
          </div>
        </Card>

        {/* Control Button */}
        <div className="mb-6">
          <Button
            onClick={() => setIsTracking(!isTracking)}
            size="lg"
            className={`w-full h-16 text-lg ${
              isTracking
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
            }`}
          >
            {isTracking ? 'Pausar Rastreamento' : 'Iniciar Rastreamento'}
          </Button>
        </div>

        {/* Weekly Overview */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-gray-600" />
            <h2 className="text-xl font-bold text-gray-900">Últimos 7 Dias</h2>
          </div>

          <div className="space-y-3">
            {weeklyData.map((day, index) => {
              const dayProgress = (day.steps / day.goal) * 100;
              const dayName = new Date(day.date).toLocaleDateString('pt-BR', { weekday: 'short' });
              const isToday = day.date === dailyActivity.date;

              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-700 capitalize w-12">
                        {dayName}
                      </span>
                      {isToday && (
                        <Badge variant="outline" className="text-xs">Hoje</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        {day.steps.toLocaleString()} passos
                      </span>
                      <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                        {Math.round(dayProgress)}%
                      </span>
                    </div>
                  </div>
                  <Progress value={Math.min(dayProgress, 100)} className="h-2" />
                </div>
              );
            })}
          </div>

          {/* Weekly Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(weeklyData.reduce((acc, day) => acc + day.steps, 0) / 7).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Média diária</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {weeklyData.reduce((acc, day) => acc + day.steps, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Total semanal</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {weeklyData.filter(day => day.steps >= day.goal).length}
              </p>
              <p className="text-xs text-gray-600">Metas atingidas</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
