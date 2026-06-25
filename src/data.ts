import { Practice, Achievement, Article, PathwayLevel, PracticeImpact } from './types';

export const UNIQUE_PRACTICES: Practice[] = [
  {
    id: 'uniq-focus',
    name: 'Фокус внимания',
    group: 'Ясность',
    duration: '25:00',
    category: 'Фокус и продуктивность',
    scientificBase: 'Метод Pomodoro, укрепляющий префронтальную кору через циклы концентрации.',
    howItWorks: 'Работа циклами 25/5 с отслеживанием отвлечений.',
    result: 'Укрепление внимания и осознанности.',
    isUnlocked: true
  },
  {
    id: 'uniq-movement',
    name: 'Осознанное движение',
    group: 'Энергия',
    duration: '20:00',
    category: 'Утро и энергия',
    scientificBase: 'Синхронизация ритмов мозга и тела через циклические повторяющиеся движения.',
    howItWorks: 'Ходьба или бег с отслеживанием темпа и внимания.',
    result: 'Повышение нейропластичности и снижение стресса.',
    isUnlocked: true
  },
  {
    id: 'uniq-glow',
    name: 'Медитация свечения',
    group: 'Тишина',
    duration: '10:00',
    category: 'Отдых и пауза',
    scientificBase: 'Активация парасимпатической системы через звуковые вибрации и визуальное свечение.',
    howItWorks: 'Выбор звуковой дорожки и созерцание визуального маяка.',
    result: 'Снижение тревоги, гармонизация состояния.',
    isUnlocked: true
  },
  {
    id: 'uniq-breath',
    name: 'Свободное дыхание',
    group: 'Исток',
    duration: '05:00',
    category: 'Снятие стресса',
    scientificBase: 'Резонансное дыхание для баланса ВСР.',
    howItWorks: 'Расслабленное наблюдение за естественным ритмом дыхания.',
    result: 'Мгновенное успокоение нервной системы.',
    isUnlocked: true
  }
];

