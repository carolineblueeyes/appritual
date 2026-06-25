import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, Cpu, Check, Package, X } from 'lucide-react';

interface RingCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectRing: () => void;
}

export default function RingCustomizer({
  isOpen,
  onClose,
  onConnectRing
}: RingCustomizerProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [coating, setCoating] = useState<'Matte Black' | 'Glow Obsidian'>('Glow Obsidian');
  const [engraving, setEngraving] = useState('');
  const [engravingProcessing, setEngravingProcessing] = useState(false);

  const handleNext = () => {
    if (step === 3 && engraving.trim() !== '') {
      setEngravingProcessing(true);
      setTimeout(() => {
        setEngravingProcessing(false);
        setStep(4);
      }, 1500); // simulated laser burn
    } else {
      setStep((step + 1) as any);
    }
  };

  const handlePrev = () => {
    setStep((step - 1) as any);
  };

  const handleCheckout = () => {
    onConnectRing();
    alert("Заказ оформлен!\nВам отправлен Sizing Kit курьером для выбора точного размера.\nВ течение 24 часов вы сможете подтвердить размер 6–13 в приложении.");
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-auto">
          {/* Main frame container */}
          <div className="w-full max-w-lg bg-[#070914] border border-white/10 rounded-[32px] p-6 flex flex-col space-y-5 relative my-8">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              Закрыть
            </button>

            {/* Step 1: Landing Hook */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center text-center space-y-5 pt-4"
              >
                {/* 3D simulated ring representation */}
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <div className="absolute w-36 h-32 bg-cyan-500/20 blur-3xl rounded-full" />
                  
                  {/* Rotating CSS ring visualizer */}
                  <motion.div 
                    animate={{ rotateY: 360 }}
                    transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                    className="w-32 h-32 rounded-full border-[10px] border-slate-700 shadow-[0_0_20px_rgba(255,255,255,0.15)] flex items-center justify-center relative"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <div className="absolute w-full h-[6px] bg-cyan-400/50" />
                    <div className="absolute w-3 h-3 bg-cyan-400 rounded-full right-1 select-none" />
                  </motion.div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] font-mono text-[#A8D5E5] tracking-widest uppercase">Ritual Core</span>
                  <h2 className="text-2xl font-bold text-white tracking-tight leading-tight">
                    Все начинается с тебя.<br/>Верни внимание к себе
                  </h2>
                </div>

                <p className="text-xs text-white/50 leading-relaxed font-sans max-w-[340px]">
                  Умные трекеры крадут твое внимание уведомлениями и заставляют платить за собственные данные. Ritual Core возвращает тебя в тишину и принадлежит только тебе. Навсегда.
                </p>

                <div className="w-full pt-4">
                  <button 
                    onClick={handleNext}
                    className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#A8D5E5] to-cyan-500 text-black font-semibold text-sm active:scale-95 transition shadow-lg shadow-cyan-500/10 flex items-center justify-center space-x-2"
                  >
                    <span>Сковать свой Артефакт</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <p className="text-[10px] text-white/20 mt-2 font-mono">14 900 ₽ • 1 год Ritual Plus включен</p>
                </div>
              </motion.div>
            )}

            {/* Step 2: Coating Selection */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center space-x-2 text-white/40 text-[10px] font-mono">
                  <button onClick={handlePrev} className="hover:text-white flex items-center space-x-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> <span>Назад</span>
                  </button>
                  <span>/ Шаг 2 из 4</span>
                </div>

                <h3 className="text-lg font-semibold text-white/95 leading-tight">Выбор оболочки</h3>

                {/* Material ring preview */}
                <div className="w-full h-40 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-center relative">
                  <div className={`w-28 h-28 rounded-full border-[12px] shadow-[0_0_25px_rgba(255,255,255,0.1)] transition ${coating === 'Glow Obsidian' ? 'border-slate-900 bg-slate-950 shadow-cyan-300/10' : 'border-neutral-700 bg-neutral-800'}`} />
                  <span className="absolute bottom-2 text-[9px] uppercase tracking-wider font-mono text-white/40">{coating}</span>
                </div>

                <div className="grid grid-cols-2 gap-3" id="material_select_grid">
                  <button 
                    onClick={() => setCoating('Glow Obsidian')}
                    className={`p-4 rounded-xl border text-left flex flex-col space-y-1 transition ${coating === 'Glow Obsidian' ? 'border-[#A8D5E5] bg-white/5' : 'border-white/5 bg-white/[0.01]'}`}
                  >
                    <span className="text-xs font-semibold text-white">Glow Obsidian</span>
                    <span className="text-[10px] text-white/40 font-sans leading-tight">Глянцевая Керамика</span>
                  </button>

                  <button 
                    onClick={() => setCoating('Matte Black')}
                    className={`p-4 rounded-xl border text-left flex flex-col space-y-1 transition ${coating === 'Matte Black' ? 'border-[#A8D5E5] bg-white/5' : 'border-white/5 bg-white/[0.01]'}`}
                  >
                    <span className="text-xs font-semibold text-white">Matte Titanium</span>
                    <span className="text-[10px] text-white/40 font-sans leading-tight font-sans">Матовый Титан</span>
                  </button>
                </div>

                <button 
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs transition active:scale-95 flex items-center justify-center space-x-1"
                >
                  <span>Перейти к гравировке</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {/* Step 3: Engraving Code */}
            {step === 3 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center space-x-2 text-white/40 text-[10px] font-mono">
                  <button onClick={handlePrev} className="hover:text-white flex items-center space-x-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> <span>Назад</span>
                  </button>
                  <span>/ Шаг 3 из 4</span>
                </div>

                <h3 className="text-lg font-semibold text-white/95 leading-tight">Нанесение Кода</h3>

                <p className="text-xs text-white/50 leading-relaxed font-sans">
                  Высечь слово-якорь на внутренней грани. Лазер нанесёт индивидуальный шифр, который будет тихо соприкасаться с твоей кожей.
                </p>

                {/* Laser burn simulated preview area */}
                <div className="w-full h-36 bg-black/40 border border-white/5 rounded-2xl flex items-center justify-center relative overflow-hidden">
                  {engravingProcessing ? (
                    <div className="flex flex-col items-center space-y-2">
                      <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest animate-pulse">Лазерная сборка...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="text-white/20 text-[10px] font-mono uppercase mb-2">Внутренняя грань</span>
                      <span className="text-lg font-mono text-amber-300 font-bold tracking-widest uppercase animate-pulse">
                        {engraving ? `... ${engraving} ...` : 'Я НОМЕР 1'}
                      </span>
                    </div>
                  )}
                </div>

                <input 
                  type="text" 
                  maxLength={12}
                  placeholder="Введи промокод-якорь (до 12 символов)"
                  value={engraving}
                  onChange={(e) => setEngraving(e.target.value.toUpperCase())}
                  className="w-full h-11 bg-white/5 border border-white/5 rounded-xl px-4 text-xs font-mono text-white placeholder-white/20 select-text outline-none text-center"
                />

                <button 
                  onClick={handleNext}
                  className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs transition active:scale-95 flex items-center justify-center space-x-1"
                >
                  <span>Завершить конфигурацию</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            )}

            {/* Step 4: Summary checkout */}
            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col space-y-4"
              >
                <div className="flex items-center space-x-2 text-white/40 text-[10px] font-mono">
                  <button onClick={handlePrev} className="hover:text-white flex items-center space-x-1">
                    <ArrowLeft className="w-3.5 h-3.5" /> <span>Назад</span>
                  </button>
                  <span>/ Итоги конфигурации</span>
                </div>

                <h3 className="text-lg font-semibold text-white/95 leading-tight">Конфигурация завершена</h3>

                {/* Configuration Summary details */}
                <div className="p-5 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex flex-col space-y-3 font-sans">
                  <div className="text-[10px] text-white/30 font-mono tracking-widest uppercase">Твой индивидуальный Ritual Core №073:</div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">База</span>
                    <span className="text-white font-medium">{coating === 'Glow Obsidian' ? 'Obsidian Ceramic' : 'Matte Titanium'}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/60">Гравировка</span>
                    <span className="text-amber-300 font-mono font-bold tracking-wider">{engraving ? `«${engraving}»` : '«Я НОМЕР 1»'}</span>
                  </div>

                  <div className="flex justify-between items-center text-xs border-t border-white/5 pt-2">
                    <span className="text-white/60">Экосистема</span>
                    <span className="text-white font-medium">1 год подписки Ritual Plus включен</span>
                  </div>

                  <div className="flex justify-between items-center text-sm font-bold border-t border-white/10 pt-3">
                    <span className="text-white">Итого:</span>
                    <span className="text-[#A8D5E5] font-mono">14 900 ₽</span>
                  </div>
                </div>

                {/* Sizing Kit Delivery info logic */}
                <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/15 flex flex-col space-y-2">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span className="text-xs font-semibold text-white leading-tight">Доставка через Sizing Kit</span>
                  </div>
                  <p className="text-[10px] text-white/60 font-sans leading-relaxed">
                    Для точного подбора вы сначала получите курьером пластиковый набор-пустышку Sizing Kit. Поносите кольцо-пустышку 24 часа, выберите идеальный размер в приложении, и мы выгравируем его и вышлем финальный Артефакт!
                  </p>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-[#A8D5E5] to-cyan-500 text-black font-semibold text-sm transition active:scale-95 shadow-lg shadow-cyan-300/10"
                >
                  Забронировать Артефакт из первой партии
                </button>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
