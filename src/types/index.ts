export type Category =
  | 'Alimentación'
  | 'Transporte'
  | 'Entretenimiento'
  | 'Servicios'
  | 'Salud'
  | 'Compras'
  | 'Educación'
  | 'Otros';

export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  savedAmount: number;
  monthlyContribution: number;
  deadline: string;
  emoji?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface AppData {
  userName: string;
  monthlyIncome: number;
  monthlyFreeLimit: number;
  salaryDay: number;
  expenses: Expense[];
  goals: Goal[];
}

export interface Recommendation {
  title: string;
  text: string;
}
