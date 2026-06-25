import { EmotionPreset } from '../types';

export const EMOTION_PRESETS: EmotionPreset[] = [
  {
    id: 'anxiety',
    label: 'Тревога',
    description: 'Учащённый пульс, мысли скачут',
    practiceId: '5-4-3-2-1',
    healthState: 'Tension'
  },
  {
    id: 'irritation',
    label: 'Раздражение',
    description: 'Всё бесит, внутри клокочет',
    practiceId: 'box-breathing',
    healthState: 'Tension'
  },
  {
    id: 'tired',
    label: 'Усталость',
    description: 'Нет сил, тяжесть во всём теле',
    practiceId: 'physio-sigh',
    healthState: 'Overload'
  },
  {
    id: 'apathy',
    label: 'Апатия',
    description: 'Пустота, ничего не хочется',
    practiceId: 'energy-release',
    healthState: 'Overload'
  },
  {
    id: 'fog',
    label: 'Туман в голове',
    description: 'Не могу сфокусироваться',
    practiceId: 'orientation-eyes',
    healthState: 'Tension'
  },
  {
    id: 'calm',
    label: 'Спокойствие',
    description: 'Тишина и покой внутри',
    practiceId: 'uniq-breath',
    healthState: 'Balance'
  },
  {
    id: 'energetic',
    label: 'Бодрость',
    description: 'Полон энергии и готов действовать',
    practiceId: 'day-code',
    healthState: 'Shining'
  },
  {
    id: 'focus',
    label: 'Хочу фокус',
    description: 'Нужна концентрация без отвлечений',
    practiceId: 'uniq-focus',
    healthState: 'Balance'
  },
  {
    id: 'need_pause',
    label: 'Нужна пауза',
    description: 'Хочу выдохнуть и перезагрузиться',
    practiceId: 'point-of-calm',
    healthState: 'Tension'
  },
  {
    id: 'sleepy',
    label: 'Ко сну',
    description: 'Тело просит отдыха, мозг не отключается',
    practiceId: 'night-diary',
    healthState: 'Balance'
  }
];