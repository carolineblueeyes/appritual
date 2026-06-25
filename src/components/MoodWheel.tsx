import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "motion/react";
import { MOODS, type MoodCard } from "../data/moods";

interface MoodWheelProps {
  onLaunchRitual: (id: string) => void;
}

export const MoodWheel: React.FC<MoodWheelProps> = ({ onLaunchRitual }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const snapTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSnapping = useRef(false);

  const getClosestIndex = useCallback(() => {
    const container = containerRef.current;
    if (!container) return 0;
    const cards = container.querySelectorAll<HTMLElement>("[data-mood-idx]");
    const scrollCenter = container.scrollLeft + container.clientWidth / 2;
    let closest = 0;
    let closestDist = Infinity;
    cards.forEach((card) => {
      const idx = parseInt(card.dataset.moodIdx || "0", 10);
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const dist = Math.abs(cardCenter - scrollCenter);
      if (dist < closestDist) {
        closestDist = dist;
        closest = idx;
      }
    });
    return closest;
  }, []);

  const snapToCenter = useCallback(() => {
    if (isSnapping.current) return;
    isSnapping.current = true;
    const closest = getClosestIndex();
    setActiveIndex(closest);
    const target = containerRef.current?.querySelector<HTMLElement>(`[data-mood-idx="${closest}"]`);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
    }
    setTimeout(() => { isSnapping.current = false; }, 400);
  }, [getClosestIndex]);

  const handleScroll = useCallback(() => {
    const closest = getClosestIndex();
    setActiveIndex(closest);
    if (snapTimer.current) clearTimeout(snapTimer.current);
    snapTimer.current = setTimeout(snapToCenter, 200);
  }, [getClosestIndex, snapToCenter]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (snapTimer.current) clearTimeout(snapTimer.current);
    };
  }, [handleScroll]);

  const handleCardClick = (mood: MoodCard) => {
    onLaunchRitual(mood.ritualId);
  };

  return (
    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex overflow-x-auto no-scrollbar py-4 px-[calc(50%-90px)] gap-0"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)",
        }}
      >
        {MOODS.map((mood, index) => {
          const diff = Math.abs(index - activeIndex);
          const scale = diff === 0 ? 1 : diff === 1 ? 0.78 : 0.5;
          const opacity = diff === 0 ? 1 : diff === 1 ? 0.55 : 0.08;
          const rotateY = index === activeIndex ? 0 : index < activeIndex ? -25 : 25;
          const z = diff === 0 ? 0 : diff === 1 ? -80 : -180;
          const y = 0;
          const rotateX = 0;

          return (
            <motion.div
              key={mood.id}
              data-mood-idx={index}
              onClick={() => handleCardClick(mood)}
              animate={{
                scale,
                opacity,
                rotateY,
                z,
                y,
                rotateX,
              }}
              transition={{
                type: "spring",
                stiffness: 380,
                damping: 32,
                mass: 0.9,
              }}
              className="relative flex-shrink-0 w-[180px] min-h-[220px] mx-2.5 cursor-pointer select-none"
              style={{ transformStyle: "preserve-3d", perspective: "1200px" }}
            >
              <div
                className="absolute inset-0 rounded-[28px] overflow-hidden"
                style={{
                  background: mood.gradient,
                  opacity: diff === 0 ? 0.25 : diff === 1 ? 0.12 : 0.04,
                }}
              />
              <div
                className="absolute -top-6 -left-6 w-40 h-40 rounded-full blur-3xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${mood.color}60 0%, transparent 70%)`,
                  opacity: diff === 0 ? 1 : diff === 1 ? 0.5 : 0,
                }}
              />
              <div
                className="relative z-10 h-full flex flex-col justify-between p-5 rounded-[28px] border border-white/[0.08] backdrop-blur-[16px]"
                style={{
                  background: diff === 0
                    ? `linear-gradient(135deg, ${mood.color}15 0%, rgba(255,255,255,0.03) 100%)`
                    : "rgba(255,255,255,0.02)",
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-3xl leading-none">{mood.emoji}</span>
                    <span className="text-[8px] font-mono uppercase tracking-[0.2em] text-white/25 px-2 py-1 rounded-full border border-white/10">
                      {mood.group}
                    </span>
                  </div>
                  <h4 className="text-base font-display font-semibold text-white/95 mb-1.5">
                    {mood.label}
                  </h4>
                  <p className="text-[11px] font-editorial italic text-white/35 leading-relaxed line-clamp-2">
                    {mood.description}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 mt-4">
                  <span
                    className="w-6 h-[2px] rounded-full"
                    style={{ background: mood.color }}
                  />
                  <span className="text-[8px] font-mono uppercase tracking-[0.15em] text-white/30">
                    Запустить
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-2 mb-0.5">
        {MOODS.map((mood, index) => (
          <button
            key={mood.id}
            onClick={() => {
              const container = containerRef.current;
              const card = container?.querySelector<HTMLElement>(`[data-mood-idx="${index}"]`);
              card?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
            }}
            className="rounded-full transition-all duration-300"
            style={{
              width: index === activeIndex ? 22 : 5,
              height: 5,
              background: index === activeIndex ? mood.color : "rgba(255,255,255,0.12)",
            }}
          />
        ))}
      </div>
    </div>
  );
};
