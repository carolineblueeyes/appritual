export interface MoodCard {
  id: string;
  emoji: string;
  label: string;
  description: string;
  ritualId: string;
  group: string;
  gradient: string;
  color: string;
}

export const MOODS: MoodCard[] = [
  {
    id: "anxiety",
    emoji: "😰",
    label: "Тревога",
    description: "Экстренный сброс ума через сенсорные сигналы",
    ritualId: "5-4-3-2-1",
    group: "Исток",
    gradient: "radial-gradient(circle at 30% 30%, #7A9BBA 0%, #5A7A9A 40%, #3A5A7A 100%)",
    color: "#7A9BBA",
  },
  {
    id: "tired",
    emoji: "😴",
    label: "Усталость",
    description: "Когнитивное закрытие дня через 3 вопроса",
    ritualId: "night_journal",
    group: "Тишина",
    gradient: "radial-gradient(circle at 30% 30%, #8899AA 0%, #6A7B8C 40%, #4A5B6C 100%)",
    color: "#8899AA",
  },
  {
    id: "no_energy",
    emoji: "⚡",
    label: "Нет энергии",
    description: "Утренняя физическая активация и якорь намерения",
    ritualId: "day_code",
    group: "Энергия",
    gradient: "radial-gradient(circle at 30% 30%, #D4875E 0%, #B4673E 40%, #94471E 100%)",
    color: "#D4875E",
  },
  {
    id: "empty",
    emoji: "😐",
    label: "Пустота",
    description: "Бокс-бризинг спецслужб для синхронизации мозга",
    ritualId: "square_breath",
    group: "Исток",
    gradient: "radial-gradient(circle at 30% 30%, #C9A96E 0%, #A9894E 40%, #89692E 100%)",
    color: "#C9A96E",
  },
  {
    id: "irritation",
    emoji: "😡",
    label: "Раздражение",
    description: "Сдувание пепла апатии и запуск диафрагмы",
    ritualId: "fire_breath",
    group: "Энергия",
    gradient: "radial-gradient(circle at 30% 30%, #FF6B6B 0%, #DF4B4B 40%, #BF2B2B 100%)",
    color: "#FF6B6B",
  },
  {
    id: "fog",
    emoji: "🧠",
    label: "Туман в голове",
    description: "Освобождение ума от хаоса многозадачности",
    ritualId: "priorities",
    group: "Ясность",
    gradient: "radial-gradient(circle at 30% 30%, #8AB4C8 0%, #6A94A8 40%, #4A7488 100%)",
    color: "#8AB4C8",
  },
  {
    id: "calm",
    emoji: "😊",
    label: "Спокойствие",
    description: "MBSR-практика снятия скрытого панциря зажимов",
    ritualId: "body_scan",
    group: "Исток",
    gradient: "radial-gradient(circle at 30% 30%, #7BC47F 0%, #5BA45F 40%, #3B843F 100%)",
    color: "#7BC47F",
  },
];
