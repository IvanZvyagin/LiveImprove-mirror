import type { CalendarData } from '../types/calendar'

export const calendarMock: CalendarData = {
  tabs: ['Повестка', 'Месяц'],
  days: [
    {
      id: 'day-20',
      label: 'Сегодня',
      date: 20,
      month: 'май, вт',
      events: [
        { type: 'task', title: 'Решить 2 задачи на LeetCode', time: '07:00' },
        { type: 'habit', title: 'Физическая активность', time: '08:00' },
        { type: 'interview', title: 'Frontend Developer в Яндекс', time: '16:00' },
      ],
    },
    {
      id: 'day-21',
      label: 'Завтра',
      date: 21,
      month: 'май, ср',
      events: [
        { type: 'task', title: 'Реализовать аутентификацию в API', time: '12:00' },
        { type: 'habit', title: 'Утренняя медитация', time: '07:00' },
      ],
    },
    {
      id: 'day-22',
      label: 'Четверг',
      date: 22,
      month: 'май, чт',
      events: [
        { type: 'task', title: 'Прочитать 20 страниц', time: '20:00' },
        { type: 'habit', title: 'Физическая активность', time: '08:00' },
      ],
    },
    {
      id: 'day-23',
      label: 'Пятница',
      date: 23,
      month: 'май, пт',
      events: [
        { type: 'task', title: 'Изучить паттерн проектирования', time: '21:00' },
        { type: 'interview', title: 'Frontend Developer в Т-Банк', time: '15:00' },
      ],
    },
  ],
  month: 'Май 2025',
  monthDays: [
    28, 29, 30, 1, 2, 3, 4,
    5, 6, 7, 8, 9, 10, 11,
    12, 13, 14, 15, 16, 17, 18,
    19, 20, 21, 22, 23, 24, 25,
    26, 27, 28, 29, 30, 31, 1,
  ],
  weekStats: {
    range: 'Неделя: 20 – 26 мая',
    tasks: 6,
    habits: 5,
    interviews: 2,
    focusTitle: 'Фокус недели',
    focusText: 'Подготовка к собеседованиям и развитие в Backend',
    progress: 64,
    completed: '13 из 20 завершено',
  },
} as const
