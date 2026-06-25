import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, X, MessageSquare, ArrowRight, Play, Compass, Check, Sparkles } from 'lucide-react';
import { NavigatorRecomendation, EmotionPreset, Practice, HealthState } from '../types';
import { ALL_PRACTICES } from '../data';
import { EMOTION_PRESETS } from '../data/emotions';

interface NavigatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyRecommendation: (rec: any) => void;
  onStartPractice?: (practice: Practice) => void;
}

const stateColors: Record<HealthState, string> = {
  Shining: 'bg-emerald-500',
  Balance: 'bg-amber-400',
  Tension: 'bg-orange-400',
  Overload: 'bg-rose-400',
  NoData: 'bg-gray-500'
};

export default function NavigatorModal({
  isOpen,
  onClose,
  onApplyRecommendation,
  onStartPractice
}: NavigatorModalProps) {
  const [view, setView] = useState<'emotions' | 'recording' | 'loading' | 'result'>('emotions');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordTimer, setRecordTimer] = useState(0);
  const [recommendation, setRecommendation] = useState<NavigatorRecomendation | null>(null);
  const [selectedEmotion, setSelectedEmotion] = useState<EmotionPreset | null>(null);

  const getPracticeById = (id: string): Practice | undefined => {
    return ALL_PRACTICES.find(p => p.id === id) || 
           ALL_PRACTICES.find(p => p.id === 'physio-sigh');
  };

  const buildRecommendationFromEmotion = (emotion: EmotionPreset): NavigatorRecomendation => {
    const practice = getPracticeById(emotion.practiceId);
    const fallbackPractice = ALL_PRACTICES.find(p => p.id === 'physio-sigh')!;
    const p = practice || fallbackPractice;

    const reasonMap: Record<string, string> = {
      'anxiety': 'Вегетативная система в режиме «бей или беги». Требуется заземление через сенсорный сброс.',
      'irritation': 'Симпатическая система перегрета. Квадратное дыхание восстановит баланс.',
      'tired': 'Низкая вариабельность ритма сердца. Требуется мягкая активация блуждающего нерва.',
      'apathy': 'Энергетический ресурс на нуле. Нужно мягкое пробуждение через движение и дыхание.',
      'fog': 'Префронтальная кора перегружена. Движение глаз сбросит лишнюю нейронную активность.',
      'calm': 'Вегетативная система в гармонии. Идеальный момент для углубления практики.',
      'energetic': 'Высокий ресурс и готовность. Направь энергию в структурированное намерение.',
      'focus': 'Уровень дофамина и норадреналина оптимален для глубокой работы.',
      'need_pause': 'Накоплено микро-напряжение. Трёхминутная пауза перезапустит вегетативную систему.',
      'sleepy': 'Циркадный ритм требует перехода в парасимпатику. Вечерний дневник подготовит ко сну.'
    };

    return {
      state: emotion.healthState,
      phrase: emotion.label,
      reason: reasonMap[emotion.id] || `${emotion.description}. Подобран ритуал для гармонизации состояния.`,
      ritualName: p.name,
      ritualGroup: p.group,
      duration: p.duration,
      instructions: p.howItWorks || `Практика "${p.name}" поможет мягко войти в нужное состояние.`
    };
  };

  const handleEmotionSelect = (emotion: EmotionPreset) => {
    setSelectedEmotion(emotion);
    const rec = buildRecommendationFromEmotion(emotion);
    setRecommendation(rec);
    setView('result');
  };

  const handleApply = () => {
    if (recommendation) {
      onApplyRecommendation(recommendation);
      onClose();
    }
  };

  const handleStartDirectly = () => {
    if (recommendation) {
      const practice = getPracticeById(selectedEmotion?.practiceId || '');
      if (practice && onStartPractice) {
        onStartPractice(practice);
        onClose();
      } else {
        handleApply();
      }
    }
  };

  const handleBackToEmotions = () => {
    setView('emotions');
    setRecommendation(null);
    setSelectedEmotion(null);
  };

  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordTimer(prev => {
          if (prev >= 10) {
            setIsRecording(false);
            handleSubmitSimulatedVoice();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      setRecordTimer(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const startVoiceRecording = () => {
    setIsRecording(true);
    setView('recording');
    setRecommendation(null);
    setSelectedEmotion(null);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    handleSubmitSimulatedVoice();
  };

  const handleSubmitSimulatedVoice = () => {
    setView('loading');
    const sampleMoods = [
      "Я перегружен кучей сообщений из чата, постоянно гудит голова весной",
      "Чувствую сильную усталость и тяжесть, тяжело проснуться утром",
      "Присутствует фоновое напряжение, нужно срочно сосредоточиться на рабочей задаче",
      "Внутри спокойная гармония, просто хочу подышать перед сном"
    ];
    const chosen = sampleMoods[Math.floor(Math.random() * sampleMoods.length)];
    setTextInput(chosen);
    triggerAINavigation(chosen);
  };

  const triggerAINavigation = async (promptText: string) => {
    if (!promptText || promptText.trim() === "") return;
    setView('loading');
    setRecommendation(null);

    try {
      const response = await fetch('/api/ai-navigator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      if (!response.ok) {
        throw new Error("API Navigator failed");
      }

      const data = await response.json();
      setRecommendation(data);
      setView('result');
    } catch (e) {
      console.error(e);
      const lower = promptText.toLowerCase();
      let matchedEmotion: EmotionPreset | null = null;
      if (lower.includes('тревог') || lower.includes('страх') || lower.includes('волн')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'anxiety')!;
      } else if (lower.includes('устал') || lower.includes('нет сил') || lower.includes('тяжел')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'tired')!;
      } else if (lower.includes('раздраж') || lower.includes('бесит') || lower.includes('злость')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'irritation')!;
      } else if (lower.includes('фокус') || lower.includes('сосредоточ') || lower.includes('работа')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'focus')!;
      } else if (lower.includes('спокойн') || lower.includes('гармон') || lower.includes('тишин')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'calm')!;
      } else if (lower.includes('апат') || lower.includes('пустот') || lower.includes('всё равно')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'apathy')!;
      } else if (lower.includes('сон') || lower.includes('спать') || lower.includes('ночь')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'sleepy')!;
      } else if (lower.includes('энерг') || lower.includes('бодр') || lower.includes('утро')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'energetic')!;
      } else if (lower.includes('пауз') || lower.includes('отдых') || lower.includes('передыш')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'need_pause')!;
      } else if (lower.includes('туман') || lower.includes('голова') || lower.includes('ясность')) {
        matchedEmotion = EMOTION_PRESETS.find(e => e.id === 'fog')!;
      }

      if (matchedEmotion) {
        const rec = buildRecommendationFromEmotion(matchedEmotion);
        setRecommendation(rec);
        setSelectedEmotion(matchedEmotion);
      } else {
        setRecommendation({
          state: 'Tension',
          phrase: 'Напряжение',
          reason: 'Таймер ума перегружен. Требуется мягкий фокус на дыхании.',
          ritualName: 'Квадратное дыхание',
          ritualGroup: 'Исток',
          duration: '05:15',
          instructions: 'Дыши в ритме четыре счёта на каждую фазу для быстрого снятия хаоса.'
        });
      }
      setView('result');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-end justify-center pointer-events-auto">
          <div className="absolute inset-0" onClick={onClose} />

          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="w-full max-w-md bg-[#0e101cf6] border-t border-white/10 rounded-t-[32px] p-6 pb-[max(24px,env(safe-area-inset-bottom,24px))] z-50 flex flex-col space-y-5 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex justify-between items-center shrink-0">
              <div className="flex items-center space-x-2">
                <Compass className="w-5 h-5 text-[#E6B85C] animate-spin-slow" />
                <div className="flex flex-col">
                  <h3 className="text-md font-medium text-white/95">Навигатор состояний</h3>
                  <span className="text-[10px] text-white/40 tracking-wider font-mono uppercase">Подбор практики</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/50 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content area */}
            <div className="w-full bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5 min-h-[280px] relative overflow-hidden">
              <motion.div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                animate={{
                  background: view === 'recording'
                    ? "radial-gradient(ellipse at 50% 50%, rgba(245,158,11,0.1) 0%, transparent 70%)"
                    : view === 'loading'
                    ? "radial-gradient(ellipse at 50% 50%, rgba(34,211,238,0.1) 0%, transparent 70%)"
                    : view === 'result'
                    ? "radial-gradient(ellipse at 50% 50%, rgba(168,213,229,0.08) 0%, transparent 70%)"
                    : "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.04) 0%, transparent 70%)",
                }}
                transition={{ duration: 0.8 }}
              />

              <AnimatePresence mode="wait">
                {/* ===== EMOTIONS GRID ===== */}
                {view === 'emotions' && (
                  <motion.div
                    key="emotions"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="relative z-10 flex flex-col space-y-4"
                  >
                    <div className="text-center">
                      <span className="text-sm text-white/80 font-medium">Что ты чувствуешь сейчас?</span>
                      <p className="text-[10px] text-white/40 font-mono mt-0.5">Выбери состояние — получишь подходящую практику</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      {EMOTION_PRESETS.map((emotion) => (
                        <motion.button
                          key={emotion.id}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => handleEmotionSelect(emotion)}
                          className="flex flex-col items-start p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/10 active:scale-95 transition-all text-left group"
                        >
                          <div className="flex items-center space-x-2 w-full">
                            <div className={`w-2 h-2 rounded-full shrink-0 ${stateColors[emotion.healthState]}`} />
                            <span className="text-sm font-semibold text-white/90 group-hover:text-white">{emotion.label}</span>
                          </div>
                          <span className="text-[10px] text-white/40 font-mono mt-1 leading-tight">{emotion.description}</span>
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex justify-center pt-2 border-t border-white/5">
                      <button
                        onClick={startVoiceRecording}
                        className="flex items-center space-x-2 py-2 px-4 rounded-full bg-white/5 hover:bg-white/10 active:scale-95 transition text-white/60 hover:text-white/90 text-xs"
                      >
                        <Mic className="w-3.5 h-3.5" />
                        <span>Сказать голосом</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ===== RECORDING ===== */}
                {view === 'recording' && (
                  <motion.div 
                    key="recording"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-col items-center space-y-4 py-6 relative z-10"
                  >
                    <div className="relative w-32 h-32 flex items-center justify-center">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ scale: [1, 2.2, 1], opacity: [0.35, 0, 0.35] }}
                          transition={{ repeat: Infinity, duration: 2.4, delay: i * 0.7, ease: "easeOut" }}
                          className="absolute inset-0 rounded-full border border-amber-400/20"
                        />
                      ))}
                      <motion.div
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400/15 to-purple-500/15 border border-amber-400/20 flex items-center justify-center"
                      >
                        <span className="text-2xl font-bold font-mono text-amber-300">{recordTimer}</span>
                      </motion.div>
                    </div>
                    <span className="text-xs text-white/60 font-mono animate-pulse">Запись... {recordTimer}/10 сек</span>
                    <div className="flex space-x-3">
                      <button onClick={handleStopRecording} className="px-5 py-1.5 rounded-full bg-rose-500 text-white text-xs font-semibold active:scale-95 transition">Готово</button>
                      <button onClick={handleBackToEmotions} className="px-4 py-1.5 rounded-full bg-white/10 text-white/60 text-xs active:scale-95 transition">Назад</button>
                    </div>
                  </motion.div>
                )}

                {/* ===== LOADING ===== */}
                {view === 'loading' && (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center space-y-4 py-6 relative z-10"
                  >
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <motion.div className="absolute w-full h-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 3, ease: "linear" }}>
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-amber-300 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
                      </motion.div>
                      <motion.div className="absolute w-full h-full" animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>
                        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                      </motion.div>
                      <motion.div className="absolute w-full h-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-purple-300 shadow-[0_0_6px_rgba(168,85,247,0.6)]" />
                      </motion.div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/20 to-cyan-400/20 blur-md" />
                        <div className="absolute w-6 h-6 rounded-full bg-gradient-to-br from-amber-300 to-cyan-400 opacity-80" />
                      </div>
                    </div>
                    <span className="text-xs text-white/50 font-sans">Подбираю практику...</span>
                    <button onClick={handleBackToEmotions} className="text-[10px] text-white/30 hover:text-white/50 font-mono underline">Отменить</button>
                  </motion.div>
                )}

                {/* ===== RESULT ===== */}
                {view === 'result' && recommendation && (
                  <motion.div 
                    key="recommendation"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col space-y-4 relative z-10"
                  >
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 font-mono uppercase tracking-widest">
                          {selectedEmotion ? 'Выбрано состояние' : 'Анализ'}
                        </span>
                        <div className="flex items-center space-x-2 mt-0.5">
                          <div className={`w-2 h-2 rounded-full ${stateColors[recommendation.state]}`} />
                          <span className="text-sm font-semibold text-white/90">{recommendation.phrase}</span>
                        </div>
                      </div>
                      <span className="flex items-center space-x-1.5 text-[10px] bg-white/10 px-2 py-0.5 rounded-full font-mono">
                        <span className={`w-1.5 h-1.5 rounded-full ${stateColors[recommendation.state]}`} />
                        <span className="text-amber-300">{recommendation.state}</span>
                      </span>
                    </div>

                    <p className="text-xs text-white/60 leading-relaxed font-sans">{recommendation.reason}</p>

                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-white/40 font-mono tracking-wider">ПРАКТИКА</span>
                        <span className="text-sm font-semibold text-white/95">{recommendation.ritualName}</span>
                        <span className="text-[9px] text-[#E6B85C] font-mono mt-0.5">{recommendation.ritualGroup} · {recommendation.duration}</span>
                      </div>
                      <div className="flex space-x-1.5">
                        <button onClick={handleStartDirectly} className="p-2.5 rounded-full bg-emerald-500 text-black active:scale-95 transition" title="Начать">
                          <Play className="w-4 h-4 fill-current stroke-[2]" />
                        </button>
                        <button onClick={handleApply} className="p-2.5 rounded-full bg-amber-400 text-black active:scale-95 transition" title="Добавить на главный">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    <p className="text-[9px] text-white/35 font-mono italic leading-relaxed">{recommendation.instructions}</p>

                    <div className="flex justify-center pt-1">
                      <button onClick={handleBackToEmotions} className="text-[10px] text-white/30 hover:text-white/50 font-mono underline">← Выбрать другое состояние</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Manual text input */}
            {(view === 'emotions' || view === 'result') && (
              <div className="flex space-x-2 shrink-0">
                <input 
                  type="text" 
                  placeholder="Опиши своё состояние текстом..."
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') triggerAINavigation(textInput); }}
                  className="flex-1 bg-white/5 border border-white/5 rounded-xl px-4 text-xs text-white placeholder-white/30 focus:outline-none focus:border-white/10 h-11"
                />
                <button 
                  onClick={() => triggerAINavigation(textInput)}
                  disabled={!textInput.trim()}
                  className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/15 active:scale-95 transition flex items-center justify-center text-white cursor-pointer disabled:opacity-45 disabled:pointer-events-none"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}