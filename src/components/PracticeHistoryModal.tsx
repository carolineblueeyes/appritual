import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import type { ActivityLog } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  practiceLogs: ActivityLog[];
}

const MONTH_NAMES = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Окторябрь', 'Ноябрь', 'Декабрь'];
const DAY_HEADERS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const LEVEL_COLORS = [
  'rgba(255,255,255,0.04)',
  'rgba(201,169,110,0.18)',
  'rgba(201,169,110,0.35)',
  'rgba(201,169,110,0.55)',
  'rgba(201,169,110,0.80)',
];

function getDateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

interface MonthData {
  year: number;
  month: number;
  days: { key: string; date: number; count: number; level: number; isPadding: boolean }[];
}

export default function PracticeHistoryModal({ isOpen, onClose, practiceLogs }: Props) {
  const months = useMemo(() => {
    const dayCountByDate = new Map<string, number>();
    for (const log of practiceLogs) {
      const key = log.date.split('T')[0];
      dayCountByDate.set(key, (dayCountByDate.get(key) || 0) + 1);
    }

    const today = new Date();
    let earliest = new Date(today.getFullYear(), today.getMonth(), 1);
    for (const log of practiceLogs) {
      const d = new Date(log.date.split('T')[0]);
      if (d < earliest) earliest = d;
    }

    const months: MonthData[] = [];
    const start = new Date(earliest.getFullYear(), earliest.getMonth(), 1);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    let cur = new Date(start);
    while (cur <= end) {
      const year = cur.getFullYear();
      const month = cur.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
      const padding = firstDay === 0 ? 6 : firstDay - 1; // pad to Mon start

      const days: MonthData['days'] = [];
      for (let p = 0; p < padding; p++) {
        days.push({ key: `pad-${year}-${month}-${p}`, date: 0, count: 0, level: 0, isPadding: true });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const key = getDateKey(new Date(year, month, d));
        const count = dayCountByDate.get(key) || 0;
        days.push({ key, date: d, count, level: getLevel(count), isPadding: false });
      }

      months.push({ year, month, days });
      cur.setMonth(cur.getMonth() + 1);
    }

    return months;
  }, [practiceLogs]);

  const cellSize = 32;
  const gap = 3;
  const cols = 7;

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
            className="w-full max-w-md bg-[#090b14ef] border-t border-white/[0.12] rounded-t-[36px] z-50 flex flex-col max-h-[88vh] overflow-hidden"
          >
            <div className="flex justify-between items-center border-b border-white/5 pb-4 p-6 shrink-0">
              <div className="flex flex-col space-y-1">
                <span className="text-[10px] uppercase tracking-widest font-mono text-teal-400">История</span>
                <h3 className="text-xl font-bold text-white/95 leading-normal">Карта практик</h3>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/60 hover:text-white transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto scrollbar-none px-6 pb-[max(32px,env(safe-area-inset-bottom,32px))] space-y-6">
              {months.length === 0 ? (
                <p className="text-white/30 text-xs font-mono text-center py-10">Нет данных</p>
              ) : (
                months.map((m) => {
                  const weeks: MonthData['days'][] = [];
                  for (let i = 0; i < m.days.length; i += cols) {
                    weeks.push(m.days.slice(i, i + cols));
                  }

                  return (
                    <div key={`${m.year}-${m.month}`}>
                      <h4 className="text-sm font-semibold text-white/80 mb-2">
                        {MONTH_NAMES[m.month]} {m.year}
                      </h4>
                      <div className="grid grid-cols-7 gap-[3px]">
                        {DAY_HEADERS.map((d) => (
                          <div key={d} className="text-[8px] font-mono text-white/20 text-center h-5 flex items-center justify-center">
                            {d}
                          </div>
                        ))}
                        {m.days.map((day) => (
                          <div
                            key={day.key}
                            className="rounded-md flex items-center justify-center text-[10px] font-mono"
                            style={{
                              width: cellSize,
                              height: cellSize,
                              backgroundColor: day.isPadding ? 'transparent' : LEVEL_COLORS[day.level],
                            }}
                          >
                            {!day.isPadding && (
                              <span className={day.count > 0 ? 'text-white/90' : 'text-white/15'}>
                                {day.date}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}

              {months.length > 0 && (
                <div className="flex items-center gap-2 justify-end pb-2">
                  <span className="text-[8px] font-mono text-white/15">Меньше</span>
                  {[0, 1, 2, 3, 4].map((l) => (
                    <div key={l} className="rounded-sm" style={{ width: 10, height: 10, backgroundColor: LEVEL_COLORS[l] }} />
                  ))}
                  <span className="text-[8px] font-mono text-white/15">Больше</span>
                </div>
              )}

              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-xs active:scale-98 transition mt-2 shrink-0"
              >
                Закрыть
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
