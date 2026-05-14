export type DashboardMetric = {
  label: string
  value: string
  color: string
}

export type DashboardTaskType = 'habit' | 'task' | 'study'

export type DashboardTask = {
  id?: string
  title: string
  subtitle: string
  type: DashboardTaskType
  time: string
  done: boolean
}

export type DashboardData = {
  progressToday: number
  progressMetrics: DashboardMetric[]
  streak: {
    days: number
    week: { label: string; done: boolean }[]
  }
  nextInterview: {
    role: string
    company: string
    time: string
    location: string
  }
  todayTasks: DashboardTask[]
}
