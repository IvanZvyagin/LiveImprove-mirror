import { dashboardMock } from '../mocks/dashboard'
import type { DashboardData, DashboardTask } from '../types/dashboard'
import { getJson, postJson } from './client'

export const dashboardFallback = dashboardMock

export const fetchDashboard = async (): Promise<DashboardData> => {
  return getJson('/dashboard', dashboardMock)
}

export const toggleDashboardTask = async (task: DashboardTask) => {
  if (!task.id) return
  if (task.type === 'habit') {
    await postJson(`/habits/${task.id}/log`, {
      completed: !task.done,
      date: new Date().toISOString().slice(0, 10),
    })
    return
  }

  await postJson(`/tasks/${task.id}/toggle`, { completed: !task.done })
}

export const createDashboardTask = async () => {
  await postJson('/tasks', {
    title: 'Новая задача',
    subtitle: 'Описание',
    type: 'task',
  })
}
