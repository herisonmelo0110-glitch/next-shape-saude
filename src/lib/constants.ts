import { QuizStep } from './types';

export const QUIZ_STEPS: QuizStep[] = [
  {
    id: 'weight',
    question: 'Qual é o seu peso atual?',
    type: 'number',
    unit: 'kg',
    min: 30,
    max: 300,
    placeholder: 'Ex: 70'
  },
  {
    id: 'height',
    question: 'Qual é a sua altura?',
    type: 'number',
    unit: 'cm',
    min: 100,
    max: 250,
    placeholder: 'Ex: 170'
  },
  {
    id: 'age',
    question: 'Qual é a sua idade?',
    type: 'number',
    unit: 'anos',
    min: 13,
    max: 100,
    placeholder: 'Ex: 25'
  },
  {
    id: 'sex',
    question: 'Qual é o seu sexo?',
    type: 'select',
    options: ['Masculino', 'Feminino', 'Outro']
  },
  {
    id: 'healthConditions',
    question: 'Você possui alguma condição de saúde?',
    type: 'multi-select',
    options: [
      'Nenhuma',
      'Hipertensão',
      'Diabetes',
      'Problemas cardíacos',
      'Problemas respiratórios',
      'Hérnia',
      'Lesão recente',
      'Outra'
    ]
  },
  {
    id: 'physicalLimitations',
    question: 'Você possui alguma limitação física?',
    type: 'multi-select',
    options: [
      'Nenhuma',
      'Não posso correr',
      'Não posso agachar',
      'Problemas no joelho',
      'Problemas na coluna',
      'Mobilidade reduzida',
      'Problemas no ombro',
      'Outra'
    ]
  },
  {
    id: 'desiredWeight',
    question: 'Qual é o seu peso desejado?',
    type: 'number',
    unit: 'kg',
    min: 30,
    max: 300,
    placeholder: 'Ex: 65'
  },
  {
    id: 'experienceLevel',
    question: 'Qual é o seu nível de experiência com treinos?',
    type: 'select',
    options: ['Iniciante', 'Intermediário', 'Avançado']
  },
  {
    id: 'trainingLocation',
    question: 'Onde você deseja treinar?',
    type: 'select',
    options: ['Casa', 'Academia', 'Ao ar livre']
  },
  {
    id: 'focusArea',
    question: 'Qual parte do corpo você deseja desenvolver?',
    type: 'select',
    options: [
      'Corpo todo',
      'Abdômen',
      'Pernas',
      'Glúteos',
      'Peito',
      'Costas',
      'Braços'
    ]
  },
  {
    id: 'daysPerWeek',
    question: 'Quantos dias por semana você deseja treinar?',
    type: 'select',
    options: ['2 dias', '3 dias', '4 dias', '5 dias', '6 dias']
  },
  {
    id: 'goal',
    question: 'Qual é o seu objetivo principal?',
    type: 'select',
    options: ['Emagrecimento', 'Manutenção', 'Ganho de massa']
  },
  {
    id: 'dietaryRestrictions',
    question: 'Você possui alguma restrição alimentar?',
    type: 'multi-select',
    options: [
      'Nenhuma',
      'Intolerância à lactose',
      'Alergia a glúten',
      'Vegetariano',
      'Vegano',
      'Outra'
    ]
  }
];

export const APP_CONFIG = {
  name: 'NEXT SHAPE',
  slogan: 'A inteligência que molda o seu corpo',
  colors: {
    primary: '#6366f1',
    secondary: '#8b5cf6',
    accent: '#ec4899'
  }
};

export const DAILY_STEPS_GOAL = 10000;
export const CALORIES_PER_STEP = 0.04;
