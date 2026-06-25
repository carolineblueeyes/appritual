import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { HealthData } from '../services/HealthService';

interface HealthCardDef {
  id: string;
  icon: string;
  label: string;
  metricKey: keyof HealthData | null;
  unit: string;
  description: string;
  requiresRing: boolean;
}

interface HealthDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  healthScore: number;
  healthData: HealthData | null;
}

const HEALTH_CARD_DEFS: HealthCardDef[] = [
  { id: 'sleep', icon: '🛌', label: 'Сон', metricKey: 'sleepHours', unit: 'ч', description: 'Глубокое восстановление во время сна. Оптимальная норма — 7-9 часов.', requiresRing: false },
  { id: 'activity', icon: '🏃', label: 'Активность', metricKey: 'steps', unit: 'шагов', description: 'Дневная двигательная активность, шаги и общая подвижность.', requiresRing: false },
  { id: 'hrv', icon: '❤️', label: 'ВСР', metricKey: 'hrv', unit: 'мс', description: 'Вариабельность сердечного ритма — ключевой показатель восстановления. Высокий ВСР = гибкость нервной системы.', requiresRing: false },
  { id: 'pulse', icon: '💓', label: 'Пульс покоя', metricKey: 'heartRate', unit: 'уд/мин', description: 'Частота сердечных сокращений в покое — маркер тренированности и восстановления.', requiresRing: false },
  { id: 'respiration', icon: '🌬️', label: 'Дыхание', metricKey: 'respiratoryRate', unit: 'дых/мин', description: 'Частота дыхания в покое. 12-16 вдохов — оптимальный диапазон.', requiresRing: false },
  { id: 'spo2', icon: '💨', label: 'SpO₂', metricKey: null, unit: '%', description: 'Насыщение крови кислородом. Норма: 95-100%.', requiresRing: true },
  { id: 'temperature', icon: '🌡️', label: 'Температура', metricKey: null, unit: '°C', description: 'Базальная температура тела. Отклонения могут сигнализировать о воспалении или стрессе.', requiresRing: true },
  { id: 'energy', icon: '⚡', label: 'Энергия', metricKey: 'energyLevel', unit: '%', description: 'Субъективный уровень энергии. Зависит от сна, активности и восстановления.', requiresRing: false },
];

export default function HealthDetailsModal({ isOpen, onClose, healthScore, healthData }: HealthDetailsModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const hasData = healthData !== null;

  const resolveValue = (card: HealthCardDef): string => {
    if (!hasData || card.metricKey === null) return '—';
    const val = healthData[card.metricKey];
    if (typeof val !== 'number') return '—';
    if (card.id === 'activity') return `${(val / 1000).toFixed(1)}K`;
    if (card.id === 'sleep') return val.toFixed(1);
    if (card.id === 'hrv') return `${Math.round(val)}`;
    if (card.id === 'pulse') return `${Math.round(val)}`;
    if (card.id === 'respiration') return `${Math.round(val)}`;
    if (card.id === 'energy') return `${Math.round(val)}`;
    return String(val);
  };

  const getTrend = (card: HealthCardDef): string => {
    if (!hasData || card.metricKey === null) return '—';
    return '—';
  };

  const getStatus = (card: HealthCardDef): string => {
    if (!hasData) return 'Нет данных';
    if (card.metricKey === null) return 'Требуется кольцо';
    return 'Ок';
  };

  const getStatusColor = (card: HealthCardDef): string => {
    if (!hasData || card.metricKey === null) return '#C9A96E';
    if (card.id === 'sleep') return healthData.sleepHours >= 7 ? '#34C759' : '#FF9F0A';
    if (card.id === 'hrv') return healthData.hrv >= 50 ? '#34C759' : healthData.hrv >= 30 ? '#FF9F0A' : '#FF453A';
    return '#C9A96E';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-end justify-center pointer-events-auto">
          <div className="absolute inset-0 z-0" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="w-full max-w-md bg-[#090b14ef] border-t border-white/[0.12] rounded-t-[36px] p-6 pb-[max(24px,env(safe-area-inset-bottom,24px))] z-50 flex flex-col space-y-5 max-h-[88vh] overflow-y-auto scrollbar-none"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-mono text-teal-400">Монитор здоровья</span>
                <h3 className="text-xl font-bold text-white/95 leading-normal">Показатели здоровья</h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {HEALTH_CARD_DEFS.map((card) => {
                const isExpanded = expandedId === card.id;
                const val = resolveValue(card);
                const trend = getTrend(card);
                const status = getStatus(card);
                const statusColor = getStatusColor(card);
                return (
                  <div
                    key={card.id}
                    className={`rounded-2xl border border-white/[0.03] overflow-hidden transition-all duration-300 ${isExpanded ? 'col-span-2' : ''}`}
                    style={{ background: isExpanded ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.015)' }}
                  >
                    <div
                      onClick={() => setExpandedId(isExpanded ? null : card.id)}
                      className="p-3.5 cursor-pointer select-none"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs opacity-50">{card.icon}</span>
                        <span className={`text-[7px] font-mono tracking-wider uppercase transition-opacity ${isExpanded ? 'opacity-40' : 'opacity-20'}`}>
                          {isExpanded ? 'Свернуть' : 'Детали'}
                        </span>
                      </div>
                      <h4 className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 mb-0.5">{card.label}</h4>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-sans font-bold text-white/85">{val}</span>
                        <span className="text-[8px] font-mono text-white/20">{card.unit}</span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[8px] font-mono text-white/20">{trend}</span>
                        <span className="text-[6px] text-white/10">•</span>
                        <span className="text-[7px] text-white/15 font-editorial italic">{status}</span>
                      </div>
                    </div>

                    {card.requiresRing && hasData ? (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-3.5 pb-4 space-y-3 border-t border-white/[0.02] pt-3">
                              <p className="text-[10px] text-white/25 font-editorial italic leading-relaxed">{card.description}</p>
                              <p className="text-[9px] text-white/15 font-mono">Требуется кольцо Ritual Core</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ) : hasData && !card.requiresRing ? (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-3.5 pb-4 space-y-3 border-t border-white/[0.02] pt-3">
                              <p className="text-[10px] text-white/25 font-editorial italic leading-relaxed">{card.description}</p>
                              <p className="text-[9px] text-white/12 font-mono">Данные за неделю появятся после 7 дней синхронизации</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    ) : (
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-3.5 pb-4 space-y-3 border-t border-white/[0.02] pt-3">
                              <p className="text-[10px] text-white/25 font-editorial italic leading-relaxed">{card.description}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={onClose}
              className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-xs active:scale-98 transition mt-3"
            >
              Вернуться назад
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}