import type { AnalyticsData } from '../types/analytics'

export const analyticsMock: AnalyticsData = {
  tabs: ['7 дней', '30 дней', '90 дней', 'Год'],
  outputScore: {
    value: 84,
    delta: '+12',
    status: 'Отличный результат',
    description:
      'Комплексная оценка вашей продуктивности на основе кода, задач и активности.',
  },
  outputMeta: [
    { label: 'Commits', value: 142, delta: '+18%' },
    { label: 'PR Merged', value: 28, delta: '+27%' },
    { label: 'Code Review', value: 36, delta: '+9%' },
  ],
  bugRate: {
    value: 0.45,
    delta: '-18%',
    points: [1.1, 0.95, 1.0, 0.7, 0.6, 0.7, 0.45],
    labels: ['20 апр', '27 апр', '4 мая', '11 мая', '18 мая'],
    footer: 'Отличная динамика! Держите темп.',
    gridMax: 1.2,
    gridStep: 0.4,
  },
  interviews: [
    {
      label: 'Скрининг',
      value: 24,
      percent: 100,
      gradient: 'linear-gradient(180deg, #9333ea, #7c3aed)',
    },
    {
      label: 'Тех. интервью',
      value: 12,
      percent: 50,
      gradient: 'linear-gradient(180deg, #4f46e5, #4338ca)',
    },
    {
      label: 'Финальное',
      value: 6,
      percent: 25,
      gradient: 'linear-gradient(180deg, #06b6d4, #0891b2)',
    },
    {
      label: 'Оффер',
      value: 3,
      percent: 12.5,
      gradient: 'linear-gradient(180deg, #10b981, #059669)',
    },
  ],
  interviewsMeta: {
    conversionLabel: 'Конверсия в оффер',
    conversionValue: '12.5%',
    bestLabel: 'Лучший результат 🏆',
    bestValue: '+4.3% к прошлому периоду',
  },
  income: {
    current: '210 000 ₽',
    delta: '+15%',
    forecast: '250K ₽',
    subtitle: 'текущий уровень',
    points: [120, 130, 145, 150, 160, 175, 190, 210, 230, 240, 250],
    labels: [
      'Июл \u201924',
      'Авг \u201924',
      'Сен \u201924',
      'Окт \u201924',
      'Ноя \u201924',
      'Дек \u201924',
      'Янв \u201925',
      'Фев \u201925',
      'Мар \u201925',
      'Апр \u201925',
      'Май \u201925',
    ],
    meta: [
      { label: 'Рост за 12 мес.', value: '+47%' },
      { label: 'Средний диапазон', value: '180К — 260К ₽' },
      { label: 'Следующая цель', value: '300К ₽', arrow: true },
    ],
  },
  metrics: [
    {
      label: 'Решённые задачи',
      value: 87,
      delta: '+16%',
      trend: 'up',
      iconKind: 'tasks',
      color: '#34d399',
      points: [40, 52, 48, 60, 55, 70, 65, 80, 75, 82, 87],
    },
    {
      label: 'Скорость (Story Points)',
      value: 192,
      delta: '+11%',
      trend: 'up',
      iconKind: 'velocity',
      color: '#60a5fa',
      points: [120, 140, 130, 150, 145, 160, 170, 165, 180, 185, 192],
    },
    {
      label: 'Покрытие тестами',
      value: '71%',
      delta: '+7%',
      trend: 'up',
      iconKind: 'coverage',
      color: '#34d399',
      points: [55, 58, 56, 60, 62, 60, 64, 66, 68, 70, 71],
    },
    {
      label: 'Code Review (полезность)',
      value: '92%',
      delta: '+5%',
      trend: 'up',
      iconKind: 'review',
      color: '#60a5fa',
      points: [80, 82, 81, 84, 85, 86, 88, 87, 90, 91, 92],
    },
    {
      label: 'Долг (тех. долг)',
      value: '2.1',
      delta: '-14%',
      trend: 'down',
      iconKind: 'debt',
      color: '#f87171',
      points: [3.0, 2.9, 2.95, 2.8, 2.7, 2.6, 2.5, 2.4, 2.35, 2.2, 2.1],
    },
  ],
  insights: [
    {
      title: 'Инсайт',
      text:
        'Вы в топ 18% разработчиков в своём грейде по темпу роста и качеству кода.',
      kind: 'insight',
    },
    {
      title: 'Рекомендация',
      text:
        'Сфокусируйтесь на System Design для роста конверсии на финальных этапах.',
      kind: 'recommendation',
    },
  ],
} as const
