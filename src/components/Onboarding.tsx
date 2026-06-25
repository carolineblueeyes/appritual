import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, ChevronRight, Play, Compass, Award, Waves, Zap, Eye, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [screen, setScreen] = useState<0 | 1 | 2 | 3>(0);

  // Auto transition from Screen 0 (Logo Splash) to Screen 1 (Login) after 1.5 seconds
  useEffect(() => {
    if (screen === 0) {
      const timer = setTimeout(() => {
        setScreen(1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [screen]);

  return (
    <div className="fixed inset-0 bg-[#070914] z-55 flex flex-col items-center justify-center p-6 text-center select-none overflow-y-auto pointer-events-auto">
      
      <AnimatePresence mode="wait">
        {screen === 0 && (
          <motion.div 
            key="splash"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            {/* Minimalist central spark geometric icon */}
            <div className="w-[100px] h-[100px] rounded-full border border-white/10 bg-white/5 flex items-center justify-center relative shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <Compass className="w-12 h-12 text-[#E6B85C] animate-spin-slow" />
              <div className="absolute inset-0 rounded-full border border-amber-400/20 blur-sm pointer-events-none" />
            </div>

            <h1 className="text-3xl font-extrabold tracking-widest text-white uppercase font-mono">
              R I T U A L
            </h1>
            <span className="text-xs tracking-wider uppercase font-mono text-white/30">Attention Recovery</span>
        </motion.div>
      )}

      {screen === 1 && (
        <motion.div 
          key="signin"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center space-y-6 max-w-sm"
        >
          <div className="w-16 h-16 rounded-full border border-white/15 bg-white/5 flex items-center justify-center relative mb-4">
            <Compass className="w-7 h-7 text-[#E6B85C]" />
          </div>

          <div className="flex flex-col space-y-2">
            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">Все начинается с тебя</h2>
            <p className="text-xs text-white/50 leading-relaxed font-sans max-w-[280px] mx-auto">
              Добро пожаловать в пространство возврата внимания к себе. Ограничь шум, восстанови силы.
            </p>
          </div>

          <div className="w-full space-y-3 pt-6">
            <button 
              onClick={() => setScreen(2)}
              className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs active:scale-95 transition shadow-lg shadow-white/10 flex items-center justify-center space-x-2"
            >
              <span>Войти через Apple (iOS)</span>
            </button>

            <button 
              onClick={() => setScreen(2)}
              className="w-full py-3.5 rounded-full bg-white/10 text-white font-semibold text-xs active:scale-95 transition flex items-center justify-center space-x-2 border border-white/5"
            >
              <span>Войти через Google (Android)</span>
            </button>
          </div>

          <span className="text-[9px] font-mono text-white/20 pt-6">
            Входя в пространство, вы соглашаетесь с условиями хранения данных
          </span>
        </motion.div>
      )}

      {screen === 2 && (
        <motion.div 
          key="features"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center space-y-5 max-w-md w-full pt-6 pb-6"
        >
          <div className="flex flex-col space-y-1 select-none">
            <span className="text-[9px] font-mono uppercase text-[#E6B85C] tracking-widest">Аудиты Внимания</span>
            <h2 className="text-xl font-bold text-white leading-tight">Возьми контроль внимания</h2>
          </div>

          <p className="text-xs text-white/50 leading-relaxed font-sans px-4">
            Мир перегружен уведомлениями, суетой и чужими целями. Ritual создан для того, чтобы вернуть тебе контроль над вниманием.
          </p>

          {/* Cards of explainer */}
          <div className="grid grid-cols-2 gap-3 w-full px-2" id="explainer_grid">
            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left flex flex-col justify-between h-[130px]">
              <Waves className="w-5 h-5 text-cyan-400" />
              <div>
                <h4 className="text-xs font-semibold text-white">🧠 Сияние</h4>
                <p className="text-[10px] text-white/40 mt-1 leading-snug line-clamp-2">Состояние тела по ВСР и пульсу</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left flex flex-col justify-between h-[130px]">
              <Compass className="w-5 h-5 text-[#E6B85C]" />
              <div>
                <h4 className="text-xs font-semibold text-white">🎤 Голос</h4>
                <p className="text-[10px] text-white/40 mt-1 leading-snug line-clamp-2">Голосовой Navigator подберет ритуал</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left flex flex-col justify-between h-[130px]">
              <Zap className="w-5 h-5 text-[#E67E22]" />
              <div>
                <h4 className="text-xs font-semibold text-white">📚 Практики</h4>
                <p className="text-[10px] text-white/40 mt-1 leading-snug line-clamp-2">Дыхание, движение, фокус, покой</p>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border border-white/[0.06] rounded-2xl text-left flex flex-col justify-between h-[130px]">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <div>
                <h4 className="text-xs font-semibold text-white">💎 Кристалл</h4>
                <p className="text-[10px] text-white/40 mt-1 leading-snug line-clamp-2">Твой прогресс обретает форму</p>
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-cyan-950/20 border border-cyan-500/10 flex items-center justify-center space-x-1.5 w-[240px]">
            <span className="text-[9px] text-[#A8D5E5] tracking-wide font-sans font-medium">
              Основано на научных исследованиях
            </span>
          </div>

          <button 
            onClick={() => setScreen(3)}
            className="w-full max-w-xs py-3.5 rounded-full bg-white text-black font-semibold text-xs active:scale-95 transition shadow-lg shadow-white/10 flex items-center justify-center space-x-1"
          >
            <span>Далее</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {screen === 3 && (
        <motion.div 
          key="start"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center space-y-6 max-w-md w-full pt-4"
        >
          <div className="w-16 h-16 rounded-full border border-[#E6B85C]/15 bg-[#E6B85C]/5 flex items-center justify-center relative mb-2">
            <Compass className="w-7 h-7 text-[#E6B85C]" />
          </div>

          <div className="flex flex-col space-y-1">
            <span className="text-[9px] font-mono uppercase text-[#E6B85C] tracking-widest">Твой первый шаг</span>
            <h2 className="text-2xl font-bold text-white tracking-tight leading-snug">Глава 1: Исток</h2>
          </div>

          <p className="text-xs text-white/50 leading-relaxed font-sans px-6 max-w-[340px]">
            Это трансформирующее путешествие, которое сменит фокус с внешнего шума на внутренний рост, усовершенствовав твои ценности. Прояви первый очерк Кристалла Истока.
          </p>

          <button 
            onClick={onComplete}
            className="w-full max-w-xs py-3.5 rounded-full bg-gradient-to-r from-amber-400 to-[#E6B85C] text-black font-bold text-sm active:scale-95 transition shadow-lg shadow-amber-500/10"
          >
            Начать путь
          </button>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
}
