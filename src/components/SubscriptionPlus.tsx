import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, ShieldAlert, Award, Sparkles, Heart } from 'lucide-react';

interface SubscriptionPlusProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockPlus: () => void;
  alreadyPlus: boolean;
}

export default function SubscriptionPlus({
  isOpen,
  onClose,
  onUnlockPlus,
  alreadyPlus
}: SubscriptionPlusProps) {
  const [selectedPlan, setSelectedPlan] = useState<'month' | 'year'>('year');

  const handleActivate = () => {
    onUnlockPlus();
    onClose();
  };

  const PLANS = [
    { id: 'month', label: '1 месяц', price: '590 ₽', desc: 'Ежемесячное вдохновение' },
    { id: 'year', label: '1 год', price: '4 990 ₽', desc: 'Выгода 30% • 1 год полной силы в подарок' }
  ];

  const BENEFITS = [
    'Все ритуалы: полный бесконечный доступ ко всем 4 группам глав с уроками',
    'AI Персонализация: подробный учет привычек, Google Fit/Apple Health',
    'Уникальные ритуалы: безлимитные Свечение, Дыхание, Движение и Помодоро',
    'Интерактивная подборка ИИ: голосовое / текстовое программирование Navigator',
    'Умные виджеты: Кристалл, Мой фокус, Быстрый ритуал на рабочий экран',
    'Чистое пространство: полное отсутствие рекламы'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center pointer-events-auto">
          {/* Backdrop trigger */}
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-full max-w-md bg-[#0e101cf2] border-t border-white/10 rounded-t-[32px] p-6 pb-[max(24px,env(safe-area-inset-bottom,24px))] z-50 flex flex-col space-y-5"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-[#E6B85C]" />
                <h3 className="text-xl font-semibold text-white/95">Ritual Plus</h3>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 active:scale-95 flex items-center justify-center text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/60 font-sans leading-relaxed">
              Весь ритм твоей жизни — в твоём телефоне. Расширенная AI персонализация и полный доступ к пути.
            </p>

            {/* Plash: 10% to charity */}
            <div className="p-3 rounded-xl bg-[#E6B85C]/5 border border-[#E6B85C]/15 flex items-center space-x-2">
              <Heart className="w-4 h-4 text-[#E6B85C] shrink-0" />
              <span className="text-[10px] text-[#E6B85C] font-sans font-medium">
                10% чистой прибыли со всех подписок Ritual направляет на благотворительность
              </span>
            </div>

            {alreadyPlus ? (
              <div className="p-5 border border-green-500/25 bg-green-500/10 rounded-2xl text-center space-y-2">
                <span className="text-sm font-semibold text-white">Ritual Plus Активен</span>
                <p className="text-xs text-white/60">Ваша подписка полностью действительна до 12.06.2027.</p>
              </div>
            ) : (
              <>
                {/* Benefits List */}
                <div className="flex flex-col space-y-2 pt-1">
                  {BENEFITS.map((b, i) => (
                    <div key={i} className="flex items-start space-x-2 text-xs text-white/70">
                      <Check className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                      <span className="font-sans leading-tight">{b}</span>
                    </div>
                  ))}
                </div>

                {/* Plans Select Grid */}
                <div className="flex flex-col space-y-2 pt-2">
                  {PLANS.map((plan) => (
                    <div 
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id as any)}
                      className={`p-4 rounded-2xl border cursor-pointer flex justify-between items-center transition-all ${selectedPlan === plan.id ? 'border-[#E6B85C] bg-[#E6B85C]/5' : 'border-white/5 bg-white/[0.01] hover:bg-white/5'}`}
                    >
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-white/95">{plan.label}</span>
                        <span className="text-[10px] text-white/40 mt-0.5 font-sans leading-tight">{plan.desc}</span>
                      </div>
                      <span className={`text-sm font-bold font-mono ${selectedPlan === plan.id ? 'text-[#E6B85C]' : 'text-white/80'}`}>{plan.price}</span>
                    </div>
                  ))}
                </div>

                {/* Trial & Restore buttons */}
                <div className="flex flex-col space-y-3 pt-3">
                  <button 
                    onClick={handleActivate}
                    className="w-full py-3 rounded-full bg-gradient-to-r from-amber-400 to-[#E6B85C] text-black font-semibold text-sm active:scale-95 transition shadow-lg shadow-amber-500/10"
                  >
                    Начать 7 дней бесплатно
                  </button>

                  <div className="flex justify-between items-center px-1 text-[10px] font-mono text-white/30">
                    <span>Далее — {selectedPlan === 'month' ? '590 ₽ / мес' : '4 990 ₽ / год'}. Отмена в любой момент.</span>
                    <button 
                      onClick={() => {
                        // simulate restore
                        onUnlockPlus();
                        alert("Подписка Ritual Plus успешно восстановлена!");
                        onClose();
                      }}
                      className="underline text-white/60 hover:text-white"
                    >
                      Восстановить покупки
                    </button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
