import type { DashboardData } from '../types/dashboard'

export const dashboardMock: DashboardData = {
  progressToday: 78,
  progressMetrics: [
    { label: "Привычки", value: "4 / 5", color: "#34d399" },
    { label: "Кодинг задачи", value: "3 / 4", color: "#38bdf8" },
    { label: "Обучение", value: "1 / 2", color: "#a78bfa" }
  ],
  streak: {
    days: 14,
    week: [
      { label: "Пн", done: true },
      { label: "Вт", done: true },
      { label: "Ср", done: true },
      { label: "Чт", done: true },
      { label: "Пт", done: true },
      { label: "Сб", done: true },
      { label: "Вс", done: false }
    ]
  },
  nextInterview: {
    role: "Frontend Developer",
    company: "в Яндекс",
    time: "20 мая 2025, 16:00",
    location: "Онлайн"
  },
  todayTasks: [
    {
      id: "habit-1",
      title: "Утренняя медитация",
      subtitle: "10 минут осознанности",
      type: "habit",
      time: "07:00",
      done: true
    },
    {
      id: "habit-2",
      title: "Физическая активность",
      subtitle: "30 минут тренировки",
      type: "habit",
      time: "08:00",
      done: true
    },
    {
      id: "task-1",
      title: "Решить 2 задачи на LeetCode",
      subtitle: "Алгоритмы и структуры данных",
      type: "task",
      time: "—",
      done: true
    },
    {
      id: "task-2",
      title: "Реализовать аутентификацию в API",
      subtitle: "Добавить JWT и обновление токенов",
      type: "task",
      time: "12:00",
      done: false
    },
    {
      id: "habit-3",
      title: "Прочитать 20 страниц",
      subtitle: "Чистый код — Роберт Мартин",
      type: "habit",
      time: "20:00",
      done: false
    },
    {
      id: "task-3",
      title: "Изучить паттерн проектирования",
      subtitle: "Наблюдатель (Observer)",
      type: "study",
      time: "21:00",
      done: false
    }
  ]
} as const;
