import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Plus, ReceiptText } from 'lucide-react';
import { CATEGORIES, useFinance } from '../hooks/useFinance';
import { CATEGORY_COLORS, formatCurrency, formatMonthYear, formatRelativeExpenseDate } from '../utils/finance';
import type { Category } from '../types';

const Transactions = () => {
  const {
    addExpense,
    currentMonthExpenses,
    currentMonthSpent,
    dailyExpenseCounts,
    recordsLeft,
    recordsUsed,
    data,
  } = useFinance();

  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    description: '',
    category: 'Alimentación' as Category,
    amount: '',
    date: new Date().toISOString().slice(0, 10),
  });

  const todayCount = useMemo(() => {
    const todayKey = new Date().toISOString().slice(0, 10);
    return currentMonthExpenses.filter((expense) => expense.date.slice(0, 10) === todayKey).length;
  }, [currentMonthExpenses]);

  const submitExpense = (event: React.FormEvent) => {
    event.preventDefault();

    const saved = addExpense({
      description: form.description,
      category: form.category,
      amount: Number(form.amount),
      date: new Date(form.date).toISOString(),
    });

    if (!saved) return;

    setForm({
      description: '',
      category: 'Alimentación',
      amount: '',
      date: new Date().toISOString().slice(0, 10),
    });
    setIsAdding(false);
  };

  return (
    <div className="relative space-y-4 text-[#1f1f1f]">
      <header>
        <h1 className="text-[16px] font-bold leading-none">Mis gastos</h1>
        <p className="mt-1 text-[13px] text-[#5d594f]">
          {formatMonthYear()} · {recordsUsed} de {data.monthlyFreeLimit} registros usados
        </p>
      </header>

      <section className="grid grid-cols-3 gap-2">
        <div className="rounded-[18px] bg-[#f3f0e8] p-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#726d62]">Mes</p>
          <p className="mt-1 text-[16px] font-semibold text-[#24211d]">{formatCurrency(currentMonthSpent)}</p>
        </div>
        <div className="rounded-[18px] bg-[#f3f0e8] p-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#726d62]">Hoy</p>
          <p className="mt-1 text-[16px] font-semibold text-[#24211d]">{todayCount} regs.</p>
        </div>
        <div className="rounded-[18px] bg-[#f3f0e8] p-3">
          <p className="text-[11px] uppercase tracking-[0.08em] text-[#726d62]">Free</p>
          <p className="mt-1 text-[16px] font-semibold text-[#5a4bc3]">{recordsLeft} libres</p>
        </div>
      </section>

      <section className="rounded-[22px] border border-[#ebe6db] bg-[#fcfbf8] p-4">
        <div className="mb-3 flex items-center gap-2 text-[#4e483f]">
          <CalendarDays size={16} />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.08em]">Registros por día</h2>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {dailyExpenseCounts.map((item) => (
            <div key={item.fullDate} className="rounded-[16px] bg-[#f3f0e8] px-3 py-2 text-center">
              <p className="text-[14px] font-semibold text-[#26231f]">{item.dayLabel}</p>
              <p className="text-[11px] text-[#6f695d]">{item.count} registros</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[22px] border border-[#ebe6db] bg-[#fcfbf8] px-4 py-2">
        <AnimatePresence initial={false}>
          {currentMonthExpenses.map((expense, index) => (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className={`flex items-start justify-between gap-3 py-3 ${
                index !== currentMonthExpenses.length - 1 ? 'border-b border-[#ece6db]' : ''
              }`}
            >
              <div className="flex min-w-0 items-start gap-3">
                <span
                  className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                />
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-medium text-[#26231f]">{expense.description}</p>
                  <p className="text-[13px] text-[#6b6559]">
                    {expense.category} · {formatRelativeExpenseDate(expense.date)}
                  </p>
                </div>
              </div>

              <p className="whitespace-nowrap text-[15px] font-semibold text-[#b24f58]">
                -{formatCurrency(expense.amount)}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </section>

      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="absolute bottom-[88px] left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#5b4bc4] text-white shadow-[0_18px_30px_rgba(91,75,196,0.32)] transition-transform active:scale-95"
        aria-label="Agregar gasto"
      >
        <Plus size={24} />
      </button>

      <AnimatePresence>
        {isAdding && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 24, stiffness: 210 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-[430px] rounded-t-[34px] border border-[#e8e2d8] bg-[#fcfbf8] p-5"
            >
              <div className="mx-auto mb-4 h-1.5 w-14 rounded-full bg-[#ddd7cc]" />
              <div className="mb-4 flex items-center gap-2 text-[#24211d]">
                <ReceiptText size={18} />
                <h2 className="text-[18px] font-semibold">Nuevo gasto</h2>
              </div>

              <form onSubmit={submitExpense} className="space-y-3">
                <input
                  type="text"
                  required
                  value={form.description}
                  onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                  placeholder="¿En qué gastaste?"
                  className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                />

                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={form.category}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, category: event.target.value as Category }))
                    }
                    className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={form.amount}
                    onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                    placeholder="Monto"
                    className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                  />
                </div>

                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                />

                <button
                  type="submit"
                  className="w-full rounded-[18px] bg-[#5b4bc4] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(91,75,196,0.24)]"
                >
                  Guardar gasto
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Transactions;
