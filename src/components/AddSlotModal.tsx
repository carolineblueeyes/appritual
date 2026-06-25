import { useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Clock, X } from 'lucide-react';
import { Practice } from '../types';

interface AddSlotModalProps {
  practices: Practice[];
  onConfirm: (time: string, practice: Practice) => void;
  onCancel: () => void;
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

function TimePicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [h, m] = value.split(':');
  const hoursRef = useRef<HTMLDivElement>(null);
  const minsRef = useRef<HTMLDivElement>(null);

  const scrollTo = (ref: React.RefObject<HTMLDivElement | null>, val: string, items: string[]) => {
    const idx = items.indexOf(val);
    if (idx >= 0 && ref.current) {
      ref.current.scrollTo({ top: idx * 36, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollTo(hoursRef, h, HOURS);
    scrollTo(minsRef, m, MINUTES);
  }, []);

  const handleScroll = (ref: React.RefObject<HTMLDivElement | null>, items: string[], isHours: boolean) => {
    if (!ref.current) return;
    const idx = Math.round(ref.current.scrollTop / 36);
    const clamped = Math.max(0, Math.min(idx, items.length - 1));
    const val = items[clamped];
    if (isHours) {
      onChange(`${val}:${m}`);
    } else {
      onChange(`${h}:${val}`);
    }
  };

  const now = new Date();
  const defaultH = String(now.getHours()).padStart(2, '0');
  const defaultM = String(Math.ceil(now.getMinutes() / 5) * 5 % 60).padStart(2, '0');

  useEffect(() => {
    if (value === '18:00') {
      onChange(`${defaultH}:${defaultM}`);
    }
  }, []);

  return (
    <div className="flex items-center justify-center space-x-4 py-8">
      <div className="relative w-20 h-[180px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#070913] via-transparent to-[#070913]" />
        <div
          ref={hoursRef}
          className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
          onScroll={() => handleScroll(hoursRef, HOURS, true)}
        >
          <div className="h-[72px]" />
          {HOURS.map(hh => (
            <div key={hh} className="h-9 snap-start flex items-center justify-center">
              <span className={`text-2xl font-sans font-bold transition-colors ${hh === h ? 'text-white' : 'text-white/20'}`}>
                {hh}
              </span>
            </div>
          ))}
          <div className="h-[72px]" />
        </div>
      </div>

      <span className="text-2xl font-sans font-bold text-white/60">:</span>

      <div className="relative w-20 h-[180px] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none z-10 bg-gradient-to-b from-[#070913] via-transparent to-[#070913]" />
        <div
          ref={minsRef}
          className="h-full overflow-y-auto snap-y snap-mandatory scrollbar-none"
          onScroll={() => handleScroll(minsRef, MINUTES, false)}
        >
          <div className="h-[72px]" />
          {MINUTES.map(mm => (
            <div key={mm} className="h-9 snap-start flex items-center justify-center">
              <span className={`text-2xl font-sans font-bold transition-colors ${mm === m ? 'text-white' : 'text-white/20'}`}>
                {mm}
              </span>
            </div>
          ))}
          <div className="h-[72px]" />
        </div>
      </div>
    </div>
  );
}

const GROUP_COLORS: Record<string, string> = {
  Исток: '#E6B85C',
  Тишина: '#8899AA',
  Энергия: '#D4875E',
  Ясность: '#8AB4C8',
};

const GROUP_GRADIENTS: Record<string, string> = {
  Исток: 'radial-gradient(circle at 30% 30%, #E6B85C 0%, #C4983C 40%, #A4781C 100%)',
  Тишина: 'radial-gradient(circle at 30% 30%, #8899AA 0%, #6A7B8C 40%, #4A5B6C 100%)',
  Энергия: 'radial-gradient(circle at 30% 30%, #D4875E 0%, #B4673E 40%, #94471E 100%)',
  Ясность: 'radial-gradient(circle at 30% 30%, #8AB4C8 0%, #6A94A8 40%, #4A7488 100%)',
};

function PracticePicker({ practices, selected, onSelect }: {
  practices: Practice[];
  selected: Practice | null;
  onSelect: (p: Practice) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActive = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>('[data-prac-idx]');
    const center = container.scrollLeft + container.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach(card => {
      const idx = parseInt(card.dataset.pracIdx || '0', 10);
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - center);
      if (dist < closestDist) { closestDist = dist; closest = idx; }
    });
    setActiveIndex(closest);
    onSelect(practices[closest]);
  }, [practices, onSelect]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
    return () => container.removeEventListener('scroll', updateActive);
  }, [updateActive]);

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex overflow-x-auto no-scrollbar py-4 px-[calc(50%-70px)] snap-x snap-mandatory"
        style={{
          perspective: '1000px',
          maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        }}
      >
        {practices.map((p, idx) => {
          const diff = Math.abs(idx - activeIndex);
          const scale = diff === 0 ? 1 : diff === 1 ? 0.82 : 0.65;
          const opacity = diff === 0 ? 1 : diff === 1 ? 0.5 : 0.12;
          const rotateY = idx === activeIndex ? 0 : idx < activeIndex ? -18 : 18;
          const color = GROUP_COLORS[p.group] || '#888';

          return (
            <motion.div
              key={p.id}
              data-prac-idx={idx}
              onClick={() => onSelect(p)}
              animate={{ scale, opacity, rotateY }}
              transition={{ type: 'spring', stiffness: 400, damping: 35, mass: 0.8 }}
              className="relative flex-shrink-0 w-[140px] min-h-[170px] mx-2 cursor-pointer select-none snap-center"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className="absolute inset-0 rounded-[24px] overflow-hidden"
                style={{ background: GROUP_GRADIENTS[p.group] || GROUP_GRADIENTS.Исток, opacity: 0.15 }}
              />
              <div
                className="absolute -top-4 -left-4 w-32 h-32 rounded-full blur-2xl pointer-events-none"
                style={{ background: `radial-gradient(circle at center, ${color}40 0%, transparent 70%)` }}
              />
              <div className="relative z-10 h-full flex flex-col justify-between p-4 rounded-[24px] border border-white/[0.06] backdrop-blur-[12px]"
                style={{ background: 'rgba(255,255,255,0.02)' }}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg leading-none">{p.group === 'Исток' ? '✦' : p.group === 'Тишина' ? '◈' : p.group === 'Энергия' ? '◉' : '◇'}</span>
                    <span className="text-[7px] font-mono uppercase tracking-[0.2em] text-white/20">
                      {p.duration}
                    </span>
                  </div>
                  <h4 className="text-sm font-display font-medium text-white/90 mb-1 leading-tight">
                    {p.name}
                  </h4>
                  <p className="text-[9px] font-editorial italic text-white/30 leading-relaxed line-clamp-2">
                    {p.category}
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="w-5 h-[1px]" style={{ background: color }} />
                  <span className="text-[7px] font-mono uppercase tracking-[0.15em] text-white/25">
                    {selected?.id === p.id ? 'Выбрано' : 'Выбрать'}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-2">
        {practices.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => {
              const container = containerRef.current;
              const card = container?.querySelector<HTMLElement>(`[data-prac-idx="${idx}"]`);
              card?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: idx === activeIndex ? 20 : 5,
              height: 5,
              background: idx === activeIndex ? GROUP_COLORS[p.group] || '#E6B85C' : 'rgba(255,255,255,0.15)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function AddSlotModal({ practices, onConfirm, onCancel }: AddSlotModalProps) {
  const [step, setStep] = useState<'time' | 'practice'>('time');
  const [time, setTime] = useState('18:00');
  const [selectedPractice, setSelectedPractice] = useState<Practice | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 35 }}
        className="w-full max-w-sm bg-[#070913f0] border border-white/10 backdrop-blur-3xl rounded-[35px] shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white/40" />
            <span className="text-sm font-semibold text-white/90">
              {step === 'time' ? 'Выберите время' : 'Выберите практику'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full transition-colors ${step === 'time' ? 'bg-[#E6B85C]' : 'bg-white/20'}`} />
              <div className={`w-2 h-2 rounded-full transition-colors ${step === 'practice' ? 'bg-[#E6B85C]' : 'bg-white/20'}`} />
            </div>
            <button
              onClick={onCancel}
              className="w-7 h-7 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Step 1: Time */}
        {step === 'time' && (
          <div className="px-6 pb-6">
            <TimePicker value={time} onChange={setTime} />
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => setStep('practice')}
              className="w-full py-3 rounded-2xl bg-white/10 text-white font-semibold text-sm hover:bg-white/15 transition-all"
            >
              Далее
            </motion.button>
          </div>
        )}

        {/* Step 2: Practice */}
        {step === 'practice' && (
          <div className="pb-6">
            <div className="text-center text-xs text-white/30 font-mono mb-2 px-6">
              {time} · Выберите ритуал
            </div>
            <PracticePicker practices={practices} selected={selectedPractice} onSelect={setSelectedPractice} />
            <div className="flex space-x-3 px-6 mt-4">
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => setStep('time')}
                className="flex-1 py-3 rounded-2xl border border-white/10 text-white/60 font-semibold text-sm hover:bg-white/5 transition-all"
              >
                Назад
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (selectedPractice) onConfirm(time, selectedPractice);
                }}
                className={`flex-1 py-3 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center space-x-2 ${
                  selectedPractice
                    ? 'bg-white/10 text-white hover:bg-white/15'
                    : 'bg-white/[0.04] text-white/30'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>OK</span>
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
