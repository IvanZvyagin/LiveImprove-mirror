import { analyticsMock } from '../mocks/analytics'
import type { AnalyticsData } from '../types/analytics'
import { getJson } from './client'

export const analyticsFallback = analyticsMock

export const fetchAnalytics = async (): Promise<AnalyticsData> => {
  return getJson('/analytics', analyticsMock)
}
