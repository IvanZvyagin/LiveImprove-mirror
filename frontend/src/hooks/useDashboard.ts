import { useEffect, useState } from 'react'
import { createDashboardTask, dashboardFallback, fetchDashboard, toggleDashboardTask } from '../api/dashboard'
import type { DashboardData, DashboardTask } from '../types/dashboard'
import { trackUiAction } from '../api/client'

export default function useDashboard() {
  const [data, setData] = useState<DashboardData>(dashboardFallback)

  const refresh = () => fetchDashboard().then(setData)

  useEffect(() => {
    refresh()
  }, [])

  const toggleTask = async (task: DashboardTask) => {
    await toggleDashboardTask(task)
    await refresh()
  }

  const addTask = async () => {
    await createDashboardTask()
    await refresh()
  }

  const trackAction = async (action: string, payload?: string) => {
    await trackUiAction(action, payload)
  }

  return { data, toggleTask, addTask, trackAction }
}
