import { useEffect, useState } from 'react'
import { analyticsFallback, fetchAnalytics } from '../api/analytics'
import type { AnalyticsData } from '../types/analytics'
import { trackUiAction } from '../api/client'

export default function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>(analyticsFallback)

  const refresh = () => fetchAnalytics().then(setData)

  useEffect(() => {
    refresh()
  }, [])

  const trackAction = async (action: string, payload?: string) => {
    await trackUiAction(action, payload)
  }

  return { data, trackAction }
}
