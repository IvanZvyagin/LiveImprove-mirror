export type GoalAccent = 'blue' | 'green' | 'orange' | 'purple'

export type GoalStatus = 'ACTIVE' | 'PAUSED' | 'COMPLETED'

export type GoalItem = {
  id?: string
  title: string
  done: boolean
  date: string
}

export type Goal = {
  id: string
  title: string
  category: string
  progress: number
  timeLeft: string
  targetDate: string
  accent: GoalAccent
  icon: string
  iconType: string
  items: GoalItem[]
  status: GoalStatus
  pausedAt: string | null
  totalPausedDays: number
}

export type CompletedGoal = {
  id: string
  title: string
  category: string
  completedDate: string
  progress: number
  accent: GoalAccent
  icon: string
}

export type GoalsStats = {
  active: number
  completed: number
  averageProgress: number
  trend: number[]
  period: string
}

export type GoalsData = {
  tabs: string[]
  goals: Goal[]
  completed: CompletedGoal[]
  stats: GoalsStats
}
