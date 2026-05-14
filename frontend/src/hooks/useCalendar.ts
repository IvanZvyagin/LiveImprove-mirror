import { useEffect, useState } from 'react'
import { calendarFallback, fetchCalendar } from '../api/calendar'
import type { CalendarData } from '../types/calendar'
import { trackUiAction } from '../api/client'

export default function useCalendar() {
  const [data, setData] = useState<CalendarData>(calendarFallback)

  const refresh = () => fetchCalendar().then(setData)

  useEffect(() => {
    refresh()
  }, [])

  const trackAction = async (action: string, payload?: string) => {
    await trackUiAction(action, payload)
  }

  return { data, trackAction }
}
