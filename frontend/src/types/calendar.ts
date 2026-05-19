export type CalendarEventType = 'task' | 'habit' | 'interview'

export type CalendarEvent = {
  type: CalendarEventType
  title: string
  time: string
}

export type CalendarDay = {
  id: string
  label: string
  date: number
  month: string
  events: CalendarEvent[]
}

export type CalendarWeekStats = {
  range: string
  tasks: number
  habits: number
  interviews: number
  focusTitle: string
  focusText: string
  progress: number
  completed: string
}

export type CalendarData = {
  tabs: string[]
  days: CalendarDay[]
  month: string
  monthDays: number[]
  weekStats: CalendarWeekStats
}
