import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Sparkles, Target } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { formatCurrency, formatGoalDeadline, getGoalPercentage } from '../utils/finance';

const quickExtras = [40, 80, 120];
const emojiOptions = ['💻', '🛵', '✈️', '🎓', '📱', '🧳'];

const Goals = () => {
  const {
    addGoal,
    addMoneyToGoal,
    data,
    simulateGoalScenario,
    totalSavedForGoals,
  } = useFinance();

  const [isAdding, setIsAdding] = useState(false);
  const [extraSaving, setExtraSaving] = useState(80);
  const [form, setForm] = useState({
    name: '',
    targetAmount: '',
    monthlyContribution: '',
    deadline: '',
    emoji: '🎯',
  });

  const primaryGoal = data.goals[0];
  const simulation = useMemo(
    () => (primaryGoal ? simulateGoalScenario(primaryGoal.id, extraSaving) : null),
    [extraSaving, primaryGoal, simulateGoalScenario],
  );

  const submitGoal = (event: React.FormEvent) => {
    event.preventDefault();

    const saved = addGoal({
      name: form.name,
      targetAmount: Number(form.targetAmount),
      savedAmount: 0,
      monthlyContribution: Number(form.monthlyContribution),
      deadline: new Date(form.deadline).toISOString(),
      emoji: form.emoji,
    });

    if (!saved) return;

    setForm({
      name: '',
      targetAmount: '',
      monthlyContribution: '',
      deadline: '',
      emoji: '🎯',
    });
    setIsAdding(false);
  };

  return (
    <div className="space-y-4 text-[#1f1f1f]">
      <header>
        <h1 className="text-[16px] font-bold leading-none">Mis metas</h1>
        <p className="mt-1 text-[13px] text-[#5d594f]">
          {data.goals.length} activas · {formatCurrency(totalSavedForGoals)} ahorrados en total
        </p>
      </header>

      <section className="space-y-3 rounded-[22px] border border-[#ebe6db] bg-[#fcfbf8] p-4">
        {data.goals.map((goal) => {
          const percentage = getGoalPercentage(goal);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[18px] bg-[#f3f0e8] p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{goal.emoji ?? '🎯'}</span>
                    <h2 className="text-[17px] font-semibold text-[#24211d]">{goal.name}</h2>
                  </div>
                  <p className="mt-1 text-[13px] text-[#6f695d]">{formatGoalDeadline(goal.deadline)}</p>
                </div>
                <span className="rounded-full bg-[#eef6eb] px-2.5 py-1 text-[13px] font-semibold text-[#568a32]">
                  {percentage}%
                </span>
              </div>

              <div className="mb-3 h-2 rounded-full bg-[#e9e3d9]">
                <div
                  className="h-2 rounded-full bg-[#6d9e2d]"
                  style={{ width: `${Math.max(8, percentage)}%` }}
                />
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-3 text-[14px] text-[#3b3832]">
                <p>
                  {formatCurrency(goal.savedAmount)} de {formatCurrency(goal.targetAmount)}
                </p>
                <p className="font-medium text-[#4f8441]">+{formatCurrency(goal.monthlyContribution)}/mes</p>
              </div>

              <div className="mt-3 flex gap-2">
                {[50, 100].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => addMoneyToGoal(goal.id, amount)}
                    className="rounded-full border border-[#ddd5c6] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#4f4b43]"
                  >
                    +{formatCurrency(amount)}
                  </button>
                ))}
              </div>
            </motion.div>
          );
        })}
      </section>

      <section className="rounded-[22px] border border-[#ecd9b4] bg-[#f8ead0] p-4">
        <div className="mb-3 flex items-center gap-2 text-[#835f16]">
          <Sparkles size={18} />
          <h2 className="text-[14px] font-bold">Simulador IA</h2>
        </div>

        <p className="text-[14px] leading-6 text-[#714f12]">
          {simulation?.message ?? 'Crea una meta para probar cómo se acelera con ahorro extra.'}
        </p>

        <div className="mt-4 flex gap-2">
          {quickExtras.map((amount) => (
            <button
              key={amount}
              type="button"
              onClick={() => setExtraSaving(amount)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition ${
                extraSaving === amount
                  ? 'bg-[#5b4bc4] text-white'
                  : 'bg-white/80 text-[#664f1d]'
              }`}
            >
              +{formatCurrency(amount)}/mes
            </button>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={() => setIsAdding(true)}
        className="mx-auto flex items-center gap-2 rounded-full border border-[#d8d2c8] bg-white px-5 py-3 text-[15px] font-semibold text-[#2f2b27] shadow-sm"
      >
        <Plus size={18} />
        Nueva meta
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
                <Target size={18} />
                <h2 className="text-[18px] font-semibold">Crear meta</h2>
              </div>

              <form onSubmit={submitGoal} className="space-y-3">
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  placeholder="Ej. Curso, viaje, celular"
                  className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                />

                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.targetAmount}
                    onChange={(event) => setForm((prev) => ({ ...prev, targetAmount: event.target.value }))}
                    placeholder="Meta total"
                    className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                  />
                  <input
                    type="number"
                    min="0"
                    required
                    value={form.monthlyContribution}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, monthlyContribution: event.target.value }))
                    }
                    placeholder="Ahorro mensual"
                    className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                  />
                </div>

                <input
                  type="date"
                  required
                  value={form.deadline}
                  onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))}
                  className="w-full rounded-[18px] border border-[#e5dfd5] bg-[#f7f4ed] px-4 py-3 outline-none transition focus:border-[#cfc6ff]"
                />

                <div className="grid grid-cols-3 gap-2">
                  {emojiOptions.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, emoji }))}
                      className={`rounded-[16px] border px-3 py-3 text-xl transition ${
                        form.emoji === emoji
                          ? 'border-[#cfc6ff] bg-[#efeaff]'
                          : 'border-[#e5dfd5] bg-[#f7f4ed]'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button
                  type="submit"
                  className="w-full rounded-[18px] bg-[#5b4bc4] px-4 py-3 text-[15px] font-semibold text-white shadow-[0_14px_26px_rgba(91,75,196,0.24)]"
                >
                  Guardar meta
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Goals;
