import { habitsMock } from '../mocks/habits'
import type { HabitsData } from '../types/habits'
import { deleteRequest, getJson, postJson } from './client'

export const habitsFallback = habitsMock

/** Локальный календарный день YYYY-MM-DD (не UTC-дата из toISOString — иначе ночью будет «вчера»). */
export function localCalendarDateString(date = new Date()): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export type CreateHabitPayload = {
  title: string
  category: string
  frequency: 'daily' | 'weekly'
  reminderTime: string
  reminderEnabled: boolean
  description?: string
  iconValue?: string
}

export const fetchHabits = async (): Promise<HabitsData> => {
  return getJson('/habits', habitsMock)
}

export const createHabit = async (payload: CreateHabitPayload) => {
  await postJson('/habits', {
    title: payload.title,
    category: payload.category,
    description: payload.description ?? '',
    iconValue: payload.iconValue ?? 'fw:health',
    frequency: payload.frequency,
    reminderTime: payload.reminderTime,
    reminderEnabled: payload.reminderEnabled,
  })
}

export const logHabit = async (habitId: string, completed: boolean) => {
  await postJson(`/habits/${habitId}/log`, {
    completed,
    date: localCalendarDateString(),
  })
}

export const deleteHabitById = async (habitId: string): Promise<void> => {
  await deleteRequest(`/habits/${habitId}`)
}
