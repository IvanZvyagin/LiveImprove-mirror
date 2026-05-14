export type HabitAccent = 'green' | 'blue' | 'purple'

export type HabitItem = {
  id?: string
  title: string
  subtitle: string
  time: string
  done: boolean
  icon: string
  reminderEnabled?: boolean
}

export type HabitCategory = {
  id: string
  title: string
  count: number
  progress: number
  accent: HabitAccent
  icon: string
  habits: HabitItem[]
}

export type WeeklyProgressItem = {
  label: string
  value: number
  color: string
}

export type HabitsData = {
  tabs: string[]
  categories: HabitCategory[]
  weeklyProgress: WeeklyProgressItem[]
  weeklyTotal: string
}
