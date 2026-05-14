import { habitsMock } from '../mocks/habits'
import type { HabitsData } from '../types/habits'
import { getJson, postJson } from './client'

export const habitsFallback = habitsMock

export const fetchHabits = async (): Promise<HabitsData> => {
  return getJson('/habits', habitsMock)
}

export const createHabit = async () => {
  await postJson('/habits', {
    title: 'Новая привычка',
    category: 'health',
    time: '08:00',
  })
}

export const logHabit = async (habitId: string, completed: boolean) => {
  await postJson(`/habits/${habitId}/log`, {
    completed,
    date: new Date().toISOString().slice(0, 10),
  })
}
