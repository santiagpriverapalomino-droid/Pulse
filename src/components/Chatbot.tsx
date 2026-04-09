import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send } from 'lucide-react';
import { useFinance } from '../hooks/useFinance';
import { formatCurrency, getGoalPercentage } from '../utils/finance';
import type { ChatMessage } from '../types';

const Chatbot = () => {
  const {
    activeGoal,
    availableBalance,
    currentMonthSpent,
    data,
    generateChatResponse,
    topCategories,
  } = useFinance();

  const firstCategory = topCategories[0];
  const scrollRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const intro = `Hola ${data.userName}. Este mes llevas ${formatCurrency(currentMonthSpent)} gastados. Tu categoría más alta es ${firstCategory?.[0].toLowerCase() ?? 'gastos variables'} con ${formatCurrency(firstCategory?.[1] ?? 0)}.`;
    const plan = activeGoal
      ? `Detecté espacio para mejorar si bajas algunos gastos variables y mueves ${formatCurrency(50)} a tu meta ${activeGoal.name}. Ahora mismo va en ${getGoalPercentage(activeGoal)}% y tienes ${formatCurrency(availableBalance)} disponibles.`
      : `Si empiezas a registrar más movimientos y creas una meta, puedo armarte un plan de ahorro realista.`;

    return [
      { id: 'm1', role: 'assistant', content: intro, timestamp: Date.now() },
      { id: 'm2', role: 'user', content: '¿En qué puedo ahorrar este mes?', timestamp: Date.now() + 1 },
      { id: 'm3', role: 'assistant', content: plan, timestamp: Date.now() + 2 },
    ];
  });

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isTyping]);

  const sendMessage = (event?: React.FormEvent) => {
    event?.preventDefault();
    const question = input.trim();
    if (!question) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: generateChatResponse(question),
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 850);
  };

  const quickPrompts = [
    '¿Cómo va mi meta principal?',
    'Dame un plan para ahorrar esta semana',
    '¿Cuál es mi categoría más alta?',
  ];

  return (
    <div className="flex h-[calc(100dvh-210px)] flex-col text-[#1f1f1f] sm:h-[615px]">
      <header className="mb-3">
        <h1 className="text-[16px] font-bold leading-none">Asesor financiero</h1>
        <p className="mt-1 text-[13px] text-[#5d594f]">Basado en tus gastos reales de abril</p>
      </header>

      <div
        ref={scrollRef}
        className="flex-1 space-y-3 overflow-y-auto rounded-[22px] border border-[#ebe6db] bg-[#fcfbf8] p-3"
      >
        {messages.map((message) => {
          const isAssistant = message.role === 'assistant';

          return (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[86%] ${isAssistant ? '' : 'flex justify-end'}`}>
                {isAssistant && (
                  <div className="mb-1 flex items-center gap-2 text-[12px] font-semibold text-[#5a4bc3]">
                    <Bot size={14} />
                    <span>Asesor IA</span>
                  </div>
                )}
                <div
                  className={`rounded-[18px] px-4 py-3 text-[15px] leading-6 ${
                    isAssistant
                      ? 'bg-[#ece9ff] text-[#4b43a8]'
                      : 'bg-[#f3f0e8] text-[#2c2823]'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            </motion.div>
          );
        })}

        {isTyping && (
          <div className="max-w-[120px] rounded-[18px] bg-[#ece9ff] px-4 py-3 text-[#4b43a8]">
            <div className="flex gap-1">
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#6c62cc] [animation-delay:-0.2s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#6c62cc] [animation-delay:-0.1s]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-[#6c62cc]" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {quickPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => setInput(prompt)}
            className="rounded-full border border-[#ddd7cc] bg-white px-3 py-1.5 text-[12px] font-medium text-[#575147]"
          >
            {prompt}
          </button>
        ))}
      </div>

      <form onSubmit={sendMessage} className="mt-3 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Pregunta algo..."
          className="flex-1 rounded-[18px] border border-[#ddd7cc] bg-[#fcfbf8] px-4 py-3 text-[15px] outline-none transition focus:border-[#cfc6ff]"
        />
        <button
          type="submit"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-[#5b4bc4] text-white shadow-[0_14px_26px_rgba(91,75,196,0.24)] transition-transform active:scale-95"
          aria-label="Enviar mensaje"
        >
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