export const ALL_PRACTICES: Practice[] = [
  // --- ИСТОК ---
  {
    id: '5-4-3-2-1',
    name: '5-4-3-2-1: Нейро-сброс',
    group: 'Исток',
    duration: '05:30',
    category: 'Снятие стресса',
    isFree: true
  } as any,
  {
    id: 'physio-sigh',
    name: 'Физиологический вздох',
    group: 'Исток',
    duration: '04:30',
    category: 'Снятие стресса'
  },
  {
    id: 'box-breathing',
    name: 'Квадратное дыхание',
    group: 'Исток',
    duration: '05:15',
    category: 'Фокус и продуктивность'
  },
  {
    id: 'body-scan',
    name: 'Сканирование тела',
    group: 'Исток',
    duration: '07:00',
    category: 'Отдых и пауза'
  },
  {
    id: 'grounding-feet',
    name: 'Заземление через стопы',
    group: 'Исток',
    duration: '05:00',
    category: 'Отдых и пауза'
  },
  {
    id: 'point-of-calm',
    name: 'Точка спокойствия',
    group: 'Исток',
    duration: '03:00',
    category: 'Снятие стресса'
  },
  {
    id: 'orientation-eyes',
    name: 'Ориентировка (Движение глаз)',
    group: 'Исток',
    duration: '03:00',
    category: 'Снятие стресса'
  },
  {
    id: 'neuro-facial',
    name: 'Нейро-массаж лица',
    group: 'Исток',
    duration: '04:00',
    category: 'Отдых и пауза'
  },
  {
    id: 'micro-moments',
    name: 'Микро-моменты тепла',
    group: 'Исток',
    duration: '05:25',
    category: 'Эмоции и отношения'
  },

  // --- ТИШИНА ---
  {
    id: 'night-diary',
    name: 'Ночной дневник',
    group: 'Тишина',
    duration: '07:30',
    category: 'Эмоции и отношения'
  },
  {
    id: 'scan-letgo',
    name: 'Сканирование отпускания',
    group: 'Тишина',
    duration: '06:35',
    category: 'Сон и восстановление'
  },
  {
    id: 'self-compassion',
    name: 'Самосострадание',
    group: 'Тишина',
    duration: '06:40',
    category: 'Эмоции и отношения'
  },
  {
    id: 'mental-cleanup',
    name: 'Уборка ментального пространства',
    group: 'Тишина',
    duration: '06:45',
    category: 'Эмоции и отношения'
  },
  {
    id: 'control-drop',
    name: 'Отпускание контроля',
    group: 'Тишина',
    duration: '06:30',
    category: 'Эмоции и отношения'
  },
  {
    id: 'tension-dissolution',
    name: 'Растворение напряжения',
    group: 'Тишина',
    duration: '06:00',
    category: 'Снятие стресса'
  },
  {
    id: 'day-resource',
    name: 'Ресурс дня',
    group: 'Тишина',
    duration: '06:25',
    category: 'Эмоции и отношения'
  },
  {
    id: 'tomorrow-sky',
    name: 'Завтрашний день',
    group: 'Тишина',
    duration: '06:30',
    category: 'Эмоции и отношения'
  },
  {
    id: 'zero-point',
    name: 'Нулевая точка',
    group: 'Тишина',
    duration: '15:00',
    category: 'Сон и восстановление'
  },

  // --- ЭНЕРГИЯ ---
  {
    id: 'day-code',
    name: 'Код дня',
    group: 'Энергия',
    duration: '05:20',
    category: 'Утро и энергия'
  },
  {
    id: 'fire-breath',
    name: 'Огненное дыхание',
    group: 'Энергия',
    duration: '05:05',
    category: 'Утро и энергия'
  },
  {
    id: 'inner-heat',
    name: 'Внутренний жар',
    group: 'Энергия',
    duration: '09:20',
    category: 'Сила воли'
  },
  {
    id: 'energy-release',
    name: 'Освобождение энергии',
    group: 'Энергия',
    duration: '04:10',
    category: 'Сила воли'
  },
  {
    id: 'morning-wake',
    name: 'Утреннее пробуждение',
    group: 'Энергия',
    duration: '09:30',
    category: 'Утро и энергия'
  },
  {
    id: 'force-flow',
    name: 'Поток силы',
    group: 'Энергия',
    duration: '07:00',
    category: 'Сила воли'
  },
  {
    id: 'five-moves',
    name: 'Пять движений силы',
    group: 'Энергия',
    duration: '07:00',
    category: 'Утро и энергия'
  },
  {
    id: 'resisted-breath',
    name: 'Дыхание с сопротивлением',
    group: 'Энергия',
    duration: '05:05',
    category: 'Сила воли'
  },
  {
    id: 'downward-stream',
    name: 'Нисходящий поток',
    group: 'Энергия',
    duration: '07:00',
    category: 'Сила воли'
  },

  // --- ЯСНОСТЬ ---
  {
    id: 'external-intention',
    name: 'Внешнее намерение',
    group: 'Ясность',
    duration: '07:00',
    category: 'Фокус и продуктивность'
  },
  {
    id: 'goal-map',
    name: 'Карта целей',
    group: 'Ясность',
    duration: '10:00',
    category: 'Фокус и продуктивность'
  },
  {
    id: 'significance-drop',
    name: 'Снижение важности',
    group: 'Ясность',
    duration: '07:00',
    category: 'Фокус и продуктивность'
  },
  {
    id: 'success-reliving',
    name: 'Проживание успеха',
    group: 'Ясность',
    duration: '07:30',
    category: 'Фокус и продуктивность'
  },
  {
    id: 'forgiveness-med',
    name: 'Медитация-прощение',
    group: 'Ясность',
    duration: '07:00',
    category: 'Эмоции и отношения'
  },
  {
    id: 'lessons-of-day',
    name: 'Уроки дня',
    group: 'Ясность',
    duration: '07:00',
    category: 'Эмоции и отношения'
  },
  {
    id: 'weekly-review',
    name: 'Недельный обзор',
    group: 'Ясность',
    duration: '10:00',
    category: 'Фокус и продуктивность'
  },
  {
    id: 'thought-deconstruction',
    name: 'Деконструкция мысли',
    group: 'Ясность',
    duration: '05:20',
    category: 'Эмоции и отношения'
  },
  {
    id: 'world-seeing',
    name: 'Смотрение на мир',
    group: 'Ясность',
    duration: '07:00',
    category: 'Фокус и продуктивность'
  }
];

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_spark', title: 'Первая искра', description: 'Выполнить первый уровень в главе «Исток»', iconType: 'spark', unlocked: false },
  { id: 'first_week', title: 'Первая неделя', description: 'Выполнить семь любых ритуалов', iconType: 'ring', unlocked: false },
  { id: 'thirty_pract', title: '30 практик', description: 'Выполнить тридцать любых ритуалов', iconType: 'points', unlocked: false },
  { id: 'seven_streak', title: '7 дней подряд', description: 'Практиковать семь дней без единого пропуска', iconType: 'sevenDots', unlocked: false },
  { id: 'thirty_streak', title: '30 дней подряд', description: 'Практиковать тридцать дней без пропусков', iconType: 'thirtyDots', unlocked: false },
  { id: 'first_marathon', title: 'Первый марафон', description: 'Пройти 42 км в ритуале «Осознанное движение»', iconType: 'runner', unlocked: false },
  { id: 'light', title: 'Свет', description: 'Выполнить сто любых ритуалов', iconType: 'crystalOne', unlocked: false },
  { id: 'constellation', title: 'Созвездие', description: 'Выполнить пятьсот ритуалов', iconType: 'crystalThree', unlocked: false },
  { id: 'focus_master', title: 'Мастер фокуса', description: 'Накопить 50 часов в ритуале «Фокус внимания»', iconType: 'focus', unlocked: false },
  { id: 'heart_rhythm', title: 'В ритме сердца', description: 'Провести неделю в зеленой зоне «Сияния» (80–100)', iconType: 'heart', unlocked: false },
  { id: 'thousand_km', title: '1000 км', description: 'Пройти 1000 км в «Осознанном движении»', iconType: 'road', unlocked: false },
  { id: 'torch', title: 'Светоч', description: 'Выполнить тысячу ритуалов', iconType: 'crystalRow', unlocked: false }
];

