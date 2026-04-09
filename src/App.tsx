import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Transactions from './components/Transactions';
import Goals from './components/Goals';
import Chatbot from './components/Chatbot';
import { Layout, type TabId } from './components/Layout';
import { FinanceProvider, useFinance } from './hooks/useFinance';

const AppContent = () => {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const { clearError, error } = useFinance();

  const renderTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'transactions':
        return <Transactions />;
      case 'goals':
        return <Goals />;
      case 'ai':
        return <Chatbot />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setTab={setActiveTab}>
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            className="fixed left-1/2 top-4 z-[120] w-[92%] max-w-[380px] -translate-x-1/2"
          >
            <div className="flex items-start gap-3 rounded-[20px] border border-[#ffd0d6] bg-[#ff5f74] px-4 py-3 text-white shadow-[0_18px_32px_rgba(255,95,116,0.32)]">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="flex-1 text-[14px] leading-5">{error}</p>
              <button type="button" onClick={clearError} className="rounded-full p-1 text-white/90">
                <X size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
        >
          {renderTab()}
        </motion.div>
      </AnimatePresence>
    </Layout>
  );
};

const App = () => {
  return (
    <FinanceProvider>
      <AppContent />
    </FinanceProvider>
  );
};

export default App;
