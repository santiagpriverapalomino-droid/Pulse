import type { Category, Goal } from '../types';

export const CATEGORY_ORDER: Category[] = [
  'Alimentación',
  'Transporte',
  'Entretenimiento',
  'Servicios',
  'Salud',
  'Compras',
  'Educación',
  'Otros',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Alimentación: '#5b4bc4',
  Transporte: '#1fa18b',
  Entretenimiento: '#f1a22e',
  Servicios: '#db6334',
  Salud: '#e05f94',
  Compras: '#4a85f6',
  Educación: '#8f66f0',
  Otros: '#94a3b8',
};

const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const formatCurrency = (value: number, digits = 0) => {
  const absolute = Math.abs(value);
  const formatted = absolute.toLocaleString('es-PE', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
  return `${value < 0 ? '-' : ''}S/${formatted}`;
};

export const formatMonthYear = (date = new Date()) =>
  capitalize(new Intl.DateTimeFormat('es-PE', { month: 'long', year: 'numeric' }).format(date));

export const formatRelativeExpenseDate = (dateInput: string) => {
  const date = new Date(dateInput);
  const today = new Date();
  const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const startDate = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((startToday - startDate) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'ayer';

  return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' })
    .format(date)
    .replace('.', '')
    .toLowerCase();
};

export const formatGoalDeadline = (dateInput: string) => {
  const date = new Date(dateInput);
  const label = new Intl.DateTimeFormat('es-PE', { month: 'short', year: 'numeric' })
    .format(date)
    .replace('.', '')
    .toLowerCase();

  return `Llega en ${label}`;
};

export const getGoalPercentage = (goal: Goal) =>
  Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));
