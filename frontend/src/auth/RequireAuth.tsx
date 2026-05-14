import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

/**
 * Защита приватных маршрутов. Не авторизован — на /auth, путь сохраняется в state.from.
 */
export default function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location }} />
  }

  return <>{children}</>
}
