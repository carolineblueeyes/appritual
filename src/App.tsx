import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import BottomTabBar from './components/BottomTabBar';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Activity, 
  Check, 
  ChevronRight, 
  TrendingUp, 
  Settings, 
  User, 
  ShieldCheck, 
  Lock, 
  Plus, 
  X,
  Play,
  Pause,
  AlertCircle,
  HelpCircle,
  Sparkles,
  Waves,
  Zap,
  Eye,
  Heart,
  Droplet,
  Smartphone,
  Info,
  History,
  RotateCcw,
  Volume2
} from 'lucide-react';
import { HealthState, Practice, ActivityLog, UserStats, Achievement } from './types';
import { ALL_PRACTICES, INITIAL_ACHIEVEMENTS } from './data';
import { healthService, healthBridge } from './services';
// Expose for HealthBridge UI buttons in TodayView
(window as any).healthBridge = healthBridge;
import type { HealthData } from './services/HealthService';

// Component imports
import TodayView from './components/TodayView';
import PracticesView from './components/PracticesView';
import ProgressView from './components/ProgressView';
import NavigatorModal from './components/NavigatorModal';
import SubscriptionPlus from './components/SubscriptionPlus';
import RingCustomizer from './components/RingCustomizer';
import Onboarding from './components/Onboarding';
import PracticeHistoryModal from './components/PracticeHistoryModal';
import HealthDetailsModal from './components/HealthDetailsModal';

