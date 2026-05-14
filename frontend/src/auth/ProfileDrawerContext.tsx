import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

type ProfileDrawerContextValue = {
  open: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
}

const ProfileDrawerContext = createContext<ProfileDrawerContextValue | null>(null)

export function ProfileDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  const openDrawer = useCallback(() => setOpen(true), [])
  const closeDrawer = useCallback(() => setOpen(false), [])
  const toggleDrawer = useCallback(() => setOpen((v) => !v), [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  const value = useMemo<ProfileDrawerContextValue>(
    () => ({ open, openDrawer, closeDrawer, toggleDrawer }),
    [open, openDrawer, closeDrawer, toggleDrawer],
  )

  return <ProfileDrawerContext.Provider value={value}>{children}</ProfileDrawerContext.Provider>
}

export function useProfileDrawer(): ProfileDrawerContextValue {
  const ctx = useContext(ProfileDrawerContext)
  if (!ctx) {
    throw new Error('useProfileDrawer must be used inside <ProfileDrawerProvider>')
  }
  return ctx
}
