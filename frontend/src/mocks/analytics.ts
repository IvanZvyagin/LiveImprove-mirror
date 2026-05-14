import type { AnalyticsData } from '../types/analytics'

export const analyticsMock: AnalyticsData = {
  tabs: ['7 дней', '30 дней', '90 дней', 'Год'],
  outputScore: {
    value: 84,
    delta: '+12',
    status: 'Отличный результат',
  },
  outputMeta: [
    { label: 'Commits', value: 142, delta: '+18%' },
    { label: 'PR Merged', value: 28, delta: '+27%' },
    { label: 'Code Review', value: 36, delta: '+9%' },
  ],
  bugRate: {
    value: 0.45,
    delta: '+18%',
    points: [1.1, 0.9, 1.05, 0.7, 0.6, 0.75, 0.45],
    labels: ['20 апр', '27 апр', '4 мая', '11 мая', '18 мая'],
  },
  interviews: [
    { label: 'Скрининг', value: 24, percent: 100, gradient: 'linear-gradient(90deg, #8b5cf6, #a855f7)' },
    {
      label: 'Тех. интервью',
      value: 12,
      percent: 50,
      gradient: 'linear-gradient(90deg, #6366f1, #3b82f6)',
    },
    { label: 'Финальное', value: 6, percent: 25, gradient: 'linear-gradient(90deg, #0ea5e9, #22d3ee)' },
    { label: 'Оффер', value: 3, percent: 12.5, gradient: 'linear-gradient(90deg, #22c55e, #34d399)' },
  ],
  income: {
    current: '210 000 ₽',
    delta: '+15%',
    forecast: '250K ₽',
    points: [120, 130, 145, 150, 160, 175, 190, 210, 230, 240, 250],
    labels: ['Июн', 'Авг', 'Окт', 'Дек', 'Фев', 'Апр'],
  },
  metrics: [
    { label: 'Решённые задачи', value: 87, delta: '+16%' },
    { label: 'Скорость (Story Points)', value: 192, delta: '+11%' },
    { label: 'Покрытие тестами', value: '71%', delta: '+7%' },
    { label: 'Code Review (полезность)', value: '92%', delta: '+5%' },
    { label: 'Долг (тех. долг)', value: '2.1', delta: '-14%' },
  ],
  insights: [
    {
      title: 'Инсайт',
      text: 'Вы в топ 18% разработчиков в своём грейде по темпу роста и качеству кода.',
    },
    {
      title: 'Рекомендация',
      text: 'Сфокусируйтесь на System Design для роста конверсии на финальных этапах.',
    },
  ],
} as const
