import React, { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trophy, 
  HelpCircle, 
  Activity, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  Shield, 
  Cpu, 
  Sparkles,
  Waves,
  Heart,
  Share2,
  Lock,
  Plus,
  BookOpen,
  X
} from 'lucide-react';
import { Achievement, Article, UserStats, HealthState, ActivityLog } from '../types';
import { INITIAL_ACHIEVEMENTS, EDUCATIONAL_ARTICLES } from '../data';
import PracticeHeatmap from './PracticeHeatmap';

interface ProgressViewProps {
  stats: UserStats;
  achievements: Achievement[];
  healthState: HealthState;
  onOpenPlus: () => void;
  onOpenStore: () => void;
  onOpenArticle: (article: any) => void;
  practiceLogs: ActivityLog[];
  onOpenHeatmap: () => void;
}

export default function ProgressView({
  stats,
  achievements,
  healthState,
  onOpenPlus,
  onOpenStore,
  onOpenArticle,
  practiceLogs,
  onOpenHeatmap
}: ProgressViewProps) {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showBadgeModal, setShowBadgeModal] = useState<Achievement | null>(null);
  const [selectedGoalCount, setSelectedGoalCount] = useState(5);
  const currentGoalProgress = useMemo(() => {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 7);
    return practiceLogs.filter(log => {
      const d = new Date(log.date);
      return d >= weekStart && d < weekEnd;
    }).length;
  }, [practiceLogs]);
  
  // Rotating 3D crystal drag state
  const [rotY, setRotY] = useState(0);
  const [rotX, setRotX] = useState(-15);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setRotY(prev => prev + dx * 0.45);
    setRotX(prev => Math.max(-60, Math.min(60, prev - dy * 0.45)));
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const dx = e.touches[0].clientX - dragStart.current.x;
    const dy = e.touches[0].clientY - dragStart.current.y;
    setRotY(prev => prev + dx * 0.55);
    setRotX(prev => Math.max(-60, Math.min(60, prev - dy * 0.55)));
    dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  // Determine crystal appearance stage based on completed count
  const getCrystalStage = () => {
    const total = stats.ritualsCompleted;
    if (total === 0) return 'fog';
    if (total > 0 && total < 3) return 'spark';
    if (total >= 3 && total < 7) return 'rough';
    if (total >= 7 && total < 15) return 'lavender';
    if (total >= 15 && total < 30) return 'fiery';
    return 'prism';
  };

  const getStageTitle = (stage: string) => {
    switch (stage) {
      case 'fog': return 'Состояние: Густой Туман';
      case 'spark': return 'Рождение: Искра';
      case 'rough': return 'Проявление: Кристалл Истока';
      case 'lavender': return 'Сияние Тишины';
      case 'fiery': return 'Искры Энергии';
      case 'prism': return 'Спектр Ясности';
      default: return 'Кристалл Внимания';
    }
  };

  const getStageDescription = (stage: string) => {
    switch (stage) {
      case 'fog': return 'Твой внутренний мир скрыт под шумом. Начни Путь Внимания, чтобы рассеять туманную дымку.';
      case 'spark': return 'Первый ритуал зажег искру. Она мягко согревает твое присутствие в пространстве.';
      case 'rough': return 'Поздравляем! Базовые грани кристалла очищены и золотисто сияют на свету.';
      case 'lavender': return 'Тишина и покой наполнили глубину твоего кристалла лавандовым свечением вегетатики.';
      case 'fiery': return 'Огненные линии воли пробегают по граням пробужденного Кристалла.';
      case 'prism': return 'Совершенный спектральный алмаз. Преломляет чистейшую радугу осознанной ясности.';
    }
  };

  // Render SVG polygon wireframe depending on crystal stage
  const renderCrystalSVG = (stage: string) => {
    let strokeColor = 'rgba(255,255,255,0.15)';
    let glows = 'rgba(255,255,255,0.05)';

    if (stage === 'spark') {
      strokeColor = 'rgba(230,184,92,0.18)';
      glows = 'rgba(230,184,92,0.15)';
    } else if (stage === 'rough') {
      strokeColor = 'rgba(230,184,92,0.5)';
      glows = 'rgba(230,184,92,0.2)';
    } else if (stage === 'lavender') {
      strokeColor = 'rgba(122,155,186,0.65)';
      glows = 'rgba(122,155,186,0.4)';
    } else if (stage === 'fiery') {
      strokeColor = 'rgba(230,126,34,0.75)';
      glows = 'rgba(230,126,34,0.45)';
    } else if (stage === 'prism') {
      strokeColor = 'rgba(168,213,229,0.9)';
      glows = 'rgba(168,213,229,0.55)';
    }

    if (stage === 'fog') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.05, 1], opacity: [0.35, 0.5, 0.35] }}
            transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
            className="w-44 h-44 rounded-full bg-slate-500/15 blur-2xl"
          />
          <div className="text-white/30 text-xs font-mono text-center max-w-[160px] leading-relaxed select-none">
            Густой туман.<br/>Выполни первый ритуал для искры
          </div>
        </div>
      );
    }

    if (stage === 'spark') {
      return (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div 
            animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.85, 0.4] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-10 h-10 rounded-full bg-[#E6B85C]/50 blur-xl absolute"
          />
          <motion.div 
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="w-3 h-3 bg-[#E6B85C] rounded-full shadow-[0_0_15px_#E6B85C]"
          />
        </div>
      );
    }

    return (
      <div 
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: "preserve-3d",
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
        className="flex items-center justify-center"
      >
        {/* Sphere glowing inside */}
        <div 
          style={{ transform: "translateZ(0px)", backgroundColor: glows, filter: 'blur(30px)' }}
          className="absolute w-28 h-28 rounded-full pointer-events-none transition-all duration-300"
        />

        {/* SVG wireframe for octahedral crystal */}
        <svg viewBox="0 0 100 100" className="w-[180px] h-[180px] absolute z-10 overflow-visible">
          {/* standard diamond/octahedron lines */}
          <polygon points="50,12 20,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,12 80,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,88 20,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,88 80,45 50,45" fill="none" stroke={strokeColor} strokeWidth="1" />
          <polygon points="50,12 40,45 50,88" fill="none" stroke={strokeColor} strokeWidth="1.2" />
          <polygon points="53,12 60,45 53,88" fill="none" stroke={strokeColor} strokeWidth="1.2" />

          {stage === 'fiery' && (
            <g>
              <line x1="50" y1="12" x2="35" y2="30" stroke="#E67E22" strokeWidth="1.5" />
              <line x1="50" y1="88" x2="65" y2="70" stroke="#E67E22" strokeWidth="1.5" />
            </g>
          )}

          {stage === 'prism' && (
            <g opacity="0.35">
              <polygon points="50,12 40,45 50,45" fill="url(#prism1)" />
              <polygon points="50,12 50,45 80,45" fill="url(#prism2)" />
              <defs>
                <linearGradient id="prism1" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#fc8181" />
                  <stop offset="50%" stopColor="#f6e05e" />
                  <stop offset="100%" stopColor="#4fd1c5" />
                </linearGradient>
                <linearGradient id="prism2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#63b3ed" />
                  <stop offset="100%" stopColor="#b794f4" />
                </linearGradient>
              </defs>
            </g>
          )}
        </svg>
      </div>
    );
  };

  const getHapticClass = (achievement: Achievement) => {
    return achievement.unlocked 
      ? 'border-[#E6B85C]/30 bg-[#E6B85C]/10 text-[#E6B85C] shadow-[0_0_12px_rgba(230,184,92,0.12)]' 
      : 'border-white/[0.04] bg-white/[0.01] text-white/20 hover:bg-white/[0.02]';
  };

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'spark': return <Sparkles className="w-5 h-5" />;
      case 'ring': return <Shield className="w-5 h-5" />;
      case 'points': return <Trophy className="w-5 h-5" />;
      case 'sevenDots': return <Waves className="w-5 h-5" />;
      case 'thirtyDots': return <TrendingUp className="w-5 h-5" />;
      case 'runner': return <Cpu className="w-5 h-5" />;
      case 'crystalOne': return <Activity className="w-5 h-5" />;
      default: return <Trophy className="w-5 h-5" />;
    }
  };

  // Helper to draw a delicate "Branch of Consciousness" as SVG path
  const renderValueBranch = () => {
    const points = [];
    const width = 310;
    const height = 110;
    const spacing = width / (selectedGoalCount + 1);

    // Calculate leaf coordinates along horizontal axis with alternate branch shifts
    for (let i = 0; i < selectedGoalCount; i++) {
      const idx = i + 1;
      const x = spacing * idx;
      const isEven = i % 2 === 0;
      // Branch shift under 40 degrees
      const branchLength = 22;
      const angleRad = (isEven ? -38 : 38) * Math.PI / 180;
      
      const leafX = x + Math.cos(angleRad) * branchLength;
      const leafY = 55 + Math.sin(angleRad) * branchLength;

      points.push({
        idx,
        nodeX: x,
        nodeY: 55,
        leafX,
        leafY,
        isFilled: idx <= currentGoalProgress
      });
    }

    const isGoalMet = currentGoalProgress >= selectedGoalCount;

    return (
      <div className="w-full h-[125px] relative mt-2 rounded-2xl bg-black/25 flex items-center justify-center p-3">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          {/* Main timeline branch stem curve */}
          <path 
            d={`M 15 55 Q ${width/2} ${50 + (isGoalMet ?Math.sin(Date.now()/500)*3 : 0)} ${width - 25} 55`} 
            fill="none" 
            stroke="rgba(255,255,255,0.12)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
          
          {/* Glowing completed path overlay */}
          {currentGoalProgress > 0 && (
            <path 
               d={`M 15 55 Q ${width/4} 53 ${spacing * Math.min(selectedGoalCount, currentGoalProgress)} 55`}
               fill="none"
               stroke={isGoalMet ? "url(#metGrad)" : "#E6B85C"}
               strokeWidth="4"
               strokeLinecap="round"
            />
          )}

          {/* Leaf sprouts */}
          {points.map((p, i) => (
            <g key={i}>
              {/* Branch connector path */}
              <line 
                x1={p.nodeX} 
                y1={p.nodeY} 
                x2={p.leafX} 
                y2={p.leafY} 
                className="transition-all duration-300"
                stroke={p.isFilled ? "#10B981" : "rgba(255,255,255,0.08)"} 
                strokeWidth="2" 
              />
              
              {/* Interlocking leaf shapes */}
              {p.isFilled ? (
                <g transform={`translate(${p.leafX}, ${p.leafY})`}>
                  {/* Glowing full bud leaf */}
                  <path 
                    d="M 0 0 C -4 -4, -6 -6, 0 -13 C 6 -6, 4 -4, 0 0" 
                    fill="url(#leafFilledGrad)" 
                    className="cursor-pointer active:scale-90 transition-transform"
                    id={`active_leaf_${i}`}
                    style={{ transformOrigin: 'center' }}
                  />
                  <circle cx="0" cy="-6" r="1.5" fill="#fff" />
                </g>
              ) : (
                <g transform={`translate(${p.leafX}, ${p.leafY})`}>
                  {/* Contour empty dashed leaf slot placeholder */}
                  <path 
                    d="M 0 0 C -4 -4, -6 -6, 0 -13 C 6 -6, 4 -4, 0 0" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                  />
                </g>
              )}

              {/* Step counter micro label on the main trunk node */}
              <circle cx={p.nodeX} cy={p.nodeY} r="3" fill={p.isFilled ? '#E6B85C' : '#1d2133'} />
            </g>
          ))}

          {/* Golden bloomed flower/bud shape node at the very tip representing goal completion */}
          <g transform={`translate(${width - 20}, 55)`}>
            {isGoalMet ? (
              <motion.g
                animate={{ scale: [1, 1.08, 1], rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                {/* Fully bloomed gold lotus */}
                <path d="M 0 0 C -5 -5, -10 0, 0 -10 C 10 0, 5 -5, 0 0 Z" fill="#E6B85C" />
                <path d="M 0 0 C -5 5, -10 0, 0 10 C 10 0, 5 5, 0 0 Z" fill="#E6B85C" />
                <path d="M -5 0 C -5 -5, 0 -10, 5 0 C 0 10, -5 5, -5 0 Z" fill="#7A9BBA" opacity="0.8" />
              </motion.g>
            ) : (
              <path 
                d="M 0 -2 C -2 -4, -4 -3, 0 -8 C 4 -3, 2 -4, 0 -2 Z" 
                fill="none" 
                stroke="rgba(255,255,255,0.15)" 
                strokeWidth="1.5" 
              />
            )}
            <circle cx="0" cy="0" r="2" fill={isGoalMet ? '#fff' : 'rgba(255,255,255,0.2)'} />
          </g>

          <defs>
            <linearGradient id="leafFilledGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
            <linearGradient id="metGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10B981" />
              <stop offset="50%" stopColor="#E6B85C" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-7 pt-4 pb-24 relative px-4 select-none">
      
      {/* Top Header Row with supreme spacing and share widget */}
      <div className="flex justify-between items-center w-full px-2" id="progress_header">
        <h2 className="text-[28px] font-display font-medium tracking-tight text-white/95 leading-none">
          Дневник граней
        </h2>

        <button 
          onClick={() => {
            // Simulated native platform sharing
            const textContent = `Я развиваю свой кристалл сознания в Ritual: сейчас он находится на этапе «${getStageTitle(getCrystalStage())}»! присоединяйся к очищению префронтальной коры.`;
            navigator.clipboard.writeText(textContent);
            alert("Поэтичная ведомость скопирована в буфер обмена!\n\n" + textContent);
          }}
          className="w-12 h-12 rounded-full border border-white/10 bg-white/5 active:scale-95 transition-all flex items-center justify-center pointer-events-auto"
          title="Скопировать ведомость"
          id="btn_share"
        >
          <Share2 className="text-white/80 w-5 h-5" />
        </button>
      </div>

      {/* Block 1: 3D Crystal Visual Module */}
      <div className="w-full" id="block_interactive_crystal">
        <div className="bg-slate-950/30 border border-white/[0.08] backdrop-blur-3xl rounded-[32px] p-6.5 h-[420px] flex flex-col justify-between relative overflow-hidden shadow-2xl">
          
          <div className="flex justify-between items-center z-10 relative">
            <div className="flex flex-col space-y-1">
              <h3 className="text-[20px] font-sans font-medium text-white/90 leading-none">{getStageTitle(getCrystalStage())}</h3>
            </div>
          </div>

          {/* Interactive touch crystal cage */}
          <div 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUpOrLeave}
            className="flex-1 w-full flex items-center justify-center cursor-grab active:cursor-grabbing border border-transparent overflow-hidden my-2"
            id="crystal_cage_interactive"
          >
            {renderCrystalSVG(getCrystalStage())}
          </div>

          <div className="flex flex-col space-y-1 items-center relative z-10">
            <p className="text-[13px] text-center text-white/70 leading-relaxed font-sans px-4 select-none">
              {getStageDescription(getCrystalStage())}
            </p>
            <p className="text-[12px] text-center text-white/30 select-none font-mono mt-1">
              Вращай зажимом для созерцания вегетативных узоров
            </p>
          </div>
        </div>
      </div>

      {/* Block 2: Локальная статистика (days, rituals, streaks) */}
      <div className="flex flex-col space-y-3" id="block_numerical_logs">
        <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase px-2">
          Путь в цифрах
        </span>

        <div className="grid grid-cols-3 gap-2.5" id="stats_digits_grid">
          <div className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] flex flex-col items-center justify-center text-center">
            <span className="text-[28px] font-display font-semibold text-white/95 leading-none">{stats.daysPractice}</span>
            <span className="text-[11px] text-white/40 font-sans mt-2 leading-none">дни</span>
          </div>
          <div className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] flex flex-col items-center justify-center text-center">
            <span className="text-[28px] font-display font-semibold text-white/95 leading-none">{stats.ritualsCompleted}</span>
            <span className="text-[11px] text-white/40 font-sans mt-2 leading-none">ритуалы</span>
          </div>
          <div className="p-4 rounded-2xl border border-white/[0.05] bg-white/[0.015] flex flex-col items-center justify-center text-center">
            <span className="text-[28px] font-display font-semibold text-white/95 leading-none">{stats.daysStreak}</span>
            <span className="text-[11px] text-white/40 font-sans mt-2 leading-none">серия</span>
          </div>
        </div>
      </div>

      {/* Block 2.5: GitHub-style practice heatmap */}
      <div className="flex flex-col space-y-3" id="block_practice_heatmap">
        <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase px-2">
          Карта практик
        </span>
        <div className="bg-slate-950/30 border border-white/[0.08] backdrop-blur-3xl rounded-[32px] p-5 relative overflow-hidden shadow-xl">
          <PracticeHeatmap practiceLogs={practiceLogs} onClick={onOpenHeatmap} />
        </div>
      </div>

      {/* Block 3: Goals / Branch of Consciousness */}
      <div className="flex flex-col space-y-3" id="block_branch_goals">
        <div className="flex justify-between items-center px-2">
          <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase">
            Ветвь сознания
          </span>
          <button 
            onClick={() => setShowGoalModal(true)}
            className="text-[12px] font-mono text-[#E6B85C] hover:underline"
          >
            Изменить планку
          </button>
        </div>

        <div className="bg-slate-950/30 border border-white/[0.08] backdrop-blur-3xl rounded-[32px] p-6 relative overflow-hidden flex flex-col shadow-xl">
          <span className="text-[13px] text-white/50 font-sans">
            Недельная цель: {currentGoalProgress} из {selectedGoalCount} почек сознания распущено.
          </span>
          
          {/* Custom drawing branch of consciousness */}
          {renderValueBranch()}

          <p className="text-[13px] text-white/40 font-sans leading-relaxed mt-4 leading-normal">
            Каждая раскрытая почка олицетворяет завершенный ритуал. Наполняй ветвь сознания регулярно, чтобы распустить цветок на конце.
          </p>
        </div>
      </div>

      {/* Block 4: Achievements Trophy track */}
      <div className="flex flex-col space-y-3" id="block_trophy_track">
        <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase px-2">
          Мои достижения
        </span>

        <div className="flex space-x-3.5 overflow-x-auto pb-3.5 scrollbar-none px-1">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              onClick={() => setShowBadgeModal(ach)}
              className={`shrink-0 w-[115px] h-[115px] rounded-[24px] border flex flex-col items-center justify-center text-center p-3 cursor-pointer transition-all duration-300 active:scale-95 ${getHapticClass(ach)}`}
            >
              {getIconComponent(ach.iconType)}
              <span className="text-[11px] text-white/90 font-semibold truncate w-full mt-2.5">
                {ach.title}
              </span>
              <span className="text-[9px] text-white/40 font-mono mt-1">
                {ach.unlocked ? 'Раскрыто' : 'Скрыто'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Block 5: Eco system store teaser ("Углубить практику") */}
      <div className="w-full pt-1" id="block_ecosystem_deepen">
        <div className="bg-gradient-to-r from-amber-400/5 to-transparent border border-white/[0.05] rounded-[28px] p-6 flex flex-col space-y-3.5 pointer-events-auto">
          <span className="text-[11px] uppercase tracking-wider font-mono text-amber-300">Связь с Артефактом</span>
          <h4 className="text-[15px] font-semibold text-white/90">Сковать кольцо Ritual Core</h4>
          <p className="text-xs text-white/50 leading-relaxed font-sans">
            Умное биометрическое кольцо Ritual Core считывает вегетативные индексы (ВСР, пульс) во время сна для прецизионного сияния Кристалла.
          </p>
          <div className="flex space-x-3 pt-1">
            <button 
              onClick={onOpenStore}
              className="px-4.5 py-2.5 bg-gradient-to-r from-amber-400 to-[#E6B85C] text-black font-semibold rounded-xl text-xs active:scale-95 transition-all"
            >
              Купить Кольцо
            </button>
            <button 
              onClick={onOpenPlus}
              className="px-4.5 py-2.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs active:scale-95 transition-all"
            >
              Попробовать Ritual Plus
            </button>
          </div>
        </div>
      </div>

      {/* Goal configuring modal sheet */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-45 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e101cf4] border border-white/10 p-6 rounded-3xl flex flex-col space-y-4"
            >
              <h3 className="text-lg font-medium text-white/95">Планка на неделю</h3>
              <p className="text-xs text-white/50 leading-relaxed">
                Выбери количество почек для твоей ветви сознания. Каждая пройденная практика приблизит цветение:
              </p>
              
              <div className="flex justify-between items-center pt-2">
                {[3, 5, 7, 10].map(count => (
                  <button 
                    key={count}
                    onClick={() => setSelectedGoalCount(count)}
                    className={`w-12 h-12 rounded-xl border font-mono text-sm leading-relaxed transition-all ${selectedGoalCount === count ? 'bg-amber-400 border-amber-400 text-black font-bold' : 'bg-white/5 border-white/10 text-white'}`}
                  >
                    {count}
                  </button>
                ))}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button 
                  onClick={() => setShowGoalModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 text-xs font-medium"
                >
                  Отмена
                </button>
                <button 
                  onClick={() => {
                    setShowGoalModal(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-[#E6B85C] text-black text-xs font-semibold"
                >
                  Применить
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Badge Trophy popup description sheet */}
      <AnimatePresence>
        {showBadgeModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-45 flex items-center justify-center p-4 pointer-events-auto">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-[#0e101cf2] border border-white/10 p-6.5 rounded-[32px] flex flex-col items-center text-center space-y-4 relative"
            >
              <button 
                className="absolute top-4 right-4 text-white/40 hover:text-white"
                onClick={() => setShowBadgeModal(null)}
              >
                <X className="w-4 h-4" />
              </button>

              <div className={`p-4.5 rounded-full border mb-1.5 ${showBadgeModal.unlocked ? 'bg-amber-400/20 border-amber-400/40 text-amber-400' : 'bg-white/5 border-white/5 text-white/30'}`}>
                {getIconComponent(showBadgeModal.iconType)}
              </div>

              <span className="text-[11px] uppercase font-mono tracking-widest text-[#E6B85C]">Артефакт сознания</span>
              <h3 className="text-xl font-medium text-white/95 leading-normal">{showBadgeModal.title}</h3>
              <p className="text-xs text-white/50 leading-relaxed max-w-[240px]">
                {showBadgeModal.description}
              </p>

              <p className="text-[10px] font-mono text-white/30 pt-2">
                {showBadgeModal.unlocked ? 'Успешно разблокировано в ведомости' : 'Пока заблокировано'}
              </p>

              <button 
                onClick={() => {
                  setShowBadgeModal(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-white/5 text-white text-xs font-semibold border border-white/10 active:scale-95 transition"
              >
                Закрыть
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
