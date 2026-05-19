import { useEffect, useState } from 'react'
import {
  createHabit,
  deleteHabitById,
  fetchHabits,
  habitsFallback,
  logHabit,
  type CreateHabitPayload,
} from '../api/habits'
import type { HabitsData } from '../types/habits'
import { trackUiAction } from '../api/client'

export default function useHabits() {
  const [data, setData] = useState<HabitsData>(habitsFallback)

  const refresh = () => fetchHabits().then(setData)

  useEffect(() => {
    refresh()
  }, [])

  const toggleHabit = async (habitId: string, completed: boolean) => {
    await logHabit(habitId, completed)
    await refresh()
  }

  const addHabit = async (payload: CreateHabitPayload) => {
    await createHabit(payload)
    await refresh()
  }

  const deleteHabitsByIds = async (habitIds: string[]) => {
    if (habitIds.length === 0) {
      return
    }
    await Promise.all(habitIds.map((id) => deleteHabitById(id)))
    await refresh()
  }

  const trackAction = async (action: string, payload?: string) => {
    await trackUiAction(action, payload)
  }

  return { data, toggleHabit, addHabit, deleteHabitsByIds, trackAction }
}
