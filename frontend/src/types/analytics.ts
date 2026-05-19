export type AnalyticsTab = '7 дней' | '30 дней' | '90 дней' | 'Год'

export type AnalyticsMeta = {
  label: string
  value: number
  delta: string
}

export type BugRate = {
  value: number
  delta: string
  points: number[]
  labels: string[]
}

export type InterviewStage = {
  label: string
  value: number
  percent: number
  gradient: string
}

export type IncomeSeries = {
  current: string
  delta: string
  forecast: string
  points: number[]
  labels: string[]
}

export type MetricIconKind =
  | 'tasks'
  | 'velocity'
  | 'coverage'
  | 'review'
  | 'debt'

export type KeyMetric = {
  label: string
  value: number | string
  delta: string
  trend?: 'up' | 'down'
  iconKind?: MetricIconKind
  points?: number[]
  color?: string
}

export type Insight = {
  title: string
  text: string
  kind?: 'insight' | 'recommendation'
}

export type IncomeMetaItem = {
  label: string
  value: string
  arrow?: boolean
}

export type InterviewsMeta = {
  conversionLabel: string
  conversionValue: string
  bestLabel: string
  bestValue: string
}

export type AnalyticsData = {
  tabs: AnalyticsTab[]
  outputScore: {
    value: number
    delta: string
    status: string
    description?: string
  }
  outputMeta: AnalyticsMeta[]
  bugRate: BugRate & { footer?: string; gridMax?: number; gridStep?: number }
  interviews: InterviewStage[]
  interviewsMeta?: InterviewsMeta
  income: IncomeSeries & { subtitle?: string; meta?: IncomeMetaItem[] }
  metrics: KeyMetric[]
  insights: Insight[]
}
