import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AppData, Category, Expense, Goal, Recommendation } from '../types';

const STORAGE_KEY = 'free-ai-finance-app-v2';
const MS_PER_DAY = 1000 * 60 * 60 * 24;

const now = new Date();
const makeDate = (day: number, hour = 12) =>
  new Date(now.getFullYear(), now.getMonth(), day, hour).toISOString();

const createId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2, 11);

export const CATEGORIES: Category[] = [
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

const INITIAL_DATA: AppData = {
  userName: 'Diego',
  monthlyIncome: 1300,
  monthlyFreeLimit: 20,
  salaryDay: 30,
  expenses: [
    { id: 'exp-1', amount: 38, category: 'Alimentación', description: 'Uber Eats - Pizza Hut', date: makeDate(9, 10) },
    { id: 'exp-2', amount: 12, category: 'Transporte', description: 'Metro - tarjeta', date: makeDate(8, 9) },
    { id: 'exp-3', amount: 43, category: 'Entretenimiento', description: 'Netflix', date: makeDate(5, 20) },
    { id: 'exp-4', amount: 95, category: 'Alimentación', description: 'Wong - supermercado', date: makeDate(4, 13) },
    { id: 'exp-5', amount: 30, category: 'Servicios', description: 'Claro - recarga', date: makeDate(3, 11) },
    { id: 'exp-6', amount: 22, category: 'Transporte', description: 'Taxi Beat', date: makeDate(2, 8) },
    { id: 'exp-7', amount: 42, category: 'Alimentación', description: 'Almuerzo en campus', date: makeDate(8, 14) },
    { id: 'exp-8', amount: 68, category: 'Alimentación', description: 'Brunch con amigos', date: makeDate(7, 11) },
    { id: 'exp-9', amount: 77, category: 'Alimentación', description: 'Mercado semanal', date: makeDate(1, 18) },
    { id: 'exp-10', amount: 46, category: 'Transporte', description: 'Cabify al trabajo', date: makeDate(7, 8) },
    { id: 'exp-11', amount: 90, category: 'Transporte', description: 'Pasajes del finde', date: makeDate(5, 15) },
    { id: 'exp-12', amount: 29, category: 'Entretenimiento', description: 'Cine del viernes', date: makeDate(6, 19) },
    { id: 'exp-13', amount: 52, category: 'Entretenimiento', description: 'Noche de karaoke', date: makeDate(3, 22) },
    { id: 'exp-14', amount: 24, category: 'Servicios', description: 'Internet móvil', date: makeDate(8, 21) },
    { id: 'exp-15', amount: 29, category: 'Servicios', description: 'Datos extra', date: makeDate(6, 17) },
    { id: 'exp-16', amount: 24, category: 'Salud', description: 'Farmacia', date: makeDate(7, 18) },
    { id: 'exp-17', amount: 36, category: 'Salud', description: 'Gimnasio', date: makeDate(4, 7) },
    { id: 'exp-18', amount: 90, category: 'Compras', description: 'Audífonos', date: makeDate(2, 20) },
  ],
  goals: [
    {
      id: 'goal-1',
      name: 'Laptop para la U',
      targetAmount: 2000,
      savedAmount: 1360,
      monthlyContribution: 180,
      deadline: new Date(now.getFullYear(), now.getMonth() + 2, 30).toISOString(),
      emoji: '💻',
    },
    {
      id: 'goal-2',
      name: 'Viaje a Cusco',
      targetAmount: 2000,
      savedAmount: 440,
      monthlyContribution: 120,
      deadline: new Date(now.getFullYear(), now.getMonth() + 8, 15).toISOString(),
      emoji: '🧳',
    },
  ],
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
  const diffDays = Math.round((startToday - startDate) / MS_PER_DAY);

  if (diffDays === 0) return 'hoy';
  if (diffDays === 1) return 'ayer';

  const label = new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(date);
  return label.replace('.', '').toLowerCase();
};

export const formatGoalDeadline = (dateInput: string) => {
  const date = new Date(dateInput);
  const label = new Intl.DateTimeFormat('es-PE', { month: 'short', year: 'numeric' }).format(date);
  return `Llega en ${label.replace('.', '').toLowerCase()}`;
};

export const getGoalPercentage = (goal: Goal) =>
  Math.min(100, Math.round((goal.savedAmount / goal.targetAmount) * 100));

interface FinanceContextValue {
  data: AppData;
  error: string | null;
  clearError: () => void;
  addExpense: (expense: Omit<Expense, 'id'>) => boolean;
  addGoal: (goal: Omit<Goal, 'id'>) => boolean;
  addMoneyToGoal: (goalId: string, amount: number) => boolean;
  currentMonthExpenses: Expense[];
  currentMonthSpent: number;
  availableBalance: number;
  recordsUsed: number;
  recordsLeft: number;
  dailyExpenseCounts: Array<{ dayLabel: string; fullDate: string; count: number }>;
  expensesByCategory: Record<Category, number>;
  topCategories: Array<[Category, number]>;
  activeGoal: Goal | null;
  totalSavedForGoals: number;
  daysUntilSalary: number;
  recommendations: Recommendation[];
  aiTip: string;
  simulateGoalScenario: (goalId: string, extraMonthly: number) => {
    weeksSaved: number;
    message: string;
    projectedFreeCash: number;
  };
  generateChatResponse: (question: string) => string;
}

const FinanceContext = createContext<FinanceContextValue | null>(null);

export const FinanceProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<AppData>(() => {
    if (typeof window === 'undefined') return INITIAL_DATA;

    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return INITIAL_DATA;

    try {
      return JSON.parse(saved) as AppData;
    } catch {
      return INITIAL_DATA;
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (!error) return;
    const timeout = window.setTimeout(() => setError(null), 4200);
    return () => window.clearTimeout(timeout);
  }, [error]);

  const currentMonthExpenses = useMemo(() => {
    const today = new Date();
    return [...data.expenses]
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === today.getMonth() &&
          expenseDate.getFullYear() === today.getFullYear()
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [data.expenses]);

  const currentMonthSpent = useMemo(
    () => currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
    [currentMonthExpenses],
  );

  const availableBalance = Math.max(0, data.monthlyIncome - currentMonthSpent);
  const recordsUsed = currentMonthExpenses.length;
  const recordsLeft = Math.max(0, data.monthlyFreeLimit - recordsUsed);

  const expensesByCategory = useMemo(() => {
    const totals = Object.fromEntries(CATEGORIES.map((category) => [category, 0])) as Record<Category, number>;
    currentMonthExpenses.forEach((expense) => {
      totals[expense.category] += expense.amount;
    });
    return totals;
  }, [currentMonthExpenses]);

  const topCategories = useMemo(
    () =>
      (Object.entries(expensesByCategory) as Array<[Category, number]>)
        .filter(([, amount]) => amount > 0)
        .sort((a, b) => b[1] - a[1]),
    [expensesByCategory],
  );

  const dailyExpenseCounts = useMemo(() => {
    const map = new Map<string, { dayLabel: string; fullDate: string; count: number }>();

    currentMonthExpenses.forEach((expense) => {
      const date = new Date(expense.date);
      const key = date.toISOString().slice(0, 10);
      const current = map.get(key);
      const dayLabel = new Intl.DateTimeFormat('es-PE', { day: 'numeric' }).format(date);
      const fullDate = capitalize(
        new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' })
          .format(date)
          .replace('.', ''),
      );

      map.set(key, {
        dayLabel,
        fullDate,
        count: (current?.count ?? 0) + 1,
      });
    });

    return [...map.entries()]
      .sort(([a], [b]) => (a < b ? 1 : -1))
      .slice(0, 6)
      .map(([, value]) => value);
  }, [currentMonthExpenses]);

  const activeGoal = useMemo(() => {
    if (!data.goals.length) return null;
    return [...data.goals].sort((a, b) => getGoalPercentage(b) - getGoalPercentage(a))[0];
  }, [data.goals]);

  const totalSavedForGoals = useMemo(
    () => data.goals.reduce((sum, goal) => sum + goal.savedAmount, 0),
    [data.goals],
  );

  const daysUntilSalary = useMemo(() => {
    const today = new Date();
    const nextSalaryDate = new Date(today.getFullYear(), today.getMonth(), data.salaryDay);

    if (today.getDate() > data.salaryDay) {
      nextSalaryDate.setMonth(nextSalaryDate.getMonth() + 1);
    }

    const startToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const startSalary = new Date(
      nextSalaryDate.getFullYear(),
      nextSalaryDate.getMonth(),
      nextSalaryDate.getDate(),
    ).getTime();

    return Math.max(0, Math.ceil((startSalary - startToday) / MS_PER_DAY));
  }, [data.salaryDay]);

  const recommendations = useMemo<Recommendation[]>(() => {
    const topCategory = topCategories[0];
    const biggestGoal = activeGoal;

    return [
      {
        title: 'Recomendación rápida',
        text: topCategory
          ? `Tu categoría más alta es ${topCategory[0].toLowerCase()} con ${formatCurrency(topCategory[1])}. Si recortas ${formatCurrency(50)} esta semana, liberas espacio para ahorrar sin dejar de salir.`
          : 'Todavía no hay gastos registrados. Comienza a registrar para activar recomendaciones más precisas.',
      },
      {
        title: 'Mejora sugerida',
        text: biggestGoal
          ? `Tu meta ${biggestGoal.name} va al ${getGoalPercentage(biggestGoal)}%. Mantener un aporte de ${formatCurrency(biggestGoal.monthlyContribution)} al mes la acerca más rápido.`
          : 'Crea una meta y la IA te dirá cuánto puedes mover cada mes.',
      },
    ];
  }, [activeGoal, topCategories]);

  const aiTip = useMemo(() => {
    const topCategory = topCategories[0];

    if (!topCategory || !activeGoal) {
      return 'Registra tu primer gasto y tu primera meta para recibir consejos personalizados de IA.';
    }

    const reducedSpend = Math.min(50, Math.round(topCategory[1] * 0.16));
    const remainingForGoal = Math.max(0, activeGoal.targetAmount - activeGoal.savedAmount - reducedSpend);
    const monthsLeft = Math.ceil(remainingForGoal / Math.max(activeGoal.monthlyContribution, 1));

    return `Gastaste más en ${topCategory[0].toLowerCase()} este mes. Si bajas ${formatCurrency(reducedSpend)} en esa categoría y lo pasas a ${activeGoal.name}, podrías acercarte en ${Math.max(2, monthsLeft)} meses a tu objetivo.`;
  }, [activeGoal, topCategories]);

  const clearError = useCallback(() => setError(null), []);

  const addExpense = useCallback(
    (expense: Omit<Expense, 'id'>) => {
      if (!expense.description.trim()) {
        setError('Escribe una descripción para registrar el gasto.');
        return false;
      }

      if (!Number.isFinite(expense.amount) || expense.amount <= 0) {
        setError('Ingresa un monto válido mayor a cero.');
        return false;
      }

      const expenseDate = new Date(expense.date);
      const today = new Date();
      const sameMonth =
        expenseDate.getMonth() === today.getMonth() &&
        expenseDate.getFullYear() === today.getFullYear();

      if (sameMonth && recordsUsed >= data.monthlyFreeLimit) {
        setError(`Ya usaste tus ${data.monthlyFreeLimit} registros gratuitos de ${formatMonthYear(today)}.`);
        return false;
      }

      setData((prev) => ({
        ...prev,
        expenses: [{ ...expense, id: createId() }, ...prev.expenses],
      }));
      return true;
    },
    [data.monthlyFreeLimit, recordsUsed],
  );

  const addGoal = useCallback((goal: Omit<Goal, 'id'>) => {
    if (!goal.name.trim()) {
      setError('Ponle un nombre a tu meta.');
      return false;
    }

    if (!Number.isFinite(goal.targetAmount) || goal.targetAmount <= 0) {
      setError('La meta necesita un monto objetivo válido.');
      return false;
    }

    if (!Number.isFinite(goal.monthlyContribution) || goal.monthlyContribution <= 0) {
      setError('Define cuánto ahorrarás al mes para esta meta.');
      return false;
    }

    setData((prev) => ({
      ...prev,
      goals: [...prev.goals, { ...goal, id: createId() }],
    }));
    return true;
  }, []);

  const addMoneyToGoal = useCallback((goalId: string, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) {
      setError('El aporte a la meta debe ser mayor a cero.');
      return false;
    }

    setData((prev) => ({
      ...prev,
      goals: prev.goals.map((goal) =>
        goal.id === goalId
          ? { ...goal, savedAmount: Math.min(goal.targetAmount, goal.savedAmount + amount) }
          : goal,
      ),
    }));

    return true;
  }, []);

  const simulateGoalScenario = useCallback(
    (goalId: string, extraMonthly: number) => {
      const goal = data.goals.find((item) => item.id === goalId);
      if (!goal) {
        return {
          weeksSaved: 0,
          message: 'Crea una meta para poder usar el simulador IA.',
          projectedFreeCash: availableBalance,
        };
      }

      const remaining = Math.max(0, goal.targetAmount - goal.savedAmount);
      const currentMonths = remaining / Math.max(goal.monthlyContribution, 1);
      const improvedMonths = remaining / Math.max(goal.monthlyContribution + extraMonthly, 1);
      const weeksSaved = Math.max(0, Math.round((currentMonths - improvedMonths) * 4));
      const projectedFreeCash = Math.max(0, availableBalance - extraMonthly);

      return {
        weeksSaved,
        projectedFreeCash,
        message: `Si ahorras ${formatCurrency(extraMonthly)} más al mes, adelantas ${goal.name} ${weeksSaved} semanas y todavía te quedarían ${formatCurrency(projectedFreeCash)} disponibles.` ,
      };
    },
    [availableBalance, data.goals],
  );

  const generateChatResponse = useCallback(
    (question: string) => {
      const query = question.toLowerCase();
      const topCategory = topCategories[0];
      const bestGoal = activeGoal;
      const todayRecords = dailyExpenseCounts[0]?.count ?? 0;

      if (/(saldo|disponible|queda|tengo)/.test(query)) {
        return `Tienes ${formatCurrency(availableBalance)} disponibles este mes. Llevas ${formatCurrency(currentMonthSpent)} gastados y aún te quedan ${recordsLeft} registros gratuitos.`;
      }

      if (/(gasto|gasté|gastando|mes)/.test(query)) {
        return topCategory
          ? `Este mes llevas ${formatCurrency(currentMonthSpent)} gastados. Tu categoría más alta es ${topCategory[0].toLowerCase()} con ${formatCurrency(topCategory[1])}, que representa una parte importante de tu presupuesto.`
          : 'Todavía no hay gastos suficientes para analizar el mes.';
      }

      if (/(meta|laptop|viaje|ahorro)/.test(query)) {
        return bestGoal
          ? `${bestGoal.name} va en ${getGoalPercentage(bestGoal)}%. Ya tienes ${formatCurrency(bestGoal.savedAmount)} de ${formatCurrency(bestGoal.targetAmount)} y aportando ${formatCurrency(bestGoal.monthlyContribution)} al mes mantienes un progreso sólido.`
          : 'Aún no tienes metas activas. Si creas una, te ayudo a proyectarla.';
      }

      if (/(categoría|categoria|delivery|comida|transporte)/.test(query)) {
        return topCategory
          ? `Tu categoría más fuerte es ${topCategory[0].toLowerCase()} con ${formatCurrency(topCategory[1])}. Si reduces entre ${formatCurrency(30)} y ${formatCurrency(50)} ahí, mejoras tu cierre del mes sin sentirlo tanto.`
          : 'Todavía no puedo detectar una categoría principal porque faltan registros.';
      }

      if (/(plan|consejo|mejorar|puedo ahorrar|armame)/.test(query)) {
        return `Te propongo un mini plan: 1) limitar ${topCategory ? topCategory[0].toLowerCase() : 'los gastos variables'} dos veces por semana, 2) mover ${formatCurrency(50)} apenas recibas tu pago a tu meta principal, y 3) revisar al final del día si hoy ya superaste tus ${todayRecords} registros de movimiento.`;
      }

      return `Con tus datos de ${formatMonthYear()}, veo un avance estable. Pregúntame por saldo, gastos, categorías, metas o píde un plan para ahorrar y te respondo según tus registros.`;
    },
    [activeGoal, availableBalance, currentMonthSpent, dailyExpenseCounts, recordsLeft, topCategories],
  );

  const value = useMemo<FinanceContextValue>(
    () => ({
      data,
      error,
      clearError,
      addExpense,
      addGoal,
      addMoneyToGoal,
      currentMonthExpenses,
      currentMonthSpent,
      availableBalance,
      recordsUsed,
      recordsLeft,
      dailyExpenseCounts,
      expensesByCategory,
      topCategories,
      activeGoal,
      totalSavedForGoals,
      daysUntilSalary,
      recommendations,
      aiTip,
      simulateGoalScenario,
      generateChatResponse,
    }),
    [
      activeGoal,
      addExpense,
      addGoal,
      addMoneyToGoal,
      aiTip,
      availableBalance,
      clearError,
      currentMonthExpenses,
      currentMonthSpent,
      dailyExpenseCounts,
      data,
      daysUntilSalary,
      error,
      expensesByCategory,
      recommendations,
      recordsLeft,
      recordsUsed,
      simulateGoalScenario,
      topCategories,
      totalSavedForGoals,
      generateChatResponse,
    ],
  );

  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>;
};

export const useFinance = () => {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error('useFinance debe usarse dentro de FinanceProvider');
  }

  return context;
};
