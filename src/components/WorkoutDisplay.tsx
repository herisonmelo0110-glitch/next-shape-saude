'use client';

import { WorkoutPlan } from '@/lib/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/react-scroll-area';
import { Dumbbell, AlertTriangle, TrendingUp, Clock, Repeat, Weight } from 'lucide-react';

interface WorkoutDisplayProps {
  workout: WorkoutPlan;
}

export default function WorkoutDisplay({ workout }: WorkoutDisplayProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-4">
            <Dumbbell className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Seu Treino Personalizado
          </h1>
          <p className="text-lg text-gray-600">
            Criado especialmente para você pela IA
          </p>
        </div>

        {/* Safety Alerts */}
        {workout.safetyAlerts && workout.safetyAlerts.length > 0 && (
          <Card className="bg-amber-50 border-amber-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-amber-900 mb-2">Alertas de Segurança</h3>
                <ul className="space-y-2">
                  {workout.safetyAlerts.map((alert, index) => (
                    <li key={index} className="text-amber-800 text-sm">
                      • {alert}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Progression Notes */}
        {workout.progressionNotes && (
          <Card className="bg-indigo-50 border-indigo-200 p-6 mb-8">
            <div className="flex items-start gap-4">
              <TrendingUp className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-indigo-900 mb-2">Progressão Semanal</h3>
                <p className="text-indigo-800 text-sm">{workout.progressionNotes}</p>
              </div>
            </div>
          </Card>
        )}

        {/* Weekly Schedule */}
        <div className="space-y-6">
          {workout.weeklySchedule.map((day, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
                <h2 className="text-2xl font-bold text-white">{day.day}</h2>
                {day.isRestDay && (
                  <Badge className="mt-2 bg-white text-indigo-600">Dia de Descanso</Badge>
                )}
              </div>

              {!day.isRestDay && (
                <div className="p-6 space-y-6">
                  {/* Warmup */}
                  {day.warmup && day.warmup.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Aquecimento
                      </h3>
                      <div className="space-y-4">
                        {day.warmup.map((exercise, idx) => (
                          <ExerciseCard key={idx} exercise={exercise} />
                        ))}
                      </div>
                    </div>
                  )}

                  {day.warmup && day.mainWorkout && <Separator />}

                  {/* Main Workout */}
                  {day.mainWorkout && day.mainWorkout.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                        Treino Principal
                      </h3>
                      <div className="space-y-4">
                        {day.mainWorkout.map((exercise, idx) => (
                          <ExerciseCard key={idx} exercise={exercise} />
                        ))}
                      </div>
                    </div>
                  )}

                  {day.mainWorkout && day.cooldown && <Separator />}

                  {/* Cooldown */}
                  {day.cooldown && day.cooldown.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Alongamento
                      </h3>
                      <div className="space-y-4">
                        {day.cooldown.map((exercise, idx) => (
                          <ExerciseCard key={idx} exercise={exercise} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Day Notes */}
                  {day.notes && (
                    <>
                      <Separator />
                      <div className="bg-gray-50 rounded-xl p-4">
                        <p className="text-sm text-gray-700">
                          <strong>Observações:</strong> {day.notes}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExerciseCard({ exercise }: { exercise: any }) {
  return (
    <div className="bg-gray-50 rounded-xl p-5 space-y-3">
      <div className="flex items-start justify-between gap-4">
        <h4 className="font-semibold text-gray-900 text-lg">{exercise.name}</h4>
        {exercise.load && (
          <Badge variant="outline" className="flex items-center gap-1">
            <Weight className="w-3 h-3" />
            {exercise.load}
          </Badge>
        )}
      </div>

      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Repeat className="w-4 h-4" />
          <span>{exercise.sets} séries</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>{exercise.reps} repetições</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{exercise.rest} descanso</span>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm text-gray-700">
          <strong>Como executar:</strong> {exercise.instructions}
        </p>
        
        {exercise.safetyTips && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>⚠️ Segurança:</strong> {exercise.safetyTips}
            </p>
          </div>
        )}

        {exercise.adaptations && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              <strong>💡 Adaptações:</strong> {exercise.adaptations}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
