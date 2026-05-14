import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { loginRequest, registerRequest } from '../api/auth'
import {
  changePasswordRequest,
  fetchMe,
  updateAvatarRequest,
  updateNotificationsRequest,
  updateProfileRequest,
} from '../api/users'
import { clearAuthUser, readAuthUser, writeAuthUser, type AuthUser } from './authStorage'
import type { NotificationPrefs, UserProfile } from './profileTypes'

type AuthContextValue = {
  user: AuthUser | null
  profile: UserProfile | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
  updateProfile: (payload: { name?: string; username?: string }) => Promise<void>
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>
  updateAvatar: (avatarDataUrl: string | null) => Promise<void>
  updateNotifications: (payload: Partial<NotificationPrefs>) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function applySessionFromProfile(profile: UserProfile): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    token: profile.id,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => readAuthUser())
  const [profile, setProfile] = useState<UserProfile | null>(null)

  const persist = useCallback((next: UserProfile) => {
    const session = applySessionFromProfile(next)
    writeAuthUser(session)
    setUser(session)
    setProfile(next)
  }, [])

  const refreshProfile = useCallback(async () => {
    if (!user) return
    const next = await fetchMe()
    if (next) {
      setProfile(next)
    }
  }, [user])

  useEffect(() => {
    if (user && !profile) {
      void refreshProfile()
    }
  }, [user, profile, refreshProfile])

  const login = useCallback(async (email: string, password: string) => {
    const session = await loginRequest(email, password)
    writeAuthUser(session)
    setUser(session)
    const next = await fetchMe()
    if (next) setProfile(next)
  }, [])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const session = await registerRequest(email, password, name)
    writeAuthUser(session)
    setUser(session)
    const next = await fetchMe()
    if (next) setProfile(next)
  }, [])

  const logout = useCallback(() => {
    clearAuthUser()
    setUser(null)
    setProfile(null)
  }, [])

  const updateProfile = useCallback(
    async (payload: { name?: string; username?: string }) => {
      const next = await updateProfileRequest(payload)
      persist(next)
    },
    [persist],
  )

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      await changePasswordRequest({ currentPassword, newPassword })
    },
    [],
  )

  const updateAvatar = useCallback(
    async (avatarDataUrl: string | null) => {
      const next = await updateAvatarRequest(avatarDataUrl)
      persist(next)
    },
    [persist],
  )

  const updateNotifications = useCallback(
    async (payload: Partial<NotificationPrefs>) => {
      const next = await updateNotificationsRequest(payload)
      persist(next)
    },
    [persist],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      profile,
      isAuthenticated: user != null,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      changePassword,
      updateAvatar,
      updateNotifications,
    }),
    [
      user,
      profile,
      login,
      register,
      logout,
      refreshProfile,
      updateProfile,
      changePassword,
      updateAvatar,
      updateNotifications,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
