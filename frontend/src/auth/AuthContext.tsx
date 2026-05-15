import type { Session } from '@supabase/supabase-js'
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import {
  changePasswordRequest,
  fetchMe,
  updateAvatarRequest,
  updateNotificationsRequest,
  updateProfileRequest,
} from '../api/users'
import { supabase } from '../lib/supabaseClient'
import { clearAuthUser, readAuthUser, writeAuthUser, type AuthUser } from './authStorage'
import type { NotificationPrefs, UserProfile } from './profileTypes'

function sessionToAuthUser(session: Session): AuthUser {
  const user = session.user
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const name =
    (typeof meta?.full_name === 'string' && meta.full_name) ||
    (typeof meta?.name === 'string' && meta.name) ||
    user.email?.split('@')[0] ||
    'Пользователь'
  return {
    id: user.id,
    email: user.email ?? '',
    name,
    token: session.access_token,
  }
}

function sessionToUserProfile(session: Session): UserProfile {
  const user = session.user
  const meta = user.user_metadata as Record<string, unknown> | undefined
  const name =
    (typeof meta?.full_name === 'string' && meta.full_name) ||
    (typeof meta?.name === 'string' && meta.name) ||
    user.email?.split('@')[0] ||
    'Пользователь'
  const avatar =
    typeof meta?.avatar_url === 'string'
      ? meta.avatar_url
      : typeof meta?.picture === 'string'
        ? meta.picture
        : null
  return {
    id: user.id,
    email: user.email ?? '',
    name,
    username:
      typeof meta?.user_name === 'string'
        ? meta.user_name
        : typeof meta?.preferred_username === 'string'
          ? meta.preferred_username
          : null,
    avatarDataUrl: avatar,
    notifications: { email: true, push: false, habits: true, goals: true },
  }
}

type AuthContextValue = {
  user: AuthUser | null
  profile: UserProfile | null
  isAuthenticated: boolean
  applySupabaseSession: (session: Session) => void
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
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

  const applySupabaseSession = useCallback((session: Session) => {
    const authUser = sessionToAuthUser(session)
    writeAuthUser(authUser)
    setUser(authUser)
    setProfile(sessionToUserProfile(session))
  }, [])

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
    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        applySupabaseSession(session)
      }
    })
  }, [applySupabaseSession])

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        applySupabaseSession(session)
      } else {
        clearAuthUser()
        setUser(null)
        setProfile(null)
      }
    })
    return () => subscription.unsubscribe()
  }, [applySupabaseSession])

  useEffect(() => {
    if (user && !profile) {
      void refreshProfile()
    }
  }, [user, profile, refreshProfile])

  const login = useCallback(async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    if (!data.session) throw new Error('Нет сессии после входа')
    applySupabaseSession(data.session)
    const next = await fetchMe()
    if (next) setProfile(next)
  }, [applySupabaseSession])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name ?? '', name: name ?? '' } },
    })
    if (error) throw new Error(error.message)
    if (data.session) {
      applySupabaseSession(data.session)
      const next = await fetchMe()
      if (next) setProfile(next)
    } else {
      throw new Error(
        'Аккаунт создан. Если в Supabase включено подтверждение email — перейдите по ссылке из письма, затем войдите.',
      )
    }
  }, [applySupabaseSession])

  const logout = useCallback(async () => {
    await supabase.auth.signOut()
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
      applySupabaseSession,
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
      applySupabaseSession,
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