export default function App() {
  // Navigation derived from react-router
  const location = useLocation();
  const navigate = useNavigate();
  const activeTab = (location.pathname.replace('/', '') || 'today') as 'today' | 'practices' | 'progress' | 'profile';

  // Core User state persistently saved via localStorage
  const [isOnboarded, setIsOnboarded] = useState<boolean>(() => {
    const saved = localStorage.getItem('ritual_onboarded');
    return saved ? JSON.parse(saved) : false;
  });

  const [userName, setUserName] = useState<string>(() => {
    const saved = localStorage.getItem('ritual_username');
    return saved || 'Странник Внимания';
  });

  const [isPlus, setIsPlus] = useState<boolean>(() => {
    const saved = localStorage.getItem('ritual_plus_active');
    return saved ? JSON.parse(saved) : true; // Default True for MVP richness
  });

  const [ringConnected, setRingConnected] = useState<boolean>(() => {
    const saved = localStorage.getItem('ring_connected');
    return saved === 'true';
  });

  const [ringConfig, setRingConfig] = useState<any>({
    shell: 'Glow Obsidian',
    engraving: 'Я здесь'
  });

  const [healthScore, setHealthScore] = useState<number>(() => {
    const saved = localStorage.getItem('ritual_health_score');
    return saved ? JSON.parse(saved) : 84;
  });
  const [healthState, setHealthState] = useState<HealthState>(() => {
    const saved = localStorage.getItem('ritual_health_state') as HealthState | null;
    return saved || 'Balance';
  });

  const [stats, setStats] = useState<UserStats>({
    daysPractice: 3,
    ritualsCompleted: 5,
    daysStreak: 3
  });

  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    const saved = localStorage.getItem('ritual_achievements');
    if (saved) return JSON.parse(saved);
    // Auto unlock some achievements for richness if rituals > 0
    return INITIAL_ACHIEVEMENTS.map(ach => {
      if (ach.id === 'first_spark') return { ...ach, unlocked: true };
      return ach;
    });
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('ritual_favorites');
    return saved ? JSON.parse(saved) : ['5-4-3-2-1', 'physio-sigh'];
  });

  const [background, setBackground] = useState<'water' | 'sky' | 'aurora'>('water');

  // Реальные данные здоровья — запрос только по кнопке Connect, не на старте
  const [isHealthConnected, setIsHealthConnected] = useState(() => {
    return localStorage.getItem('ritual_health_connected') === 'true';
  });
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [realHealthData, setRealHealthData] = useState<HealthData | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  const autoConnectAttempted = useRef(false);

  // При монтировании: если уже подключены — загружаем данные,
  // если не подключены — автоматически показываем Health Connect
  useEffect(() => {
    if (autoConnectAttempted.current) return;
    autoConnectAttempted.current = true;

    if (isHealthConnected) {
      fetchHealthData();
    } else {
      handleConnectHealth();
    }
  }, []);

  async function fetchHealthData() {
    setIsSyncing(true);
    try {
      const data = await healthService.getCurrentHealth();
      setRealHealthData(data);
      const { state, score } = healthService.calculateHealthState(data);
      setHealthState(state);
      setHealthScore(score);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.warn('[App] Failed to fetch health data:', msg);
      setHealthError(msg);
    } finally {
      setIsSyncing(false);
    }
  }

  async function handleConnectHealth() {
    setIsConnecting(true);
    setHealthError(null);
    try {
      const granted = await healthService.requestPermissions();
      if (granted) {
        setIsHealthConnected(true);
        localStorage.setItem('ritual_health_connected', 'true');
        await fetchHealthData();
      } else {
        setHealthError('Доступ к данным здоровья не разрешён. / Health Connect не установлен.');
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Неизвестная ошибка';
      console.warn('[App] Health connect failed:', msg);
      setHealthError(msg);
    } finally {
      setIsConnecting(false);
    }
  }

  const [recommendedPractice, setRecommendedPractice] = useState<Practice>(() => {
    return ALL_PRACTICES.find(p => p.id === 'physio-sigh') || ALL_PRACTICES[0];
  });

  // Modal displays
  const [showNavigator, setShowNavigator] = useState(false);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showRingConfigurator, setShowRingConfigurator] = useState(false);
  const [showHealthDetail, setShowHealthDetail] = useState(false);
  const [showHeatmapModal, setShowHeatmapModal] = useState(false);
  const [activeReadingTopic, setActiveReadingTopic] = useState<any>(null);
  const [childModalOpen, setChildModalOpen] = useState(false);

  // Active exercises states
  const [activePractice, setActivePractice] = useState<Practice | null>(null);

  // 1. Breathing loop player controls
  const [breathingPhase, setBreathingPhase] = useState<string>('inhale');
  const [breathingSecondsLeft, setBreathingSecondsLeft] = useState(4);
  const [breathingCyclesCompleted, setBreathingCyclesCompleted] = useState(0);

  // 2. Focus timer state
  const [pomodoroFocusTitle, setPomodoroFocusTitle] = useState('Главный приоритет');
  const [pomodoroMinutes, setPomodoroFocusMinutes] = useState(25);
  const [pomodoroSeconds, setPomodoroSeconds] = useState(0);
  const [pomodoroIsActive, setPomodoroIsActive] = useState(false);
  const [distractionsCount, setDistractionsCount] = useState(0);
  const [userCheated, setUserCheated] = useState(false);
  const [cheatedMessage, setCheatedMessage] = useState(false);

  // 3. Mindful movement (Walk/Run/Bicycle tracker)
  const [movementType, setMovementType] = useState<'walk' | 'run' | 'bike'>('walk');
  const [movementIsActive, setMovementIsActive] = useState(false);
  const [movementTimer, setMovementTimer] = useState(0); // in seconds
  const [movementDistance, setMovementDistance] = useState(0.0); // in km
  const [simicatedPace, setSimulatedPace] = useState('6:15');

  // 4. "Свечение" soundscape horizontal player states
  const [ambientTrackIndex, setAmbientTrackIndex] = useState(0);
  const [ambientIsPlaying, setAmbientIsPlaying] = useState(false);
  const [fallbackTimer, setFallbackTimer] = useState(0);

  // History track log
  const [workoutLogs, setWorkoutLogs] = useState<ActivityLog[]>(() => {
    const saved = localStorage.getItem('ritual_workout_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return [];
  });

  // Handle active status block click haptic updates from Today
  useEffect(() => {
    localStorage.setItem('ritual_onboarded', JSON.stringify(isOnboarded));
    localStorage.setItem('ritual_username', userName);
    localStorage.setItem('ritual_plus_active', JSON.stringify(isPlus));
    localStorage.setItem('ring_connected', String(ringConnected));
    localStorage.setItem('ritual_favorites', JSON.stringify(favorites));
    localStorage.setItem('ritual_achievements', JSON.stringify(achievements));
    localStorage.setItem('ritual_health_score', JSON.stringify(healthScore));
    localStorage.setItem('ritual_health_state', healthState);
    localStorage.setItem('ritual_workout_logs', JSON.stringify(workoutLogs));
  }, [isOnboarded, userName, isPlus, ringConnected, favorites, achievements, healthScore, healthState, workoutLogs]);

  // Synchronise window focus for cheating check on Focus (Pomodoro) timer
  useEffect(() => {
    const handleBlur = () => {
      if (activePractice?.id === 'uniq-focus' && pomodoroIsActive) {
        setUserCheated(true);
        setCheatedMessage(true);
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [activePractice, pomodoroIsActive]);

  // Native: тёмный статус-бар при запуске
  useEffect(() => {
    StatusBar.setStyle({ style: Style.Dark });
    StatusBar.setBackgroundColor({ color: '#03020c' });
    StatusBar.setOverlaysWebView({ overlay: false });
  }, []);

  // Native: перехват аппаратной кнопки «Назад» и свайпа
  useEffect(() => {
    const unlisten = CapacitorApp.addListener('backButton', () => {
      if (activePractice) {
        setActivePractice(null);
      } else if (showNavigator) {
        setShowNavigator(false);
      } else if (showSubscription) {
        setShowSubscription(false);
      } else if (showRingConfigurator) {
        setShowRingConfigurator(false);
      } else if (showHealthDetail) {
        setShowHealthDetail(false);
      } else if (activeReadingTopic) {
        setActiveReadingTopic(null);
      } else if (location.pathname !== '/today') {
        navigate(-1);
      } else {
        CapacitorApp.exitApp();
      }
    });
    return () => { unlisten.then(h => h.remove()); };
  }, [activePractice, showNavigator, showSubscription, showRingConfigurator, showHealthDetail, activeReadingTopic, location.pathname, navigate]);

  // Breathing loop interval ticking
  useEffect(() => {
    let timer: any;
    if (activePractice?.group === 'Исток' && !activePractice.id.startsWith('uniq')) {
      const isBox = activePractice.id === 'box-breathing';
      if (breathingCyclesCompleted < 4) {
        timer = setInterval(() => {
          setBreathingSecondsLeft(prev => {
            if (prev <= 1) {
              if (isBox) {
                if (breathingPhase === 'inhale') {
                  setBreathingPhase('hold_in');
                  return 4;
                } else if (breathingPhase === 'hold_in') {
                  setBreathingPhase('exhale');
                  return 4;
                } else if (breathingPhase === 'exhale') {
                  setBreathingPhase('hold_out');
                  return 4;
                } else {
                  setBreathingPhase('inhale');
                  setBreathingCyclesCompleted(c => c + 1);
                  return 4;
                }
              } else {
                if (breathingPhase === 'inhale') {
                  setBreathingPhase('hold');
                  return 7; // 4-7-8 hold
                } else if (breathingPhase === 'hold') {
                  setBreathingPhase('exhale');
                  return 8; // 4-7-8 exhale
                } else {
                  setBreathingPhase('inhale');
                  setBreathingCyclesCompleted(c => c + 1);
                  return 4; // 4-7-8 inhale
                }
              }
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        // Complete practice
        handleFinishPractice(activePractice.name, activePractice.duration);
      }
    }
    return () => clearInterval(timer);
  }, [activePractice, breathingPhase, breathingCyclesCompleted]);

  // Focus Pomodoro timer tick interval
  useEffect(() => {
    let interval: any;
    if (activePractice?.id === 'uniq-focus' && pomodoroIsActive) {
      interval = setInterval(() => {
        if (pomodoroSeconds > 0) {
          setPomodoroSeconds(prev => prev - 1);
        } else if (pomodoroMinutes > 0) {
          setPomodoroFocusMinutes(prev => prev - 1);
          setPomodoroSeconds(59);
        } else {
          // completed pomodoro focus block!
          setPomodoroIsActive(false);
          handleFinishPractice(`Фокус: ${pomodoroFocusTitle}`, `${25 - pomodoroMinutes} минут`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePractice, pomodoroIsActive, pomodoroMinutes, pomodoroSeconds]);

  // Fallback timer for Тишина/Энергия/Ясность practices
  useEffect(() => {
    let interval: any;
    if (activePractice && activePractice.group !== 'Исток' && !activePractice.id.startsWith('uniq')) {
      setFallbackTimer(0);
      interval = setInterval(() => {
        setFallbackTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePractice]);

  // Mindful Movement dynamic simulation timers
  useEffect(() => {
    let interval: any;
    if (activePractice?.id === 'uniq-movement' && movementIsActive) {
      interval = setInterval(() => {
        setMovementTimer(prev => prev + 1);
        setMovementDistance(prev => {
          const paceMap = movementType === 'run' ? 0.003 : movementType === 'bike' ? 0.007 : 0.0015;
          return parseFloat((prev + paceMap).toFixed(3));
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activePractice, movementIsActive, movementType]);

  const handleToggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter(fav => fav !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleOpenStores = () => {
    setShowRingConfigurator(true);
  };

  // Launch pre-specified practice
  const handleStartPracticeSelect = (practice: Practice) => {
    setActivePractice(practice);
    
    // reset practice specific states
    setBreathingPhase('inhale');
    setBreathingSecondsLeft(4);
    setBreathingCyclesCompleted(0);

    setPomodoroIsActive(false);
    setPomodoroFocusMinutes(25);
    setPomodoroSeconds(0);
    setDistractionsCount(0);
    setUserCheated(false);
    setCheatedMessage(false);

    setMovementIsActive(false);
    setMovementTimer(0);
    setMovementDistance(0.0);

    setAmbientIsPlaying(false);
  };

  // Finish practice correctly updating user stats and unlocking achievements
  const handleFinishPractice = (title: string, durationStr: string) => {
    // update statistics
    setStats(prev => {
      const isNewStreak = prev.daysStreak < 4 ? prev.daysStreak + 1 : prev.daysStreak;
      return {
        daysPractice: prev.daysPractice + 1,
        ritualsCompleted: prev.ritualsCompleted + 1,
        daysStreak: isNewStreak
      };
    });

    // append to workout logs
    const now = new Date();
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      type: activePractice?.id === 'uniq-movement' ? 'walk' : 'audio',
      date: now.toISOString(),
      durationMinutes: activePractice?.id === 'uniq-movement' ? Math.floor(movementTimer / 60) || 1 : 5,
      distanceKm: activePractice?.id === 'uniq-movement' ? movementDistance : undefined,
      selectedState: healthState,
      cheated: userCheated,
      practiceName: activePractice?.name || title
    };
    setWorkoutLogs([newLog, ...workoutLogs]);

    // trigger success level triggers / achievements
    setAchievements(prev => {
      return prev.map(ach => {
        if (ach.id === 'first_spark') {
          return { ...ach, unlocked: true };
        }
        if (ach.id === 'first_week' && stats.ritualsCompleted + 1 >= 7) {
          return { ...ach, unlocked: true };
        }
        return ach;
      });
    });

    // Close practice sheet and navigate back to progress or today
    setActivePractice(null);
  };

  // Apply AI speech recommendations directly
  const handleApplyAIRecommendation = (rec: any) => {
    // set health states dynamically
    setHealthState(rec.state);
    setHealthScore(rec.state === 'Overload' ? 32 : rec.state === 'Tension' ? 51 : 88);

    // update recommended practice card
    const targetPractice: Practice = {
      id: rec.ritualName.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: rec.ritualName,
      group: rec.ritualGroup,
      duration: rec.duration.replace(/:/g, '.'),
      category: rec.phrase,
      scientificBase: rec.reason,
      howItWorks: rec.instructions,
      result: 'Восстановление ясной позиции',
      isUnlocked: true
    };
    setRecommendedPractice(targetPractice);
    navigate('/today');
  };

  // Soundscapes horizontal library
  const SOUNDSCAPES = [
    { name: 'Фокус Альфа', desc: 'Бинауральный гул 40 Гц для лучшей глубины когнитивной концентрации.', color: 'from-cyan-900 to-slate-900' },
    { name: 'Поток Энергии', desc: 'Изохронные тоны 18 Гц порождают утреннюю бодрость без кофеина.', color: 'from-orange-950 to-slate-950' },
    { name: 'Расслабление Сердца', desc: 'Альфа-волны 10 Гц растворяют фоновую суету и навязчивые мысли.', color: 'from-[#7A9BBA]/40 to-slate-950' },
    { name: 'Сон Тета', desc: 'Глубокий целебный резонанс 30 Гц стимулирует блуждающий нерв в ночь.', color: 'from-purple-950 to-slate-950' },
    { name: 'Тишина Свечи', desc: 'Естественный тихий треск сандаловой свечи и теплая тишина тибетских чаш.', color: 'from-amber-950 to-slate-950' },
    { name: 'Восстановление ВСР', desc: 'Ритмичные низкочастотные волны для стимуляции вегетативной системы.', color: 'from-teal-950 to-slate-950' }
  ];

  // Dynamic Background style filters
  const getBackgroundStyle = () => {
    switch (background) {
      case 'sky':
        return 'bg-gradient-to-tr from-[#02030a] via-[#06041c] to-[#0a1128]';
      case 'aurora':
        return 'bg-gradient-to-tr from-[#020503] via-[#041c10] to-[#0a2818]';
      default:
        return 'bg-gradient-to-tr from-[#03020c] via-[#070b16] to-[#091823]';
    }
  };

  const getBackgroundCircleGlow = () => {
    switch (background) {
      case 'sky':
        return 'bg-purple-500/10';
      case 'aurora':
        return 'bg-emerald-500/10';
      default:
        return 'bg-cyan-500/10';
    }
  };

  return (
    <AnimatePresence mode="wait">
      {!isOnboarded ? (
        <motion.div
          key="onboarding"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <Onboarding onComplete={() => setIsOnboarded(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className={`w-full h-dvh ${getBackgroundStyle()} text-white font-sans overflow-hidden relative flex flex-col selection:bg-amber-400 selection:text-black pt-[max(env(safe-area-inset-top),0px)]`}>
      
      {/* Background Soft Glow Orbs */}
      <div className={`absolute top-24 left-[15%] w-72 h-72 rounded-full ${getBackgroundCircleGlow()} blur-3xl pointer-events-none z-0`} />
      <div className={`absolute bottom-32 right-[10%] w-80 h-80 rounded-full ${getBackgroundCircleGlow()} blur-3xl pointer-events-none z-0`} />

      {/* Main tab viewer container */}
      <main className="w-full flex-1 max-w-md mx-auto z-10 relative pb-10 overflow-y-auto min-h-0 scrollbar-none">
        <AnimatePresence mode="wait">
          {activeTab === 'today' && (
            <motion.div 
              key="today"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <TodayView 
                healthState={healthState}
                healthScore={healthScore}
                userName={userName}
                isPlus={isPlus}
                onOpenProfile={() => navigate('/profile')}
                onOpenPlus={() => setShowSubscription(true)}
                onOpenHealthDetail={() => setShowHealthDetail(true)}
                onStartPractice={handleStartPracticeSelect}
                background={background}
                onChangeBg={(bg) => setBackground(bg)}
                recommendedPractice={recommendedPractice}
                setRecommendedPractice={setRecommendedPractice}
                practiceLogs={workoutLogs}
                onOpenArticle={(art) => setActiveReadingTopic(art)}
                isHealthConnected={isHealthConnected}
                isConnecting={isConnecting}
                isSyncing={isSyncing}
                onConnectHealth={handleConnectHealth}
                realHealthData={realHealthData}
                healthError={healthError}
                onDismissError={() => setHealthError(null)}
              />
            </motion.div>
          )}

          {activeTab === 'practices' && (
            <motion.div 
              key="practices"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <PracticesView 
                isPlus={isPlus}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onStartPractice={handleStartPracticeSelect}
                onOpenPlus={() => setShowSubscription(true)}
                currentLevel={stats.ritualsCompleted + 1}
                onModalOpenChange={setChildModalOpen}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div 
              key="progress"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              <ProgressView 
                stats={stats}
                achievements={achievements}
                healthState={healthState}
                onOpenPlus={() => setShowSubscription(true)}
                onOpenStore={handleOpenStores}
                onOpenArticle={(art) => setActiveReadingTopic(art)}
                practiceLogs={workoutLogs}
                onOpenHeatmap={() => setShowHeatmapModal(true)}
              />
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-6 flex flex-col pt-8"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold font-mono">Профиль Личности</h2>
                <button 
                  onClick={() => navigate('/today')}
                  className="w-8 h-8 rounded-full bg-white/5 active:scale-95 flex items-center justify-center text-white/50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Section 1: Avatar editing */}
              <div className="flex items-center space-x-4 bg-white/[0.02] border border-white/[0.05] rounded-3xl p-5">
                <div className="w-16 h-16 rounded-full border-2 border-[#E6B85C]/60 bg-gradient-to-tr from-purple-400 to-[#E6B85C] flex items-center justify-center text-black font-extrabold text-lg shadow-lg">
                  {userName.substring(0, 1).toUpperCase()}
                </div>
                <div className="flex flex-col flex-1">
                  <input 
                    type="text" 
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-[#E6B85C] focus:outline-none text-white text-base font-medium py-0.5 tracking-wide max-w-[200px]"
                  />
                  <span className="text-[10px] text-white/40 font-mono uppercase mt-0.5">Владелец Кристалла</span>
                </div>
              </div>

              {/* Section 2: Ring connection status */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 flex flex-col space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-white/30 font-mono tracking-wider uppercase">ОБОРУДОВАНИЕ</span>
                    <h3 className="text-sm font-medium text-white/90">Ritual Inside Smart Ring</h3>
                  </div>
                  <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-mono ${ringConnected ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-white/40'}`}>
                    {ringConnected ? 'Подключено 78%' : 'Не подключено'}
                  </span>
                </div>

                {ringConnected ? (
                  <div className="text-xs text-white/50 leading-relaxed font-sans flex flex-col space-y-2">
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Материал:</span>
                      <span className="text-white">{ringConfig.shell}</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-mono">
                      <span>Код гравировки:</span>
                      <span className="text-amber-300 font-bold">{ringConfig.engraving}</span>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowRingConfigurator(true)}
                    className="w-full py-2.5 rounded-xl bg-cyan-400 text-black font-bold text-xs active:scale-95 transition"
                  >
                    Подключить Ritual Core
                  </button>
                )}
              </div>

              {/* Section 3: Background / Space theme */}
              <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 flex flex-col space-y-3">
                <span className="text-[10px] text-white/30 font-mono tracking-wider uppercase">Ритмическое поле</span>
                <div className="grid grid-cols-3 gap-2">
                  {(['water', 'sky', 'aurora'] as const).map((bg) => (
                    <button
                      key={bg}
                      onClick={() => setBackground(bg)}
                      className={`p-3 rounded-2xl border text-xs font-medium transition-all flex flex-col items-center gap-1.5 ${
                        background === bg
                          ? 'bg-white/10 border-[#E6B85C]/40 text-white'
                          : 'bg-white/[0.02] border-white/10 text-white/50 hover:bg-white/5'
                      }`}
                    >
                      {bg === 'water' ? '💧' : bg === 'sky' ? '✨' : '🔥'}
                      <span className="text-[10px]">
                        {bg === 'water' ? 'Вода' : bg === 'sky' ? 'Небо' : 'Аврора'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 4: Subscription terms */}
              <div 
                onClick={() => setShowSubscription(true)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-5 cursor-pointer hover:bg-white/[0.04] transition flex justify-between items-center"
              >
                <div className="flex flex-col space-y-1">
                  <span className="text-[10px] text-[#E6B85C] font-mono uppercase tracking-widest">Ritual Plus</span>
                  <p className="text-xs text-white/50 leading-snug">Полная нейробиологическая библиотека практик активна круглый год.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-white/30" />
              </div>

              {/* Details sections feedback */}
              <div className="flex flex-col space-y-1 text-center py-4 select-text">
                <span className="text-[9px] font-mono text-white/20 uppercase">Ritual system v1.2</span>
                <span className="text-[9px] font-mono text-cyan-400/40">dmitriyganushak@gmail.com</span>
                <button 
                  onClick={() => setIsOnboarded(false)}
                  className="text-[10px] font-mono text-rose-400/50 hover:text-rose-400 underline pt-4"
                >
                  Сбросить онбординг и начать заново
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Embedded Practice Loops Fullscreen Overlay Player */}
      <AnimatePresence>
        {activePractice && (
          <div className="fixed inset-0 bg-[#060814] z-55 flex flex-col justify-between p-6 pointer-events-auto overflow-y-auto">
            
            {/* Top Close trigger */}
            <div className="flex justify-between items-center w-full max-w-sm mx-auto pt-4">
              <span className="text-xs font-mono text-white/40 uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-white/5 bg-white/5">
                {activePractice.group} практикуется
              </span>
              <button 
                onClick={() => setActivePractice(null)}
                className="w-10 h-10 rounded-full bg-white/5 active:scale-95 flex items-center justify-center text-white/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Switch block */}
            <div className="flex-1 w-full max-w-sm mx-auto flex flex-col justify-center items-center py-8">
              
              {/* Scenario 1: standard 4-7-8 deep breathing guide */}
              {activePractice.group === 'Исток' && !activePractice.id.startsWith('uniq') && (
                <div className="flex flex-col items-center text-center space-y-8 w-full p-4">
                  {activePractice.id === 'box-breathing' ? (
                    (() => {
                      const progress = (4 - breathingSecondsLeft) / 4;
                      let cx = 20;
                      let cy = 20;
                      if (breathingPhase === 'inhale') {
                        cx = 20 + progress * 160;
                        cy = 20;
                      } else if (breathingPhase === 'hold_in') {
                        cx = 180;
                        cy = 20 + progress * 160;
                      } else if (breathingPhase === 'exhale') {
                        cx = 180 - progress * 160;
                        cy = 180;
                      } else if (breathingPhase === 'hold_out') {
                        cx = 20;
                        cy = 180 - progress * 160;
                      }
                      
                      return (
                        <div className="flex flex-col items-center text-center space-y-8 w-full">
                          {/* Geometric Square Path */}
                          <div className="relative w-64 h-64 flex items-center justify-center">
                            {/* Ambient colorful pulsing blur */}
                            <motion.div 
                              animate={{ 
                                scale: breathingPhase === 'inhale' ? [1, 1.4, 1.4, 1] : 1,
                                opacity: [0.15, 0.35, 0.35, 0.15]
                              }}
                              transition={{ repeat: Infinity, duration: 16 }}
                              className="w-40 h-40 rounded-[48px] bg-gradient-to-r from-teal-400/20 to-indigo-500/20 blur-2xl absolute"
                            />
                            
                            {/* Inner Breathing Circle pulsing */}
                            <motion.div 
                              animate={{ 
                                scale: breathingPhase === 'inhale' ? 1.25 : breathingPhase === 'hold_in' ? 1.25 : 0.9
                              }}
                              transition={{ duration: 4, ease: "easeInOut" }}
                              className="w-28 h-28 rounded-full bg-slate-950/60 border border-white/10 flex flex-col items-center justify-center relative backdrop-blur-md z-10"
                            >
                              <span className="text-[10px] font-mono tracking-widest text-white/30 uppercase">секунд</span>
                              <h3 className="text-3xl font-extrabold font-mono text-white mt-1">{breathingSecondsLeft}</h3>
                            </motion.div>

                            {/* SVG Track representing the actual breathing square */}
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                              {/* Background default square */}
                              <rect x="20" y="20" width="160" height="160" rx="32" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="4" />
                              
                              {/* Animated active path */}
                              <rect x="20" y="20" width="160" height="160" rx="32" fill="none" 
                                stroke={
                                  breathingPhase === 'inhale' ? 'url(#grad-teal)' :
                                  breathingPhase === 'hold_in' ? 'url(#grad-amber)' :
                                  breathingPhase === 'exhale' ? 'url(#grad-blue)' :
                                  'url(#grad-purple)'
                                } 
                                strokeWidth="4" 
                                strokeDasharray="640"
                                strokeDashoffset={
                                  breathingPhase === 'inhale' ? 640 - progress * 160 :
                                  breathingPhase === 'hold_in' ? 480 - progress * 160 :
                                  breathingPhase === 'exhale' ? 320 - progress * 160 :
                                  160 - progress * 160
                                }
                                strokeLinecap="round"
                              />

                              {/* Glowing Target Sphere */}
                              <circle 
                                cx={cx} 
                                cy={cy} 
                                r="8" 
                                fill={
                                  breathingPhase === 'inhale' ? '#2dd4bf' :
                                  breathingPhase === 'hold_in' ? '#fbbf24' :
                                  breathingPhase === 'exhale' ? '#60a5fa' :
                                  '#c084fc'
                                }
                                style={{ filter: 'drop-shadow(0px 0px 8px currentColor)' }}
                              />
                              
                              {/* Definitions for gorgeous gradients */}
                              <defs>
                                <linearGradient id="grad-teal" x1="0%" y1="0%" x2="100%" y2="0%">
                                  <stop offset="0%" stopColor="#0d9488" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#2dd4bf" />
                                </linearGradient>
                                <linearGradient id="grad-amber" x1="100%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#d97706" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#fbbf24" />
                                </linearGradient>
                                <linearGradient id="grad-blue" x1="100%" y1="100%" x2="0%" y2="100%">
                                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#60a5fa" />
                                </linearGradient>
                                <linearGradient id="grad-purple" x1="0%" y1="100%" x2="0%" y2="0%">
                                  <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.2" />
                                  <stop offset="100%" stopColor="#c084fc" />
                                </linearGradient>
                              </defs>
                            </svg>
                          </div>

                          <div className="flex flex-col space-y-1 py-1 z-10 select-none">
                            <span className="text-base font-semibold tracking-wide text-amber-200">
                              {breathingPhase === 'inhale' && 'Вдох носом • Живот надувается'}
                              {breathingPhase === 'hold_in' && 'Задержка • Легкие полны покоя'}
                              {breathingPhase === 'exhale' && 'Выдох ртом • Полное расслабление'}
                              {breathingPhase === 'hold_out' && 'Задержка • Приятная пустота'}
                            </span>
                            <span className="text-xs text-white/40 font-mono uppercase tracking-widest">Цикл {breathingCyclesCompleted + 1} из 4</span>
                          </div>
                        </div>
                      )
                    })()
                  ) : (
                    <>
                      {/* Animating breathing circle */}
                      <div className="relative w-64 h-64 flex items-center justify-center">
                        <motion.div 
                          animate={{ 
                            scale: breathingPhase === 'inhale' ? 1.5 : breathingPhase === 'hold' ? 1.5 : 0.95
                          }}
                          transition={{ 
                            duration: breathingPhase === 'inhale' ? 4 : breathingPhase === 'hold' ? 0.1 : 8,
                            ease: "easeInOut"
                          }}
                          className="w-36 h-32 rounded-full bg-gradient-to-r from-amber-400/20 to-purple-400/20 blur-xl absolute"
                        />

                        <motion.div 
                          animate={{ 
                            scale: breathingPhase === 'inhale' ? 1.4 : breathingPhase === 'hold' ? 1.4 : 0.95
                          }}
                          transition={{ 
                            duration: breathingPhase === 'inhale' ? 4 : breathingPhase === 'hold' ? 0.1 : 8,
                            ease: "easeInOut"
                          }}
                          className="w-36 h-36 rounded-full border-2 border-amber-400/30 flex items-center justify-center"
                        >
                          <h3 className="text-4xl font-bold font-mono text-white tracking-widest">{breathingSecondsLeft}</h3>
                        </motion.div>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-md uppercase font-mono tracking-widest text-[#E6B85C]">
                          {breathingPhase === 'inhale' && 'Вдох носом (Раз, два...)'}
                          {breathingPhase === 'hold' && 'Задержка (Все замерло)'}
                          {breathingPhase === 'exhale' && 'Выдох облегчения («ха»)'}
                        </span>
                        <span className="text-xs text-white/40 font-mono">Цикл {breathingCyclesCompleted + 1} из 4</span>
                      </div>
                    </>
                  )}

                  <p className="text-xs text-white/50 leading-relaxed font-sans max-w-[280px]">
                    {activePractice.howItWorks || 'Синхронизируйте дыхание с ритмичной геометрией квадрата.'}
                  </p>
                </div>
              )}

              {/* Scenario 2: Unique Mindful Movement selector / active tracker */}
              {activePractice.id === 'uniq-movement' && (
                <div className="flex flex-col space-y-6 w-full p-4">
                  {movementIsActive ? (
                    <div className="flex flex-col items-center space-y-6 text-center">
                      {/* Interactive Radar stepping circle */}
                      <div className="relative w-48 h-48 flex items-center justify-center">
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.15, 1],
                            opacity: [0.15, 0.4, 0.15]
                          }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                          className="absolute inset-0 rounded-full bg-[#E67E22]/10 border border-[#E67E22]/20"
                        />
                        <div className="absolute w-36 h-36 rounded-full border border-white/5 flex items-center justify-center bg-slate-950/20">
                          <Compass className="w-10 h-10 text-[#E67E22] animate-spin-slow" />
                        </div>
                        
                        {/* Animated footing circles */}
                        <motion.div 
                          animate={{ 
                            scale: [0.8, 1.3, 0.8],
                            opacity: [0.3, 0.8, 0.3]
                          }}
                          transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                          className="absolute w-6 h-6 rounded-full border border-[#E67E22] bg-[#E67E22]/20 shadow shadow-orange-500/30" 
                        />
                      </div>

                      <div className="flex flex-col select-none">
                        <span className="text-[10px] text-white/40 tracking-widest font-mono uppercase">Дистанция</span>
                        <h4 className="text-5xl font-mono font-bold tracking-tight text-white mb-1">{movementDistance} км</h4>
                        <span className="text-xs text-[#E67E22] font-mono tracking-wider">ОСОЗНАННЫЙ МЕРНЫЙ ШАГ</span>
                      </div>

                      {/* Mindful stepping breath syncer */}
                      <div className="p-4 bg-slate-950/50 border border-white/5 rounded-3xl w-full text-center space-y-2">
                        <span className="text-[9px] font-mono text-amber-200 uppercase tracking-widest">Дыхание по шагам (Вдох 4 — Выдох 4)</span>
                        <div className="flex justify-center items-center space-x-6">
                          <motion.div
                            animate={{ opacity: [0.4, 1, 0.4] }}
                            transition={{ repeat: Infinity, duration: 4, times: [0, 0.5, 1] }}
                            className="flex items-center space-x-1.5"
                          >
                            <span className="text-xs text-white/50">Вдох:</span>
                            <span className="text-xs font-semibold text-[#E67E22] tracking-wider">● ● ● ●</span>
                          </motion.div>
                          <motion.div
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 4, times: [0, 0.5, 1] }}
                            className="flex items-center space-x-1.5"
                          >
                            <span className="text-xs text-white/50">Выдох:</span>
                            <span className="text-xs font-semibold text-teal-400 tracking-wider">● ● ● ●</span>
                          </motion.div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center">
                          <span className="text-[9px] font-mono text-white/30 uppercase">Время в пути</span>
                          <span className="text-sm font-semibold font-mono text-white mt-1 block">
                            {Math.floor(movementTimer / 60)}:{(movementTimer % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <div className="p-3 bg-white/5 border border-white/5 rounded-2xl text-center">
                          <span className="text-[9px] font-mono text-white/30 uppercase">Текущий темп</span>
                          <span className="text-sm font-semibold font-mono text-white mt-1 block">{simicatedPace} м/км</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Heart className="w-4 h-4 text-rose-500 animate-ping" />
                        <span className="text-xs font-mono text-white/50">ЧСС (Сенсор): 118 уд/мин</span>
                      </div>

                      <button 
                        onClick={() => {
                          handleFinishPractice('Движение', `${Math.floor(movementTimer / 60)} мин`);
                        }}
                        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-lg shadow-orange-500/20 active:scale-95 transition"
                      >
                        Завершить прогулку
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <h3 className="text-lg font-bold text-center text-white/95">Осознанное движение</h3>
                      <p className="text-xs text-center text-white/50 leading-relaxed max-w-[280px] mx-auto">
                        Прогулка, бег или велосипед возвращают внимание в тело сквозь мерный шаг. Выберите тип:
                      </p>

                      <div className="grid grid-cols-3 gap-2 py-4">
                        {(['walk', 'run', 'bike'] as any[]).map((type) => (
                           <button 
                            key={type}
                            onClick={() => {
                              setMovementType(type);
                              setSimulatedPace(type === 'run' ? '5:10' : type === 'bike' ? '18 км/ч' : '9:30');
                            }}
                            className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-2 ${movementType === type ? 'border-[#E67E22] bg-[#E67E22]/10 text-white' : 'border-white/5 bg-white/5 text-white/60'}`}
                          >
                            <span className="text-[10px] font-mono uppercase font-semibold">{type === 'walk' ? 'Пешком' : type === 'run' ? 'Бег' : 'Вело'}</span>
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          setMovementIsActive(true);
                          setMovementTimer(0);
                        }}
                        className="w-full py-3.5 rounded-2xl bg-white text-black font-semibold text-xs active:scale-95 transition"
                      >
                        Начать прогулку
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Scenario 3: Unique Focus countdown clock */}
              {activePractice.id === 'uniq-focus' && (
                <div className="flex flex-col space-y-6 w-full p-4 select-none">
                  {pomodoroIsActive ? (
                    <div className="flex flex-col items-center space-y-6 text-center">
                      
                      {/* Circular Dynamic Dial */}
                      <div className="relative w-56 h-56 flex items-center justify-center">
                        {/* Waving fluid backdrop inside */}
                        <motion.div 
                          animate={{ 
                            scale: [1, 1.12, 1],
                            opacity: [0.3, 0.45, 0.3],
                            rotate: 360
                          }}
                          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                          className="absolute w-44 h-44 rounded-[50%] bg-gradient-to-tr from-cyan-500/10 via-teal-500/5 to-purple-500/10 blur-xl pointer-events-none"
                        />
                        
                        {/* Elegant Countdown Value */}
                        <div className="relative z-10 flex flex-col items-center justify-center">
                          <Eye className="w-5 h-5 text-[#A8D5E5] animate-pulse mb-1" />
                          <h2 className="text-4xl font-extrabold font-mono text-white tracking-widest">
                            {pomodoroMinutes.toString().padStart(2, '0')}:{pomodoroSeconds.toString().padStart(2, '0')}
                          </h2>
                          <span className="text-[9px] font-mono uppercase tracking-wider text-white/30 mt-1">Осталось минут</span>
                        </div>

                        {/* Dial SVG Track */}
                        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
                          {/* Inner circle track */}
                          <circle cx="100" cy="100" r="82" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="4" />
                          {/* Active ticking indicator segment */}
                          <motion.circle 
                            cx="100" 
                            cy="100" 
                            r="82" 
                            fill="none" 
                            stroke="#A8D5E5" 
                            strokeWidth="4"
                            strokeDasharray="515"
                            strokeDashoffset={515 - (515 * (pomodoroMinutes * 60 + pomodoroSeconds)) / (25 * 60 || 1)}
                            strokeLinecap="round"
                            transform="rotate(-90 100 100)"
                            style={{ filter: 'drop-shadow(0 0 4px rgba(168,213,229,0.4))' }}
                          />
                        </svg>
                      </div>

                      <div className="flex flex-col space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-widest text-[#A8D5E5]">идёт сессия фокуса</span>
                        <h4 className="text-base font-semibold text-white/90">{pomodoroFocusTitle}</h4>
                      </div>

                      {/* I got distracted button */}
                      <button 
                        onClick={() => setDistractionsCount(c => c + 1)}
                        className="px-6 py-2.5 rounded-full bg-slate-950/60 border border-orange-500/20 text-orange-300 text-xs font-semibold active:scale-95 transition shadow-lg flex items-center space-x-2"
                      >
                        <span>Я отвлекся!</span>
                        {distractionsCount > 0 && (
                          <span className="bg-orange-500 text-black font-extrabold text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-mono">
                            {distractionsCount}
                          </span>
                        )}
                      </button>

                      {cheatedMessage && (
                        <div className="p-3.5 bg-rose-500/10 border border-rose-500/15 rounded-2xl text-[10px] text-rose-300 text-center max-w-[260px] leading-relaxed">
                          ⚠️ Вы свернули приложение — фокус прерван. Субъективная награда Кристалла будет снижена.
                        </div>
                      )}

                      <div className="flex space-x-3 w-full pt-2">
                        <button 
                          onClick={() => setPomodoroIsActive(!pomodoroIsActive)}
                          className="flex-1 py-3 rounded-2xl border border-white/10 bg-white/5 text-xs text-white/80 active:scale-95 transition"
                        >
                          {pomodoroIsActive ? 'Пауза фокуса' : 'Продолжить'}
                        </button>
                        <button 
                          onClick={() => {
                            handleFinishPractice(`Фокус: ${pomodoroFocusTitle}`, `${25 - pomodoroMinutes} мин`);
                          }}
                          className="flex-1 py-3 bg-[#A8D5E5] text-black font-semibold text-xs rounded-2xl active:scale-95 transition"
                        >
                          Завершить сессию
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <h3 className="text-lg font-bold text-center text-white/95">Фокус ума</h3>
                      
                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Что делаем?</label>
                        <input 
                          type="text" 
                          value={pomodoroFocusTitle}
                          onChange={(e) => setPomodoroFocusTitle(e.target.value)}
                          className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#A8D5E5] transition"
                        />
                      </div>

                      <div className="flex flex-col space-y-1.5">
                        <label className="text-[11px] font-mono text-white/40 uppercase tracking-wider">Длительность работы (мин)</label>
                        <input 
                          type="number" 
                          value={pomodoroMinutes}
                          onChange={(e) => setPomodoroFocusMinutes(Number(e.target.value))}
                          className="bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs text-white outline-none focus:border-[#A8D5E5] transition"
                        />
                      </div>

                      <button 
                        onClick={() => {
                          setPomodoroIsActive(true);
                          setPomodoroSeconds(0);
                        }}
                        className="w-full py-3.5 bg-white text-black font-semibold text-xs rounded-2xl active:scale-95 transition shadow-lg"
                      >
                        Начать сессию
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Scenario 4: "Свечение" Horizontal audio visualizer */}
              {activePractice.id === 'uniq-glow' && (
                <div className="flex flex-col items-center space-y-4 w-full px-2">
                  {/* Top info */}
                  <div className="flex flex-col space-y-1 text-center select-none">
                    <span className="text-[10px] text-[#fbbf24]/60 font-mono tracking-widest uppercase">Медитация Свечения & Звука</span>
                    <h3 className="text-xl font-bold text-white tracking-wide">{SOUNDSCAPES[ambientTrackIndex].name}</h3>
                  </div>

                  {/* Pulsing glow aura (always animates to avoid layout shift) */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <motion.div 
                      key={ambientTrackIndex + '-aura'}
                      animate={{ scale: [1, 1.25, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className={`absolute inset-0 rounded-full blur-3xl pointer-events-none ${
                        ambientTrackIndex === 0 ? 'bg-amber-500/30' :
                        ambientTrackIndex === 1 ? 'bg-purple-500/30' :
                        ambientTrackIndex === 2 ? 'bg-emerald-500/30' :
                        'bg-sky-500/30'
                      }`}
                    />
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      {ambientTrackIndex === 0 ? (
                        <div className="relative flex flex-col items-center">
                          <motion.div
                            animate={{ scaleY: [1, 1.1, 0.95, 1.05, 1], scaleX: [1, 0.97, 1.05, 0.95, 1] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                            className="w-8 h-14 bg-gradient-to-t from-orange-600 via-amber-400 to-amber-100 rounded-t-full shadow-[0_0_20px_rgba(245,158,11,0.5)] z-10"
                            style={{ borderRadius: "50% 50% 20% 20% / 60% 60% 40% 40%" }}
                          />
                          <div className="w-8 h-12 bg-gradient-to-r from-stone-800 to-stone-700/80 rounded-b-xl border-t border-amber-500/20 flex items-center justify-center">
                            <span className="text-[7px] font-mono text-white/20 uppercase">ЗЕН</span>
                          </div>
                          <div className="absolute top-[46px] w-0.5 h-2.5 bg-stone-950 rounded-t-full z-10" />
                        </div>
                      ) : (
                        <motion.div
                          animate={{ scale: [1, 1.1, 0.97, 1], rotate: [0, 360] }}
                          transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                          className={`w-20 h-20 rounded-full border border-white/20 bg-gradient-to-tr flex items-center justify-center shadow-2xl ${
                            ambientTrackIndex === 1 ? 'from-purple-600/30 via-pink-500/20 to-violet-900/60' :
                            ambientTrackIndex === 2 ? 'from-emerald-600/30 via-teal-500/20 to-cyan-900/60' :
                            'from-sky-600/30 via-blue-500/20 to-indigo-900/60'
                          }`}
                        >
                          <Volume2 className="w-6 h-6 text-white/80" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Sound bars with deterministic heights (no Math.random) */}
                  <div className="flex items-end justify-center space-x-1 h-10 w-full max-w-[260px]">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((i) => {
                      const base = i % 2 === 0 ? 16 : 10;
                      return (
                        <motion.div
                          key={i}
                          animate={{ height: [base, base + (i % 3) * 8 + 6, base] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.6 + (i % 4) * 0.15,
                            ease: "easeInOut",
                            delay: (i % 5) * 0.08
                          }}
                          className={`w-1 rounded-full ${
                            ambientTrackIndex === 0 ? 'bg-amber-400/70' :
                            ambientTrackIndex === 1 ? 'bg-purple-400/70' :
                            ambientTrackIndex === 2 ? 'bg-emerald-400/70' :
                            'bg-sky-400/70'
                          }`}
                        />
                      );
                    })}
                  </div>

                  <p className="text-[11px] text-center text-white/50 px-4 font-sans select-none">
                    {SOUNDSCAPES[ambientTrackIndex].desc}
                  </p>

                  {/* Track tabs */}
                  <div className="flex flex-wrap justify-center gap-2">
                    {SOUNDSCAPES.map((t, idx) => (
                      <button 
                        key={idx}
                        onClick={() => { setAmbientTrackIndex(idx); }}
                        className={`shrink-0 px-3 py-1.5 rounded-2xl text-[10.5px] font-mono transition-colors ${
                          ambientTrackIndex === idx
                            ? 'bg-white text-black font-semibold'
                            : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {t.name}
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={() => setAmbientIsPlaying(!ambientIsPlaying)}
                    className="w-full py-3 rounded-2xl bg-white text-black font-semibold text-xs active:scale-95 transition"
                  >
                    {ambientIsPlaying ? 'Поставить на паузу' : 'Запустить воспроизведение'}
                  </button>
                </div>
              )}

              {/* Fallback: Тишина / Энергия / Ясность — spectrogram + practice info */}
              {activePractice.group !== 'Исток' && !activePractice.id.startsWith('uniq') && (
                <div className="flex flex-col items-center text-center space-y-8 w-full p-4">
                  <div className="relative w-64 h-64 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      className={`w-48 h-48 rounded-full blur-3xl absolute pointer-events-none ${
                        activePractice.group === 'Тишина' ? 'bg-[#7A9BBA]/20' :
                        activePractice.group === 'Энергия' ? 'bg-[#E67E22]/20' :
                        'bg-[#A8D5E5]/20'
                      }`}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.08, 1] }}
                      transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                      className={`w-36 h-36 rounded-full border-2 flex items-center justify-center ${
                        activePractice.group === 'Тишина' ? 'border-[#7A9BBA]/30' :
                        activePractice.group === 'Энергия' ? 'border-[#E67E22]/30' :
                        'border-[#A8D5E5]/30'
                      }`}
                    >
                      <span className="text-4xl font-bold font-mono text-white/80">
                        {String(Math.floor(fallbackTimer / 60)).padStart(2, '0')}:{String(fallbackTimer % 60).padStart(2, '0')}
                      </span>
                    </motion.div>
                  </div>
                  <div className="flex flex-col space-y-3 max-w-[280px]">
                    <h3 className="text-[20px] font-display font-medium text-white/95">{activePractice.name}</h3>
                    <p className="text-xs text-white/50 leading-relaxed font-sans">
                      {activePractice.howItWorks || activePractice.scientificBase || `Практика группы «${activePractice.group}»`}
                    </p>
                    <div className="flex flex-wrap justify-center gap-2 mt-1">
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                        {activePractice.category}
                      </span>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/5 text-white/40 border border-white/5">
                        {activePractice.duration}
                      </span>
                    </div>
                  </div>
                  {/* Spectrogram bars */}
                  <div className="flex items-end justify-center space-x-1.5 h-16 w-full max-w-xs">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          height: [8, Math.random() * 40 + 8, 8]
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 0.6 + i * 0.08,
                          ease: "easeInOut",
                          delay: i * 0.12
                        }}
                        className={`w-1 rounded-full ${
                          activePractice.group === 'Тишина' ? 'bg-[#7A9BBA]/50' :
                          activePractice.group === 'Энергия' ? 'bg-[#E67E22]/50' :
                          'bg-[#A8D5E5]/50'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom complete practice button trigger */}
            <div className="w-full max-w-sm mx-auto pb-[max(6px,env(safe-area-inset-bottom,6px))]">
              <button 
                onClick={() => {
                  handleFinishPractice(activePractice.name, activePractice.duration);
                }}
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/10 active:scale-95 transition"
              >
                Завершить ритуал полностью
              </button>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Embedded Ritual Health Detailed Screen Bottom Modal */}
      <HealthDetailsModal 
        isOpen={showHealthDetail}
        onClose={() => setShowHealthDetail(false)}
        healthScore={healthScore}
        healthData={realHealthData}
      />
      <PracticeHistoryModal
        isOpen={showHeatmapModal}
        onClose={() => setShowHeatmapModal(false)}
        practiceLogs={workoutLogs}
      />

      {/* Global Useful Reading Bottom Sheet Article Reader */}
      <AnimatePresence>
        {activeReadingTopic && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-45 flex items-end justify-center pointer-events-auto">
            {/* Hit space close */}
            <div className="absolute inset-0" onClick={() => setActiveReadingTopic(null)} />

            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="w-full max-w-md bg-[#090b14ef] border-t border-white/[0.12] rounded-t-[36px] p-6 pb-[max(12px,env(safe-area-inset-bottom,12px))] z-50 flex flex-col space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-mono text-[#E6B85C]">Полезное чтение</span>
                  <h3 className="text-lg font-bold text-white/95">{activeReadingTopic.title}</h3>
                </div>
                <button 
                  onClick={() => setActiveReadingTopic(null)}
                  className="w-8 h-8 rounded-full bg-white/5 active:scale-90 flex items-center justify-center text-white/60 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-sm text-white/80 leading-relaxed font-sans space-y-4 pt-2 whitespace-pre-line">
                {activeReadingTopic.content}
              </div>

              <div className="pt-4 border-t border-white/5 flex flex-col space-y-0.5">
                <span className="text-[10px] text-white/40 font-mono">Тема: Attention Recovery</span>
                <span className="text-[10px] text-white/40 font-mono">В основе материала — нейробиологические исследования ВСР и внимания</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {!activePractice && !showHealthDetail && !showNavigator && !showSubscription && !showRingConfigurator && !activeReadingTopic && !childModalOpen && !showHeatmapModal && (
        <BottomTabBar activeTab={activeTab} onMicPress={() => setShowNavigator(true)} />
      )}

      {/* Floating Modals Connections */}
      <NavigatorModal 
        isOpen={showNavigator}
        onClose={() => setShowNavigator(false)}
        onApplyRecommendation={handleApplyAIRecommendation}
        onStartPractice={handleStartPracticeSelect}
      />

      <SubscriptionPlus 
        isOpen={showSubscription}
        onClose={() => setShowSubscription(false)}
        onUnlockPlus={() => setIsPlus(true)}
        alreadyPlus={isPlus}
      />

      <RingCustomizer 
        isOpen={showRingConfigurator}
        onClose={() => setShowRingConfigurator(false)}
        onConnectRing={() => {
          setRingConnected(true);
          setRingConfig({
            shell: 'Glow Obsidian',
            engraving: 'Я здесь'
          });
        }}
      />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