export const EDUCATIONAL_ARTICLES: Article[] = [
  {
    id: 'mov_magic',
    title: 'Магия движения',
    description: 'Простой способ возвращаться к себечерез шаги',
    content: `Прогулка — это, пожалуй, самый доступный способ начать возвращаться к себе. Замечали, как на ходу дыхание становится ровнее, а мысли перестают скакать? Ритмичное движение помогает снизить уровень стресса, поддерживает сердце и улучшает кровообращения.

В отличие от интенсивных тренировок, ходьба не перегружает организм. Она доступна почти в любом состоянии — даже когда совсем нет сил. Прогулки повышают выносливость, стабилизируют давление, снижают фоновое напряжение и улучшают сон.

Но главное — они создают пространство. В одиночестве — это медитация в движении. Слышать свои шаги, чувствовать воздух, замечать, как внутри становится тише.

Стресс? Пройдись. Нет сил? Пройдись. Нужно прояснить мысли? Тоже пройдись.`
  },
  {
    id: 'attention',
    title: 'Внимание',
    description: 'Твой главный личный ресурс в экономике внимания',
    content: `Внимание — это единственное, что у тебя по-настоящему есть. Куда оно направлено — туда течёт твоя энергия. Там формируется твоё состояние. А из состояния рождаются решения, действия и, в итоге, вся жизнь.

Нейробиологи доказали: мозг не умеет удерживать фокус на нескольких вещах одновременно. То, что мы называем многозадачностью — это быстрое переключение. И каждое переключение стоит энергии.

Управление вниманием даёт конкретные результаты: ты перестаёшь быть жертвой уведомлений, быстрее замечаешь усталость, лучше слышишь себя и становишься спокойнее.`
  },
  {
    id: 'sleep_importance',
    title: 'Важность сна',
    description: 'Восстановление кристалла начинается ночью',
    content: `Сон — не пауза. Это активный процесс, в котором тело и мозг возвращают себе ресурсы. Длительность и качество сна влияют на всё: от энергии утром до спокойствия вечером. 

Большинству взрослых требуется 7–9 часов регулярного сна.
Базовые правила:
• Ложись и вставай в одно время.
• Избегай экранов за час до сна.
• Держи спальню прохладной и тёмной.
• Сократи кофеин во второй половине дня.`
  },
  {
    id: 'breath_benefit',
    title: 'Польза дыхания',
    description: 'Доступный пульт управления нервной системой',
    content: `Мы дышим всё время и не замечаем этого. Но дыхание тесно связано с состоянием. Замедляя его, мы подаём сигнал парасимпатической системе: «Всё в порядке, ты в безопасности». 

Тогда постепенно замедляется сердцебиение, уходит лишнее напряжение, восстанавливается ясность мыслей и «отпускает». Достаточно пары минут вдохов и удлинённых выдохов.`
  },
  {
    // 5.
    id: 'focus_attention',
    title: 'Фокус внимания',
    description: 'Как работает Pomodoro и почему это про управление собой',
    content: `Техника Pomodoro простая: выбираешь одну задачу, ставишь таймер на 25 (или 10) минут и фокусируешься.
Но секрет в том, что когда ты фиксируешь отвлечения (например, кнопкойв нашем приложении), ты обучаешь мозг осознавать момент ухода внимания. Со временем префронтальная кора укрепляется, повышая уровень твоего внимания.`
  },
  {
    // 6.
    id: 'heart_state',
    title: 'Сердце и состояние тела',
    description: 'О чём говорит вариабельность сердечного ритма (ВСР)',
    content: `ВСР (HRV) — это микроскопические изменения интервалов между ударами сердца. Высокая ВСР говорит о расслабленности, гибкости и высоком ресурсе тела. Низкая ВСР кричит о перегрузке или стрессе.
В Ritual показатель ВСР — это датчик сияния твоего Кристалла. Если накоплена усталость, ВСР падает, и Кристалл покрывается дымкой, советуя замереть в тишине.`
  },
  {
    // 7.
    id: 'stress_pause',
    title: 'Стресс и искусство паузы',
    description: 'Как вовремя сделать остановку в суете',
    content: `Хронический стресс — это нагрузка без конца и без восстановления.
Первым делом при стрессе мозг убирает паузы, заставляя бежать всё быстрее. Но именно короткие трехминутные остановки внутри дня перезапускают систему, не давая развиться истощению.`
  },
  {
    // 8.
    id: 'sound_frequencies',
    title: 'Как работают звуковые частоты',
    description: 'Бинауральные биения и изохронные тоны в звуке',
    content: `Бинауральные биения работают через стереонаушники, создавая разницу частот в левом и правом наушнике (например, 200 Гц и 206 Гц). Мозг улавливает разницу в 6 Гц (тета) и успокаивается.
Изохронные тоны — это ритмичные импульсы, помогающие войти в баланс альфа-частот без наушников. Низкочастотный гул (ниже 100 Гц) физически стимулирует блуждающий нерв, снижая кортизол.`
  }
];

