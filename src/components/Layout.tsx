import type { ReactNode } from 'react';
import { Home, MessageCircleMore, Target, WalletCards } from 'lucide-react';

export type TabId = 'dashboard' | 'transactions' | 'goals' | 'ai';

const tabs = [
  { id: 'dashboard' as const, label: 'Inicio', icon: Home },
  { id: 'transactions' as const, label: 'Gastos', icon: WalletCards },
  { id: 'goals' as const, label: 'Metas', icon: Target },
  { id: 'ai' as const, label: 'IA', icon: MessageCircleMore },
];

const screenTitles: Record<TabId, string> = {
  dashboard: 'INICIO / DASHBOARD',
  transactions: 'REGISTRO DE GASTOS',
  goals: 'METAS DE AHORRO',
  ai: 'ASESOR IA (CHAT)',
};

interface LayoutProps {
  children: ReactNode;
  activeTab: TabId;
  setTab: (tab: TabId) => void;
}

export const Layout = ({ children, activeTab, setTab }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(123,97,255,0.14),_transparent_28%),linear-gradient(180deg,_#f7f4ed_0%,_#efebe1_100%)] px-4 py-4 sm:py-8">
      <div className="mx-auto flex w-full max-w-[430px] flex-col justify-center">
        <p className="mb-3 text-center text-[13px] font-bold tracking-[0.14em] text-[#4d4a43]">
          {screenTitles[activeTab]}
        </p>

        <div className="relative rounded-[36px] border border-[#ebe6db] bg-[#f5f2ea] p-3 shadow-[0_30px_70px_rgba(89,74,135,0.12)]">
          <div className="absolute left-1/2 top-3 h-1.5 w-20 -translate-x-1/2 rounded-full bg-[#ddd7cc]" />

          <div className="relative overflow-hidden rounded-[28px] border border-[#d9d4c9] bg-[#fcfbf8]">
            <div className="flex items-center justify-between border-b border-[#e8e2d8] bg-[#eeebff] px-4 py-3 text-[15px] font-semibold text-[#48418f]">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[#48418f]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#48418f]" />
                <span className="h-1.5 w-1.5 rounded-full bg-[#48418f]" />
              </div>
            </div>

            <main className="min-h-[calc(100dvh-118px)] px-4 pb-[92px] pt-3 sm:min-h-[700px]">
              {children}
            </main>

            <nav className="absolute inset-x-0 bottom-0 border-t border-[#e8e2d8] bg-[#fcfbf8]/95 px-3 py-3 backdrop-blur">
              <div className="grid grid-cols-4 gap-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setTab(tab.id)}
                      className="flex flex-col items-center gap-1 text-center"
                    >
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl border transition-all ${
                          isActive
                            ? 'border-[#ddd8fb] bg-[#efeaff] text-[#5a4bc3]'
                            : 'border-[#efeadf] bg-[#f4f1e9] text-[#b1aa9b]'
                        }`}
                      >
                        <Icon size={16} strokeWidth={2.3} />
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          isActive ? 'text-[#5a4bc3]' : 'text-[#5f5a52]'
                        }`}
                      >
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};
