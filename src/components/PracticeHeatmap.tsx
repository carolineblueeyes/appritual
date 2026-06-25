import React, { useMemo } from 'react';
import type { ActivityLog } from '../types';

interface Props {
  practiceLogs: ActivityLog[];
  onClick: () => void;
}

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

export default function PracticeHeatmap({ practiceLogs, onClick }: Props) {
  const weekDays = useMemo(() => {
    const today = new Date();
    const dayCountByDate = new Map<string, number>();
    for (const log of practiceLogs) {
      const key = log.date.split('T')[0];
      dayCountByDate.set(key, (dayCountByDate.get(key) || 0) + 1);
    }

    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay() + 1);
    const days: { key: string; count: number; level: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const key = getDateKey(d);
      const count = dayCountByDate.get(key) || 0;
      days.push({ key, count, level: getLevel(count) });
    }
    return days;
  }, [practiceLogs]);

  const todayKey = getDateKey(new Date());
  const totalPractices = practiceLogs.length;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div className="flex items-center gap-1">
        {weekDays.map((d) => {
          const isToday = d.key === todayKey;
          return (
            <div
              key={d.key}
              className="rounded-[3px] transition-all"
              style={{
                width: 14,
                height: 14,
                backgroundColor: LEVEL_COLORS[d.level],
                border: isToday ? '1.5px solid rgba(201,169,110,0.6)' : '1px solid rgba(255,255,255,0.06)',
              }}
              title={`${d.key}: ${d.count}`}
            />
          );
        })}
      </div>
      <span className="text-[10px] font-mono text-white/20 ml-1">Эта неделя</span>
      {totalPractices > 0 && (
        <span className="text-[10px] font-mono text-white/15 ml-auto">{totalPractices} всего</span>
      )}
    </div>
  );
}
