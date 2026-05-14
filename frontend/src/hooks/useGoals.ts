import { useEffect, useState } from 'react'
import { createGoal, fetchGoals, goalsFallback, toggleGoalItem } from '../api/goals'
import type { GoalsData } from '../types/goals'
import { trackUiAction } from '../api/client'

export default function useGoals() {
  const [data, setData] = useState<GoalsData>(goalsFallback)

  const refresh = () => fetchGoals().then(setData)

  useEffect(() => {
    refresh()
  }, [])

  const addGoal = async () => {
    await createGoal()
    await refresh()
  }

  const toggleItem = async (itemId: string, done: boolean) => {
    await toggleGoalItem(itemId, done)
    await refresh()
  }

  const trackAction = async (action: string, payload?: string) => {
    await trackUiAction(action, payload)
  }

  return { data, addGoal, toggleItem, trackAction }
}
