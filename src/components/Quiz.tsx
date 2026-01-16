'use client';

import { useState } from 'react';
import { QUIZ_STEPS } from '@/lib/constants';
import { UserProfile } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface QuizProps {
  onComplete: (profile: UserProfile) => void;
}

export default function Quiz({ onComplete }: QuizProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const step = QUIZ_STEPS[currentStep];
  const progress = ((currentStep + 1) / QUIZ_STEPS.length) * 100;

  const handleNext = () => {
    if (step.type === 'multi-select') {
      setAnswers({ ...answers, [step.id]: selectedOptions });
      setSelectedOptions([]);
    }

    if (currentStep < QUIZ_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz completo - converter respostas para UserProfile
      const profile = convertAnswersToProfile({ ...answers, [step.id]: selectedOptions });
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (value: string) => {
    setAnswers({ ...answers, [step.id]: value });
  };

  const handleSelectOption = (option: string) => {
    if (step.type === 'select') {
      setAnswers({ ...answers, [step.id]: option });
    } else if (step.type === 'multi-select') {
      if (selectedOptions.includes(option)) {
        setSelectedOptions(selectedOptions.filter(o => o !== option));
      } else {
        setSelectedOptions([...selectedOptions, option]);
      }
    }
  };

  const isStepValid = () => {
    if (step.type === 'number') {
      const value = parseFloat(answers[step.id]);
      return !isNaN(value) && value >= (step.min || 0) && value <= (step.max || 1000);
    } else if (step.type === 'select') {
      return !!answers[step.id];
    } else if (step.type === 'multi-select') {
      return selectedOptions.length > 0;
    }
    return !!answers[step.id];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Pergunta {currentStep + 1} de {QUIZ_STEPS.length}
            </span>
            <span className="text-sm font-medium text-indigo-600">
              {Math.round(progress)}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 transition-all duration-300">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
            {step.question}
          </h2>

          {/* Input Types */}
          {step.type === 'number' && (
            <div className="space-y-4">
              <div className="relative">
                <Input
                  type="number"
                  min={step.min}
                  max={step.max}
                  placeholder={step.placeholder}
                  value={answers[step.id] || ''}
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="text-2xl h-16 pr-16 text-center font-semibold"
                />
                {step.unit && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-gray-500 font-medium">
                    {step.unit}
                  </span>
                )}
              </div>
            </div>
          )}

          {step.type === 'select' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                    answers[step.id] === option
                      ? 'border-indigo-600 bg-indigo-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">{option}</span>
                    {answers[step.id] === option && (
                      <Check className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {step.type === 'multi-select' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {step.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelectOption(option)}
                  className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left ${
                    selectedOptions.includes(option)
                      ? 'border-indigo-600 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">{option}</span>
                    {selectedOptions.includes(option) && (
                      <Check className="w-6 h-6 text-indigo-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12">
            {currentStep > 0 && (
              <Button
                onClick={handleBack}
                variant="outline"
                size="lg"
                className="flex-1 h-14 text-lg"
              >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Voltar
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              size="lg"
              className="flex-1 h-14 text-lg bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              {currentStep === QUIZ_STEPS.length - 1 ? 'Finalizar' : 'Próximo'}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Converter respostas do quiz para UserProfile
function convertAnswersToProfile(answers: Record<string, any>): UserProfile {
  const sexMap: Record<string, 'male' | 'female' | 'other'> = {
    'Masculino': 'male',
    'Feminino': 'female',
    'Outro': 'other'
  };

  const experienceMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    'Iniciante': 'beginner',
    'Intermediário': 'intermediate',
    'Avançado': 'advanced'
  };

  const locationMap: Record<string, 'home' | 'gym' | 'outdoor'> = {
    'Casa': 'home',
    'Academia': 'gym',
    'Ao ar livre': 'outdoor'
  };

  const focusMap: Record<string, 'full-body' | 'abs' | 'legs' | 'glutes' | 'chest' | 'back' | 'arms'> = {
    'Corpo todo': 'full-body',
    'Abdômen': 'abs',
    'Pernas': 'legs',
    'Glúteos': 'glutes',
    'Peito': 'chest',
    'Costas': 'back',
    'Braços': 'arms'
  };

  const goalMap: Record<string, 'weight-loss' | 'maintenance' | 'muscle-gain'> = {
    'Emagrecimento': 'weight-loss',
    'Manutenção': 'maintenance',
    'Ganho de massa': 'muscle-gain'
  };

  return {
    weight: parseFloat(answers.weight),
    height: parseFloat(answers.height),
    age: parseInt(answers.age),
    sex: sexMap[answers.sex] || 'other',
    desiredWeight: parseFloat(answers.desiredWeight),
    healthConditions: answers.healthConditions || [],
    physicalLimitations: answers.physicalLimitations || [],
    experienceLevel: experienceMap[answers.experienceLevel] || 'beginner',
    trainingLocation: locationMap[answers.trainingLocation] || 'home',
    focusArea: focusMap[answers.focusArea] || 'full-body',
    daysPerWeek: parseInt(answers.daysPerWeek?.replace(' dias', '')) || 3,
    goal: goalMap[answers.goal] || 'maintenance',
    dietaryRestrictions: answers.dietaryRestrictions || []
  };
}