export const MOCK_PRACTICE_IMPACTS: PracticeImpact[] = [
  {
    ritualId: 'physio-sigh',
    ritualTitle: 'Физиологический вздох',
    group: 'Исток',
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    effects: [
      { metric: 'hrv', label: 'ВСР +12%', change: 12 },
      { metric: 'stressLevel', label: 'Стресс -18%', change: -18 },
      { metric: 'heartRate', label: 'Пульс -5 уд/мин', change: -5 }
    ]
  },
  {
    ritualId: 'night-diary',
    ritualTitle: 'Ночной дневник',
    group: 'Тишина',
    date: new Date(Date.now() - 14 * 3600000).toISOString(),
    effects: [
      { metric: 'sleepHours', label: 'Сон +0.8ч', change: 8 },
      { metric: 'sleepQuality', label: 'Качество сна +15%', change: 15 },
      { metric: 'hrv', label: 'ВСР +8%', change: 8 }
    ]
  },
  {
    ritualId: 'day-code',
    ritualTitle: 'Код дня',
    group: 'Энергия',
    date: new Date(Date.now() - 26 * 3600000).toISOString(),
    effects: [
      { metric: 'energyLevel', label: 'Энергия +22%', change: 22 },
      { metric: 'activityCalories', label: 'Активность +180 ккал', change: 18 },
    ]
  },
  {
    ritualId: 'goal-map',
    ritualTitle: 'Карта целей',
    group: 'Ясность',
    date: new Date(Date.now() - 50 * 3600000).toISOString(),
    effects: [
      { metric: 'stressLevel', label: 'Стресс -12%', change: -12 },
      { metric: 'heartRate', label: 'Пульс -3 уд/мин', change: -3 },
      { metric: 'hrv', label: 'ВСР +5%', change: 5 }
    ]
  }
];

