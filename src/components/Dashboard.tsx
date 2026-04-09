import { Lightbulb, Sparkles, Target, TrendingDown, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useFinance } from '../hooks/useFinance';
import { CATEGORY_COLORS, formatCurrency, formatMonthYear, getGoalPercentage } from '../utils/finance';

const SummaryCard = ({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone: 'danger' | 'success' | 'default';
}) => {
  const tones = {
    danger: 'text-[#b24f58]',
    success: 'text-[#457d31]',
    default: 'text-[#222222]',
  };

  return (
    <div className="rounded-[18px] bg-[#f3f0e8] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
      <p className="text-[13px] leading-4 text-[#4d4a43]">{title}</p>
      <p className={`mt-2 text-[19px] font-semibold leading-5 ${tones[tone]}`}>{value}</p>
    </div>
  );
};

const Dashboard = () => {
  const {
    data,
    activeGoal,
    aiTip,
    availableBalance,
    currentMonthSpent,
    daysUntilSalary,
    recommendations,
    topCategories,
  } = useFinance();

  const highestCategory = topCategories[0]?.[1] ?? 0;

  return (
    <div className="space-y-4 text-[#1f1f1f]">
      <header>
        <h1 className="text-[16px] font-bold leading-none">Hola, {data.userName}</h1>
        <p className="mt-1 text-[13px] text-[#5d594f]">
          {formatMonthYear()} · quedan {daysUntilSalary} días hasta tu cobro
        </p>
      </header>

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3"
      >
        <SummaryCard title="Gastado este mes" value={formatCurrency(currentMonthSpent)} tone="danger" />
        <SummaryCard title="Disponible" value={formatCurrency(availableBalance)} tone="success" />
        <SummaryCard title="Meta activa" value={activeGoal?.name ?? 'Crea una meta'} tone="default" />
        <SummaryCard
          title="Progreso"
          value={activeGoal ? `${getGoalPercentage(activeGoal)}%` : '0%'}
          tone="default"
        />
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="rounded-[22px] border border-[#ebe6db] bg-[#fcfbf8] p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <Wallet size={16} className="text-[#5a4bc3]" />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#47433d]">
            Resumen + mejora
          </h2>
        </div>

        <div className="space-y-3">
          {recommendations.map((item) => (
            <div key={item.title} className="rounded-[18px] bg-[#f4efe3] p-4">
              <p className="text-[14px] font-semibold text-[#624b20]">{item.title}</p>
              <p className="mt-1 text-[13px] leading-5 text-[#5b564d]">{item.text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-[22px] border border-[#ebe6db] bg-[#fcfbf8] p-4"
      >
        <div className="mb-3 flex items-center gap-2">
          <TrendingDown size={16} className="text-[#4c4235]" />
          <h2 className="text-[13px] font-bold uppercase tracking-[0.08em] text-[#47433d]">
            Gastos por categoría
          </h2>
        </div>

        <div className="space-y-3">
          {topCategories.slice(0, 4).map(([category, amount]) => (
            <div key={category}>
              <div className="mb-1 flex items-center justify-between text-[14px]">
                <span className="text-[#403c37]">{category}</span>
                <span className="font-medium text-[#2f2d29]">{formatCurrency(amount)}</span>
              </div>
              <div className="h-2 rounded-full bg-[#ece7dd]">
                <div
                  className="h-2 rounded-full"
                  style={{
                    width: `${highestCategory ? Math.max(18, (amount / highestCategory) * 100) : 0}%`,
                    backgroundColor: CATEGORY_COLORS[category],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="rounded-[22px] border border-[#cfe5df] bg-[#dbefea] p-4"
      >
        <div className="mb-2 flex items-center gap-2 text-[#2b5d58]">
          <Lightbulb size={18} />
          <h2 className="text-[14px] font-bold">Consejo de la IA</h2>
        </div>

        <p className="text-[14px] leading-6 text-[#24514c]">{aiTip}</p>

        {activeGoal && (
          <div className="mt-4 flex items-center justify-between rounded-[18px] bg-white/65 px-4 py-3 text-[13px] text-[#375d56]">
            <div className="flex items-center gap-2">
              <Target size={15} />
              <span>{activeGoal.name}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Sparkles size={15} />
              <span>{getGoalPercentage(activeGoal)}%</span>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default Dashboard;
