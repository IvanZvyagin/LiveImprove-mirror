import { goalsMock } from '../mocks/goals'
import type { GoalsData } from '../types/goals'
import { getJson, postJson } from './client'

export const goalsFallback = goalsMock

export const fetchGoals = async (): Promise<GoalsData> => {
  return getJson('/goals', goalsMock)
}

export const createGoal = async () => {
  await postJson('/goals', {
    title: 'Новая цель',
    category: 'Личное',
    targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString().slice(0, 10),
  })
}

export const toggleGoalItem = async (itemId: string, done: boolean) => {
  await postJson(`/goals/items/${itemId}/toggle`, { done })
}