export const PATHWAY_LEVELS: PathwayLevel[] = [
  // --- ГЛАВА 1: ИСТОК ---
  {
    id: 'path_istok_1',
    chapterIndex: 1,
    levelIndex: 1,
    name: 'Уровень 1. Искра в тумане',
    description: 'Среди хаоса — крошечная светящаяся точка. Рассеянные мысли собираются в фокус. Тело вспоминает тепло своего центра.',
    duration: '05:00',
    group: 'Исток',
    overallIndex: 0
  },
  {
    id: 'path_istok_2',
    chapterIndex: 1,
    levelIndex: 2,
    name: 'Уровень 2. Свет сквозь слои',
    description: 'Свет проходит сквозь тело, эмоции и мысли. Осознай себя Наблюдателем — тем, кто видит всё, но не равен ничему.',
    duration: '07:00',
    group: 'Исток',
    overallIndex: 1
  },
  {
    id: 'path_istok_3',
    chapterIndex: 1,
    levelIndex: 3,
    name: 'Уровень 3. Выбор сияния',
    description: 'Нейтральный свет обретает твой оттенок. Ты сам выбираешь состояние: спокойствие, уверенность или радость.',
    duration: '07:00',
    group: 'Исток',
    overallIndex: 2
  },
  {
    id: 'path_istok_4',
    chapterIndex: 1,
    levelIndex: 4,
    name: 'Уровень 4. Преображение теней',
    description: 'Тени на гранях Кристалла становятся светлыми. Старые обиды и усталость растворяются под лучом внимания.',
    duration: '08:30',
    group: 'Исток',
    overallIndex: 3
  },
  {
    id: 'path_istok_5',
    chapterIndex: 1,
    levelIndex: 5,
    name: 'Уровень 5. Луч намерения',
    description: 'Свет собирается в луч, идущий к цели. Твой кристалл обретает точный вектор волевого намерения.',
    duration: '07:00',
    group: 'Исток',
    overallIndex: 4
  },
  {
    id: 'path_istok_6',
    chapterIndex: 1,
    levelIndex: 6,
    name: 'Уровень 6. Первое сияние',
    description: 'Кристалл излучает ровный, целостный свет. Твой утренний ритуал собран. Внимание, состояние и вектор едины.',
    duration: '07:00',
    group: 'Исток',
    overallIndex: 5
  },

  // --- ГЛАВА 2: ТИШИНА ---
  {
    id: 'path_tishina_1',
    chapterIndex: 2,
    levelIndex: 1,
    name: 'Уровень 1. Глубина озера',
    description: 'Кристалл покоится в безмолвной глубине озера. Внутренний шум затихает, оставляя пространство покоя.',
    duration: '09:00',
    group: 'Тишина',
    overallIndex: 6
  },
  {
    id: 'path_tishina_2',
    chapterIndex: 2,
    levelIndex: 2,
    name: 'Уровень 2. Ритм воды',
    description: 'Синхронизация дыхания с ритмами тела и воды. Снятие остаточного стресса за счёт убаюкивающего дыхания 4-7-8.',
    duration: '10:00',
    group: 'Тишина',
    overallIndex: 7
  },
  {
    id: 'path_tishina_3',
    chapterIndex: 2,
    levelIndex: 3,
    name: 'Уровень 3. Отражения на поверхности',
    description: 'Мысли и эмоции — лишь рябь на воде. Ты наблюдаешь за ними со стороны, не вовлекаясь в их течение.',
    duration: '12:00',
    group: 'Тишина',
    overallIndex: 8
  },
  {
    id: 'path_tishina_4',
    chapterIndex: 2,
    levelIndex: 4,
    name: 'Уровень 4. Закат на воде',
    description: 'Кристалл наполняется золотистым теплом прожитого дня. Завершение дня благодарностью и освобождение от долгов.',
    duration: '10:00',
    group: 'Тишина',
    overallIndex: 9
  },
  {
    id: 'path_tishina_5',
    chapterIndex: 2,
    levelIndex: 5,
    name: 'Уровень 5. Целостность',
    description: 'Дыхание, глубина, отражения и благодарность сливаются в целостный вечерний ритуал восстановления.',
    duration: '12:00',
    group: 'Тишина',
    overallIndex: 10
  },

  // --- ГЛАВА 3: ЭНЕРГИЯ ---
  {
    id: 'path_energy_1',
    chapterIndex: 3,
    levelIndex: 1,
    name: 'Уровень 1. Пробуждение огня',
    description: 'Тело рук пробуждает кристалл. Искра разгорается, превращаясь в ощутимый источник жизненных сил.',
    duration: '07:30',
    group: 'Энергия',
    overallIndex: 11
  },
  {
    id: 'path_energy_2',
    chapterIndex: 3,
    levelIndex: 2,
    name: 'Уровень 2. Поток тепла',
    description: 'Провождение тепла по позвоночнику от основания к макушке. Освобождение спины от зажимов, рождение потока.',
    duration: '07:30',
    group: 'Энергия',
    overallIndex: 12
  },
  {
    id: 'path_energy_3',
    chapterIndex: 3,
    levelIndex: 3,
    name: 'Уровень 3. Внутреннее солнце',
    description: 'Разогрев тела дыханием Туммо и гимнастикой. Разгорание огня в устойчивое согревающее пламя.',
    duration: '15:00',
    group: 'Энергия',
    overallIndex: 13
  },
  {
    id: 'path_energy_4',
    chapterIndex: 3,
    levelIndex: 4,
    name: 'Уровень 4. Луч воли',
    description: 'Жар фокусируется в тонкий луч воли. Ты соединяешь внутренний жар своего кристалла с внешней целью.',
    duration: '08:00',
    group: 'Энергия',
    overallIndex: 14
  },
  {
    id: 'path_energy_5',
    chapterIndex: 3,
    levelIndex: 5,
    name: 'Уровень 5. Рассвет в тебе',
    description: 'Тело, поток, жар и луч сливаются в утренний запуск. Твой вдох запускает день с полной готовностью.',
    duration: '12:00',
    group: 'Энергия',
    overallIndex: 15
  },

  // --- ГЛАВА 4: ЯСНОСТЬ ---
  {
    id: 'path_yasnost_1',
    chapterIndex: 4,
    levelIndex: 1,
    name: 'Уровень 1. Рассеивая туман',
    description: 'Наведение порядка в мыслях утренним выгружением целей. Грань Кристалла очищается от неопределённости.',
    duration: '08:00',
    group: 'Ясность',
    overallIndex: 16
  },
  {
    id: 'path_yasnost_2',
    chapterIndex: 4,
    levelIndex: 2,
    name: 'Уровень 2. Устранение шума',
    description: 'Снятие внутреннего шума: тревог, раздражений и чужих ожиданий через метод вычёркивания.',
    duration: '10:00',
    group: 'Ясность',
    overallIndex: 17
  },
  {
    id: 'path_yasnost_3',
    chapterIndex: 4,
    levelIndex: 3,
    name: 'Уровень 3. Точки силы',
    description: 'Определение приоритетов через соматический отклик. Кристалл указывает на действие с максимальным результатом.',
    duration: '10:00',
    group: 'Ясность',
    overallIndex: 18
  },
  {
    id: 'path_yasnost_4',
    chapterIndex: 4,
    levelIndex: 4,
    name: 'Уровень 4. Парадоксальная ясность',
    description: 'Переключение мозга в фоновый режим через паузу. Отпуск контроля выявляет самое верное решение.',
    duration: '10:00',
    group: 'Ясность',
    overallIndex: 19
  },
  {
    id: 'path_yasnost_5',
    chapterIndex: 4,
    levelIndex: 5,
    name: 'Уровень 5. Кристальная проекция',
    description: 'Интеграция всех граней Кристалла. Проверка решения отказом на глубинном уровне тела. Путь проложен.',
    duration: '10:00',
    group: 'Ясность',
    overallIndex: 20
  }
];
