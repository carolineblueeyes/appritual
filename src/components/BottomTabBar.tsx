import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Calendar, BookOpen, Compass, User, Mic } from 'lucide-react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface BottomTabBarProps {
  activeTab: 'today' | 'practices' | 'progress' | 'profile';
  onMicPress: () => void;
}

export default function BottomTabBar({ activeTab, onMicPress }: BottomTabBarProps) {
  const navigate = useNavigate();

  const tabs = [
    { key: 'today' as const, icon: Calendar, label: 'Сегодня', path: '/today' },
    { key: 'practices' as const, icon: BookOpen, label: 'Практики', path: '/practices' },
    { key: 'progress' as const, icon: Compass, label: 'Прогресс', path: '/progress' },
    { key: 'profile' as const, icon: User, label: 'Профиль', path: '/profile' },
  ];

  const handleTabClick = (path: string) => {
    Haptics.impact({ style: ImpactStyle.Light });
    navigate(path);
  };

  return (
    <footer className="fixed bottom-[max(6px,env(safe-area-inset-bottom,6px))] left-0 right-0 z-40 pointer-events-none">
      <div className="flex items-center justify-between w-full max-w-md mx-auto px-4 pointer-events-auto">
        <div className="flex-1 flex items-center bg-[#0c101cb3] border border-white/10 rounded-[28px] px-3 py-1.5 backdrop-blur-2xl shadow-2xl mr-3">
          {tabs.map(({ key, icon: Icon, label, path }) => (
            <button
              key={key}
              onClick={() => handleTabClick(path)}
              className="relative flex flex-col items-center justify-center flex-1 h-11 rounded-full transition-transform active:scale-95"
            >
              {activeTab === key && (
                <motion.div
                  layoutId="active-tab-glow"
                  className="absolute inset-0 bg-white/[0.08] border border-white/5 rounded-full z-0"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <div className={`relative z-10 flex flex-col items-center justify-center transition-colors ${activeTab === key ? 'text-[#E6B85C]' : 'text-white/40 hover:text-white'}`}>
                <Icon className="w-4.5 h-4.5 mb-0.5" />
                <span className="text-[9px] font-semibold">{label}</span>
              </div>
            </button>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.90 }}
          onClick={onMicPress}
          className="w-14 h-14 shrink-0 rounded-full bg-gradient-to-tr from-amber-400 via-[#E6B85C] to-yellow-500 flex items-center justify-center text-black shadow-xl shadow-amber-500/15 cursor-pointer"
          title="Голосовой ИИ ассистент"
        >
          <Mic className="w-5.5 h-5.5 stroke-[2.5]" />
        </motion.button>
      </div>
    </footer>
  );
}
