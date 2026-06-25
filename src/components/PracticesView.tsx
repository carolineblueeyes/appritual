import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bookmark, 
  Search, 
  Activity, 
  Compass, 
  Volume2, 
  Target, 
  Flame, 
  Waves,
  Heart,
  Eye,
  Settings,
  Sparkles,
  ArrowRight,
  TrendingUp,
  X,
  Lock,
  Check,
  Play,
  PlayCircle,
  Wind,
  Brain,
  Sunrise,
  Footprints
} from 'lucide-react';
import { Practice, PracticeGroupType, PathwayLevel } from '../types';
import { ALL_PRACTICES, UNIQUE_PRACTICES, PATHWAY_LEVELS } from '../data';

interface PracticesViewProps {
  isPlus: boolean;
  favorites: string[];
  onToggleFavorite: (pId: string) => void;
  onStartPractice: (practice: Practice) => void;
  onOpenPlus: () => void;
  currentLevel: number;
  onModalOpenChange?: (open: boolean) => void;
}

export default function PracticesView({
  isPlus,
  favorites,
  onToggleFavorite,
  onStartPractice,
  onOpenPlus,
  currentLevel,
  onModalOpenChange
}: PracticesViewProps) {
  const [selectedGroup, setSelectedGroup] = useState<PracticeGroupType | 'Все'>('Все');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFavSheet, setShowFavSheet] = useState(false);
  const [showPathwayModal, setShowPathwayModal] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);

  // Notify parent when any modal opens/closes
  useEffect(() => {
    onModalOpenChange?.(showFavSheet || showPathwayModal);
  }, [showFavSheet, showPathwayModal]);
  const [expandedChapters, setExpandedChapters] = useState<Record<number, boolean>>({ 1: true });

  // Group metadata representing different chapters
  const GROUP_INFO = {
    'Все': { label: 'Все ритуалы', desc: 'Единый поток практик', color: 'from-blue-600/20 to-purple-600/10', glow: 'text-white' },
    'Исток': { label: 'Исток ☀️', desc: 'Возвращение к соматической связи', color: 'from-[#E6B85C]/20 to-[#E6B85C]/5', glow: 'text-[#E6B85C]' },
    'Тишина': { label: 'Тишина 🌙', desc: 'Снятие накопленной перегрузки', color: 'from-[#7A9BBA]/20 to-[#7A9BBA]/5', glow: 'text-[#7A9BBA]' },
    'Энергия': { label: 'Энергия 🔥', desc: 'Активация симпатической воли', color: 'from-[#E67E22]/20 to-[#E67E22]/5', glow: 'text-[#E67E22]' },
    'Ясность': { label: 'Ясность 💎', desc: 'Настройка префронтальной коры', color: 'from-[#A8D5E5]/20 to-[#A8D5E5]/5', glow: 'text-[#A8D5E5]' }
  };

  const filteredPractices = ALL_PRACTICES.filter(p => {
    const matchesGroup = selectedGroup === 'Все' || p.group === selectedGroup;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesSearch;
  });

  const getGroupIcon = (group: PracticeGroupType) => {
    switch (group) {
      case 'Исток': return <Sparkles className="w-5 h-5 text-[#E6B85C]" />;
      case 'Тишина': return <Waves className="w-5 h-5 text-[#7A9BBA]" />;
      case 'Энергия': return <Flame className="w-5 h-5 text-[#E67E22]" />;
      case 'Ясность': return <Target className="w-5 h-5 text-[#A8D5E5]" />;
    }
  };

  const getFavoritePractices = () => {
    return ALL_PRACTICES.filter(p => favorites.includes(p.id));
  };

  return (
    <div className="w-full flex flex-col space-y-7 pt-4 pb-28 relative px-4 select-none">
      
      {/* Top Header Row with airy bookmark toggle */}
      <div className="flex justify-between items-center w-full px-2" id="practices_header">
        <div className="flex flex-col">
          <h2 className="text-[28px] font-display font-medium tracking-tight text-white/95 leading-none">
            Архив сознания
          </h2>
        </div>

        <motion.button 
          whileTap={{ scale: 0.92 }}
          onClick={() => setShowFavSheet(true)}
          className="w-12 h-12 rounded-full border border-white/10 bg-white/5 active:scale-95 transition-all flex items-center justify-center pointer-events-auto relative"
          title="Избранные сеансы"
          id="btn_bookmark"
        >
          <Bookmark className="text-white/80 w-5 h-5" />
          {favorites.length > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E6B85C] text-black text-[10px] font-mono font-bold flex items-center justify-center rounded-full">
              {favorites.length}
            </span>
          )}
        </motion.button>
      </div>

      {/* Floating Search minimal vessel input */}
      <div className="w-full relative" id="practices_search_container">
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Поиск по практикам..."
          className="w-full h-13 pl-12 pr-4 bg-slate-950/20 border border-white/[0.06] rounded-[22px] text-sm text-white/90 placeholder-white/20 focus:outline-none focus:border-[#E6B85C]/50 transition-all font-sans"
        />
        <Search className="w-4 h-4 text-white/20 absolute left-4.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Block 1: "Твой Путь" - Album style playlist cover header */}
      <div className="w-full" id="block_pathway_banner">
        <motion.div 
          onClick={() => setShowPathwayModal(true)}
          whileTap={{ scale: 0.98 }}
          className="p-6.5 rounded-[32px] bg-gradient-to-br from-indigo-950/40 via-purple-950/20 to-transparent border border-white/[0.06] flex items-center justify-between shadow-2xl relative overflow-hidden cursor-pointer"
        >
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-20">
            <Sparkles className="w-40 h-40 text-purple-400 transform translate-x-12 translate-y-12 animate-spin-slow" />
          </div>

          <div className="flex flex-col space-y-2 z-10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#E6B85C] font-semibold">Глава 1: Исток</span>
            <h3 className="text-[20px] font-display font-medium text-white/95">Путь внимания: Начало</h3>
            <p className="text-xs text-white/60 leading-relaxed max-w-[240px]">
              Проложи последовательный соматический маршрут из 6 глав, трансформирующих Кристалл.
            </p>
          </div>

          <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 z-10">
            <ArrowRight className="w-5 h-5 text-white/80" />
          </div>
        </motion.div>
      </div>

      {/* Block 2: Chapter quick selectors list with sliding highlight */}
      <div className="w-full flex flex-col space-y-3.5" id="block_chapters_selector">
        <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase px-2">
          Выбери направление
        </span>

        <div className="flex space-x-2 overflow-x-auto pb-1.5 scrollbar-none snap-x px-1">
          {Object.entries(GROUP_INFO).map(([key, value]) => {
            const isSelected = selectedGroup === key;
            return (
              <motion.button 
                whileTap={{ scale: 0.95 }}
                key={key}
                onClick={() => setSelectedGroup(key as any)}
                className={`snap-start shrink-0 px-5.5 py-4 rounded-[22px] border text-xs font-semibold font-sans tracking-wide transition-all shadow-sm ${
                  isSelected 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-[#E6B85C]/50 text-white font-bold' 
                    : 'bg-slate-950/20 border-white/[0.04] text-white/60 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <span>{value.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Block 2.5: Unique Rituals shortcut cluster */}
      <div className="w-full flex flex-col space-y-3.5" id="block_unique_rituals">
        <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase px-2">
          Уникальные ритуалы
        </span>

        <div className="grid grid-cols-2 gap-2.5">
          {UNIQUE_PRACTICES.map((u) => {
            const iconMap: Record<string, React.ReactNode> = {
              'uniq-focus': <Brain className="w-4.5 h-4.5 text-[#A8D5E5]" />,
              'uniq-movement': <Footprints className="w-4.5 h-4.5 text-[#E67E22]" />,
              'uniq-glow': <Sunrise className="w-4.5 h-4.5 text-[#7A9BBA]" />,
              'uniq-breath': <Wind className="w-4.5 h-4.5 text-[#E6B85C]" />
            };
            return (
              <motion.button
                key={u.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onStartPractice(u)}
                className="p-3.5 rounded-[22px] bg-slate-950/20 border border-white/[0.05] flex items-center space-x-3 text-left cursor-pointer hover:bg-white/[0.04] active:scale-95 transition-all shadow-md"
              >
                <div className="w-9 h-9 rounded-[12px] bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  {iconMap[u.id]}
                </div>
                <div className="flex flex-col">
                  <span className="text-white/90 text-[13px] font-semibold leading-tight">{u.name}</span>
                  <span className="text-[10px] text-white/30 font-mono">{u.duration}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Block 3: List of Practices in the selected group (with Album cover designs) */}
      <div className="w-full flex flex-col space-y-4" id="practices_list">
        <div className="flex justify-between items-center px-2">
          <span className="text-white/40 text-[13px] font-sans font-semibold tracking-wider uppercase">
            {GROUP_INFO[selectedGroup].label}
          </span>
          <span className="text-xs text-white/30 font-mono font-medium">{filteredPractices.length} сеансов</span>
        </div>

        <div className="flex flex-col space-y-3.5">
          <AnimatePresence mode="popLayout">
            {filteredPractices.map((p, idx) => {
              const isFav = favorites.includes(p.id);
              return (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, delay: Math.min(idx * 0.04, 0.25) }}
                  key={p.id}
                  onClick={() => onStartPractice(p)}
                  className="flex items-center space-x-4 p-4 rounded-[24px] bg-white/[0.015] border border-white/[0.05] hover:bg-white/[0.03] transition-all cursor-pointer shadow-lg group relative overflow-hidden"
                >
                  {/* Subtle inner highlight of the group's color */}
                  <div className={`absolute top-0 left-0 bottom-0 w-[4px] opacity-60 bg-gradient-to-r ${
                    p.group === 'Исток' ? 'from-[#E6B85C]' :
                    p.group === 'Тишина' ? 'from-[#7A9BBA]' :
                    p.group === 'Энергия' ? 'from-[#E67E22]' :
                    'from-[#A8D5E5]'
                  }`} />

                  {/* High end Album Playlist Cover Icon */}
                  <div className={`w-11.5 h-11.5 rounded-[16px] border flex items-center justify-center shrink-0 shadow-md ${
                    p.group === 'Исток' ? 'bg-[#E6B85C]/10 border-[#E6B85C]/20' :
                    p.group === 'Тишина' ? 'bg-[#7A9BBA]/10 border-[#7A9BBA]/20' :
                    p.group === 'Энергия' ? 'bg-[#E67E22]/10 border-[#E67E22]/20' :
                    'bg-[#A8D5E5]/10 border-[#A8D5E5]/20'
                  }`}>
                    {getGroupIcon(p.group)}
                  </div>

                  {/* Content details */}
                  <div className="flex-1 flex flex-col min-w-0 pr-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-white/95 font-semibold text-[15px] truncate leading-none mb-1.5">{p.name}</span>
                    </div>
                    <span className="text-[12px] text-white/40 truncate leading-none">{p.category} · {p.group}</span>
                  </div>

                  {/* Timer & favorite toggle panel */}
                  <div className="flex items-center space-x-3 shrink-0">
                    <span className="text-[11px] font-mono text-white/30">{p.duration}м</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(p.id);
                      }}
                      className="p-2 rounded-xl bg-white/5 border border-white/5 text-white/40 hover:text-rose-400 transition"
                      title="Добавить в избранное"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-400 text-rose-400 stroke-none' : ''}`} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {filteredPractices.length === 0 && (
            <div className="text-center text-white/30 text-xs py-12 font-mono">
              Ничего не найдено в данной ведомости
            </div>
          )}
        </div>
      </div>

      {/* Floating Bottom Modal Sheet for Favorite Practices List */}
      <AnimatePresence>
        {showFavSheet && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-45 flex items-end justify-center pointer-events-auto">
            <div className="absolute inset-0 z-0" onClick={() => setShowFavSheet(false)} />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="w-full max-w-md bg-[#090b14ef] border-t border-white/[0.12] rounded-t-[36px] p-6 pb-[max(24px,env(safe-area-inset-bottom,24px))] z-50 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto scrollbar-none shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#E6B85C]">Избранное</span>
                  <h3 className="text-xl font-bold text-white/95">Мои сеансы</h3>
                </div>
                <button 
                  onClick={() => setShowFavSheet(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                {getFavoritePractices().map((p) => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      onStartPractice(p);
                      setShowFavSheet(false);
                    }}
                    className="p-4 rounded-2xl bg-white/[0.015] border border-white/[0.05] hover:bg-white/[0.04] cursor-pointer flex justify-between items-center"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white/90">{p.name}</span>
                      <span className="text-xs text-white/30 font-mono mt-0.5">{p.group} · {p.duration}м</span>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(p.id);
                      }}
                      className="text-xs text-rose-400 hover:text-rose-350 px-2 py-1 bg-rose-500/10 rounded-xl"
                    >
                      Убрать
                    </button>
                  </div>
                ))}

                {favorites.length === 0 && (
                  <div className="text-center py-10 text-white/30 text-xs font-mono leading-relaxed">
                    Добавьте сеансы в библиотеке с помощью<br/>значка закладки «Bookmark».
                  </div>
                )}
              </div>

              <button 
                onClick={() => setShowFavSheet(false)}
                className="w-full py-4 rounded-xl bg-white/5 text-white/80 border border-white/10 text-xs font-semibold mt-4 active:scale-98 transition"
              >
                Вернуться назад
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Pathway map detailed modal */}
      <AnimatePresence>
        {showPathwayModal && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-45 flex items-end justify-center pointer-events-auto">
            <div className="absolute inset-0" onClick={() => setShowPathwayModal(false)} />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 200 }}
              className="w-full max-w-sm bg-[#090b14ef] border-t border-white/[0.12] rounded-t-[36px] p-6 pb-[max(24px,env(safe-area-inset-bottom,24px))] z-50 flex flex-col space-y-4 max-h-[85vh] overflow-y-auto scrollbar-none shadow-2xl"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#E6B85C]">Твой Кристальный маршрут</span>
                  <h3 className="text-xl font-bold font-display text-white/95">Путь Внимания</h3>
                </div>
                <button 
                  onClick={() => setShowPathwayModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 animate-hover hover:scale-105"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-white/50 text-left leading-relaxed">
                Проложи последовательный соматический маршрут из 4 глав, трансформирующих твой Кристалл. Каждый пройденный урок очищает и усиливает его грани.
              </p>

              {/* Chapters List */}
              <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-none snap-x px-1 w-full" id="chapters_horizontal_carousel">
                {[
                  { index: 1, title: 'Глава 1: Исток ☀️', label: 'Рождение Света', group: 'Исток' as const, desc: 'В рассеянном внимании загорается первая искра. Шаг за шагом она становится кристаллом — твоей внутренней опорой.', locked: false },
                  { index: 2, title: 'Глава 2: Тишина 🌙', label: 'Глубина Озера', group: 'Тишина' as const, desc: 'Кристалл, рождённый в Истоке, погружается в необозримую глубину безмолвного озера. Вода прозрачна и спокойна.', locked: !isPlus },
                  { index: 3, title: 'Глава 3: Энергия 🔥', label: 'Внутренний Огонь', group: 'Энергия' as const, desc: 'Кристалл, напитанный глубиной, открывает в себе тепло. Твоя сокровенная искра даёт согревающий огонь.', locked: !isPlus },
                  { index: 4, title: 'Глава 4: Ясность 💎', label: 'Зеркальная Призма', group: 'Ясность' as const, desc: 'Кристалл, прошедший свет, глубину и огонь, обретает способность видеть реальность без искажений.', locked: !isPlus }
                ].map((chap) => {
                  const chapLevels = PATHWAY_LEVELS.filter(l => l.chapterIndex === chap.index);
                  
                  // Calculate progress for this chapter
                  const completedInChap = chapLevels.filter(l => l.overallIndex < currentLevel - 1).length;
                  const totalInChap = chapLevels.length;
                  const isChapterFullyCompleted = completedInChap === totalInChap && totalInChap > 0;

                  // Dynamic color highlight matching each chapter's signature identity
                  const themeClasses = 
                    chap.group === 'Исток' ? 'from-[#E6B85C]/10 border-white/[0.08] hover:border-[#E6B85C]/35 shadow-[#E6B85C]/5' :
                    chap.group === 'Тишина' ? 'from-[#7A9BBA]/10 border-white/[0.08] hover:border-[#7A9BBA]/35 shadow-[#7A9BBA]/5' :
                    chap.group === 'Энергия' ? 'from-[#E67E22]/10 border-white/[0.08] hover:border-[#E67E22]/35 shadow-[#E67E22]/5' :
                    'from-[#A8D5E5]/10 border-white/[0.08] hover:border-[#A8D5E5]/35 shadow-[#A8D5E5]/5';

                  return (
                    <div 
                      key={chap.index} 
                      className={`snap-start shrink-0 w-[285px] p-5 rounded-[28px] border bg-gradient-to-b to-transparent transition-all duration-300 text-left flex flex-col justify-between shadow-lg relative overflow-hidden ${themeClasses} ${
                        chap.locked ? 'opacity-65' : ''
                      }`}
                    >
                      <div>
                        {/* Chapter header */}
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col text-left space-y-0.5">
                            <div className="flex items-center space-x-1.5 flex-wrap">
                              <span className="text-sm font-bold text-white/95 leading-tight">{chap.title}</span>
                              {chap.locked && <Lock className="w-3 h-3 text-white/40 shrink-0" />}
                              {isChapterFullyCompleted && (
                                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 font-mono font-bold">✓ Пройдена</span>
                              )}
                            </div>
                            <span className="text-[11px] font-medium text-white/50">{chap.label}</span>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                            <span className="text-[10px] text-white/50 font-mono font-bold">
                              {completedInChap}/{totalInChap}
                            </span>
                          </div>
                        </div>

                        <p className="text-[11px] text-white/40 leading-relaxed mt-2 min-h-[48px]">{chap.desc}</p>
                        
                        {/* Chapter levels list */}
                        <div className="flex flex-col space-y-2.5 mt-3 pt-3 border-t border-white/5 max-h-[175px] overflow-y-auto scrollbar-none pr-0.5">
                          {chapLevels.map((lvl) => {
                            const isLvlComplete = lvl.overallIndex < currentLevel - 1;
                            const isLvlActive = lvl.overallIndex === currentLevel - 1;
                            const isLvlLocked = (chap.locked) || (lvl.overallIndex > currentLevel - 1);

                            return (
                              <div 
                                key={lvl.id}
                                onClick={() => {
                                  if (chap.locked) {
                                    onOpenPlus();
                                    return;
                                  }
                                  if (isLvlLocked) {
                                    return;
                                  }
                                  // Transform PathwayLevel to Practice model
                                  const pPractice: Practice = {
                                    id: lvl.id,
                                    name: lvl.name,
                                    group: lvl.group,
                                    duration: lvl.duration,
                                    category: 'Путь Внимания',
                                    scientificBase: 'Основано на соматических исследованиях и нейробиологии внимания.',
                                    howItWorks: lvl.description,
                                    result: 'Преображение структуры и чистоты Кристалла.',
                                    isUnlocked: true
                                  };
                                  onStartPractice(pPractice);
                                  setShowPathwayModal(false);
                                }}
                                className={`p-2.5 rounded-xl flex items-center justify-between text-[11px] transition duration-300 ${
                                  isLvlActive 
                                    ? 'bg-gradient-to-r from-white/10 to-transparent border border-[#E6B85C]/30 shadow-md shadow-[#E6B85C]/5 cursor-pointer' 
                                    : isLvlComplete 
                                      ? 'bg-white/[0.01] hover:bg-white/[0.03] opacity-75 cursor-pointer' 
                                      : 'opacity-40 bg-transparent cursor-not-allowed'
                                }`}
                              >
                                <div className="flex items-center space-x-2 max-w-[80%]">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border ${
                                    isLvlComplete 
                                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                                      : isLvlActive 
                                        ? 'bg-[#E6B85C]/10 border-[#E6B85C]/30 text-[#E6B85C] animate-pulse' 
                                        : 'bg-white/5 border-white/5 text-white/30'
                                  }`}>
                                    {isLvlComplete ? <Check className="w-2.5 h-2.5" /> : isLvlActive ? <Play className="w-2 h-2 fill-current" /> : <Lock className="w-2 h-2" />}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className={`font-semibold text-left truncate leading-tight ${isLvlActive ? 'text-white/95' : 'text-white/70'}`}>
                                      {lvl.name.replace(/Уровень \d+\.\s*/, '')}
                                    </span>
                                    <span className="text-[9px] text-white/30 text-left font-mono mt-0.5">
                                      {lvl.duration}
                                    </span>
                                  </div>
                                </div>

                                {!isLvlLocked ? (
                                  <button className="px-2 py-1 rounded-lg bg-white text-black font-bold text-[9px] hover:scale-105 active:scale-95 transition whitespace-nowrap">
                                    {isLvlComplete ? 'Пластика' : 'Старт'}
                                  </button>
                                ) : (
                                  chap.locked && (
                                    <Lock className="w-3 h-3 text-white/20 mr-0.5 shrink-0" />
                                  )
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button 
                onClick={() => setShowPathwayModal(false)}
                className="w-full py-4 rounded-xl bg-white/5 text-white/80 border border-white/10 text-xs font-semibold mt-4 active:scale-98 transition"
              >
                Вернуться к медиатеке
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
