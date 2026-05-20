import { useEffect, useState } from 'react'

/** ID цели с бэка — UUID; в моках без API — строки вида goal-1. */
const GOAL_ID_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
import {
  completeGoal as completeGoalApi,
  createGoal,
  deleteGoal as deleteGoalApi,
  fetchGoals,
  goalsFallback,
  pauseGoal as pauseGoalApi,
  resumeGoal as resumeGoalApi,
  toggleGoalItem,
  type CreateGoalPayload,
} from '../api/goals'
import type { GoalsData } from '../types/goals'
import { trackUiAction } from '../api/client'

export default function useGoals() {
  const [data, setData] = useState<GoalsData>(goalsFallback)

  const refresh = () => fetchGoals().then(setData)

  useEffect(() => {
    refresh()
  }, [])

  const addGoal = async (payload: CreateGoalPayload) => {
    await createGoal(payload)
    await refresh()
  }

  const toggleItem = async (itemId: string, done: boolean) => {
    await toggleGoalItem(itemId, done)
    await refresh()
  }

  const removeGoal = async (goalId: string): Promise<boolean> => {
    if (!GOAL_ID_UUID.test(goalId)) {
      setData((prev) => ({
        ...prev,
        goals: prev.goals.filter((g) => g.id !== goalId),
        stats: {
          ...prev.stats,
          active: Math.max(0, prev.stats.active - 1),
        },
      }))
      return true
    }
    try {
      await deleteGoalApi(goalId)
      await refresh()
      return true
    } catch (e) {
      console.warn('Не удалось удалить цель', e)
      return false
    }
  }

  const finishGoal = async (goalId: string): Promise<boolean> => {
    if (!GOAL_ID_UUID.test(goalId)) return false
    try {
      await completeGoalApi(goalId)
      await refresh()
      return true
    } catch (e) {
      console.warn('Не удалось завершить цель', e)
      return false
    }
  }

  const pauseGoalById = async (goalId: string): Promise<boolean> => {
    if (!GOAL_ID_UUID.test(goalId)) return false
    try {
      await pauseGoalApi(goalId)
      await refresh()
      return true
    } catch (e) {
      console.warn('Не удалось поставить цель на паузу', e)
      return false
    }
  }

  const resumeGoalById = async (goalId: string): Promise<boolean> => {
    if (!GOAL_ID_UUID.test(goalId)) return false
    try {
      await resumeGoalApi(goalId)
      await refresh()
      return true
    } catch (e) {
      console.warn('Не удалось возобновить цель', e)
      return false
    }
  }

  const trackAction = async (action: string, payload?: string) => {
    await trackUiAction(action, payload)
  }

  return { data, addGoal, toggleItem, removeGoal, finishGoal, pauseGoalById, resumeGoalById, trackAction }
}
