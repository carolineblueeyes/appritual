export type HealthState = 'Shining' | 'Balance' | 'Tension' | 'Overload' | 'NoData';

export type PracticeGroupType = 'Исток' | 'Тишина' | 'Энергия' | 'Ясность';

export interface Practice {
  id: string;
  name: string;
  group: PracticeGroupType;
  duration: string; // e.g. "5:30" or "4:30"
  category: string;
  scientificBase: string;
  howItWorks: string;
  result: string;
  isUnlocked: boolean; // True for Исток, or if user is Ritual Plus
}

export interface UserStats {
  daysPractice: number;
  ritualsCompleted: number;
  daysStreak: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconType: string; // e.g. "spark", "ring", "points", "sevenDots", "thirtyDots", "runner", "crystalOne", "crystalThree", "focus", "heart", "road", "crystalRow"
  unlocked: boolean;
}

export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
}

export interface RingSetup {
  shell: 'Matte Titanium' | 'Glow Obsidian';
  engraving: string;
}

export interface ActivityLog {
  id: string;
  type: 'walk' | 'run' | 'bike' | 'focus' | 'audio' | 'breathing';
  date: string;
  durationMinutes: number;
  distanceKm?: number;
  avgPace?: string;
  selectedState?: HealthState;
  cheated?: boolean;
  practiceName?: string;
}

export interface EmotionPreset {
  id: string;
  label: string;
  description: string;
  practiceId: string;
  healthState: HealthState;
}

export interface NavigatorRecomendation {
  state: HealthState;
  phrase: string;
  reason: string;
  ritualName: string;
  ritualGroup: PracticeGroupType;
  duration: string;
  instructions: string;
}

export interface PathwayLevel {
  id: string;
  chapterIndex: number; // 1, 2, 3, 4
  levelIndex: number; // 1 to 5 (or 6)
  name: string;
  description: string;
  duration: string;
  group: PracticeGroupType;
  overallIndex: number; // 0 to 20
}

export interface MetricEffect {
  metric: string;
  label: string;
  change: number;
}

export interface PracticeImpact {
  ritualId: string;
  ritualTitle: string;
  group: string;
  date: string;
  effects: MetricEffect[];
}

// ===== Типы для скриптов ритуалов (из документа RITUAL) =====

export type PhaseType = 'пролог' | 'вступление' | 'практика' | 'микро_чек' | 'инсайт' | 'ключевая_фраза' | 'задание' | 'закрытие';

export interface VoiceInstruction {
  text: string;
  tone?: 'мягкий' | 'уверенный' | 'глубокий' | 'нейтральный' | 'энергичный' | 'шёпот';
  tempo?: 'медленный' | 'средний' | 'быстрый';
}

export interface MusicLayer {
  padFreq?: number;
  instrument?: string;
  volume?: number;
  binauralBeat?: { left: number; right: number };
  isochronicTone?: number;
}

export interface HapticSpec {
  pattern: 'continuous' | 'pulse' | 'wave' | 'chime' | 'none';
  intensity: number;
  frequency?: number;
}

export interface RingTriggerCondition {
  metric: 'hrv' | 'heartRate' | 'stressLevel' | 'kgr' | 'sleepDuration';
  operator: 'lt' | 'gt' | 'between';
  value: number | [number, number];
}

export interface RingTrigger {
  type: 'hard' | 'soft';
  condition: RingTriggerCondition;
  hapticPattern: 'calm_pulse' | 'tense_tap' | 'overload_silent' | 'completion_chime';
}

export interface ScriptSegment {
  phase: PhaseType;
  from: number;
  to: number;
  voice?: VoiceInstruction;
  music?: MusicLayer;
  haptic?: HapticSpec;
  ringTrigger?: RingTrigger;
}

export interface HealthImpact {
  metric: string;
  expectedChange: number;
  confidence: 'high' | 'medium' | 'low';
}

export interface PostRitualLink {
  ritualId: string;
  group: PracticeGroupType;
  reason: string;
}

export interface RitualScript {
  ritualId: string;
  group: PracticeGroupType;
  title: string;
  durationSeconds: number;
  category: string;
  scientificBase: string;
  howItWorks: string;
  segments: ScriptSegment[];
  expectedImpacts: HealthImpact[];
  postLinks: PostRitualLink[];
}

