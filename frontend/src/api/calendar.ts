import { calendarMock } from '../mocks/calendar'
import type { CalendarData } from '../types/calendar'
import { getJson } from './client'

export const calendarFallback = calendarMock

export const fetchCalendar = async (): Promise<CalendarData> => {
  return getJson('/calendar', calendarMock)
}
