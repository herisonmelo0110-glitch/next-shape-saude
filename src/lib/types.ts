// Types para o NEXT SHAPE

export interface UserProfile {
  // Dados físicos
  weight: number; // kg
  height: number; // cm
  age: number;
  sex: 'male' | 'female' | 'other';
  desiredWeight: number; // kg
  
  // Condições de saúde
  healthConditions: string[];
  physicalLimitations: string[];
  
  // Treino
  experienceLevel: 'beginner' | 'intermediate' | 'advanced';
  trainingLocation: 'home' | 'gym' | 'outdoor';
  focusArea: 'full-body' | 'abs' | 'legs' | 'glutes' | 'chest' | 'back' | 'arms';
  daysPerWeek: number;
  
  // Nutrição
  goal: 'weight-loss' | 'maintenance' | 'muscle-gain';
  dietaryRestrictions: string[];
}

export interface WorkoutPlan {
  id: string;
  userId: string;
  createdAt: Date;
  weeklySchedule: DayWorkout[];
  progressionNotes: string;
  safetyAlerts: string[];
}

export interface DayWorkout {
  day: string;
  isRestDay: boolean;
  warmup?: Exercise[];
  mainWorkout?: Exercise[];
  cooldown?: Exercise[];
  notes?: string;
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string; // pode ser "12-15" ou "30 segundos"
  rest: string; // tempo de descanso
  load?: string; // sugestão de carga
  instructions: string;
  safetyTips?: string;
  adaptations?: string; // para limitações físicas
}

export interface MealPlan {
  id: string;
  userId: string;
  createdAt: Date;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
  meals: {
    breakfast: Meal;
    morningSnack: Meal;
    lunch: Meal;
    afternoonSnack: Meal;
    dinner: Meal;
  };
  substitutions: string[];
}

export interface Meal {
  name: string;
  foods: FoodItem[];
  totalCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fats: number;
  };
}

export interface FoodItem {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ScannedFood {
  name: string;
  portion: number; // gramas
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  calorieLevel: 'low' | 'medium' | 'high';
  nutritionalQuality: 'excellent' | 'good' | 'moderate' | 'poor';
  recommendation: 'weight-loss' | 'maintenance' | 'muscle-gain' | 'all';
}

export interface DailyActivity {
  date: string;
  steps: number;
  caloriesBurned: number;
  goal: number;
  scannedFoods: ScannedFood[];
  totalCaloriesConsumed: number;
}

export interface QuizStep {
  id: string;
  question: string;
  type: 'number' | 'select' | 'multi-select' | 'text';
  options?: string[];
  placeholder?: string;
  unit?: string;
  min?: number;
  max?: number;
}
