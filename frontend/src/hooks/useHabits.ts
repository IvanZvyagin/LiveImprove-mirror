import { useEffect, useState } from 'react'
import { createHabit, fetchHabits, habitsFallback, logHabit } from '../api/habits'
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

  const addHabit = async () => {
    await createHabit()
    await refresh()
  }

  const trackAction = async (action: string, payload?: string) => {
    await trackUiAction(action, payload)
  }

  return { data, toggleHabit, addHabit, trackAction }
}
