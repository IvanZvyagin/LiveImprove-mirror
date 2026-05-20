import { goalsMock } from '../mocks/goals'
import type { GoalsData } from '../types/goals'
import { deleteRequest, getJson, patchRequest, postJson } from './client'

export const goalsFallback = goalsMock

export type CreateGoalPayload = {
  title: string
  category: string
  targetDate: string
  description?: string
  subGoalTitles?: string[]
}

export const fetchGoals = async (): Promise<GoalsData> => {
  return getJson('/goals', goalsMock)
}

export const createGoal = async (payload: CreateGoalPayload) => {
  await postJson('/goals', {
    title: payload.title,
    category: payload.category,
    targetDate: payload.targetDate,
    description: payload.description ?? '',
    subGoalTitles: payload.subGoalTitles ?? [],
  })
}

export const toggleGoalItem = async (itemId: string, done: boolean) => {
  await postJson(`/goals/items/${itemId}/toggle`, { done })
}

export const deleteGoal = async (goalId: string) => {
  await deleteRequest(`/goals/${goalId}`)
}

export const completeGoal = async (goalId: string) => {
  await patchRequest(`/goals/${goalId}/complete`)
}

export const pauseGoal = async (goalId: string) => {
  await patchRequest(`/goals/${goalId}/pause`)
}

export const resumeGoal = async (goalId: string) => {
  await patchRequest(`/goals/${goalId}/resume`)
}
