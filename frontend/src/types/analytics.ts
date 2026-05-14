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

export type KeyMetric = {
  label: string
  value: number | string
  delta: string
}

export type Insight = {
  title: string
  text: string
}

export type AnalyticsData = {
  tabs: AnalyticsTab[]
  outputScore: {
    value: number
    delta: string
    status: string
  }
  outputMeta: AnalyticsMeta[]
  bugRate: BugRate
  interviews: InterviewStage[]
  income: IncomeSeries
  metrics: KeyMetric[]
  insights: Insight[]
}
