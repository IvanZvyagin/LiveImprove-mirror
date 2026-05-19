import { getAuthToken } from '../auth/authStorage'
import type { NotificationPrefs, UserProfile } from '../auth/profileTypes'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'
const USERS_API_BASE_URL =
  import.meta.env.VITE_USERS_API_URL ?? API_BASE_URL.replace(/\/api\/v1\/?$/, '')

type RawProfile = {
  userId?: string
  id?: string
  email: string
  name: string
  username: string | null
  avatarDataUrl: string | null
  notification?: NotificationPrefs
  notifications?: NotificationPrefs
}

function toProfile(raw: RawProfile): UserProfile {
  const notifications = raw.notification ?? raw.notifications
  return {
    id: raw.userId ?? raw.id ?? '',
    email: raw.email,
    name: raw.name,
    username: raw.username ?? null,
    avatarDataUrl: raw.avatarDataUrl ?? null,
    notifications: notifications ?? { email: true, push: true, habits: true, goals: true },
  }
}

export async function fetchMe(): Promise<UserProfile | null> {
  const token = getAuthToken()
  if (!token) return null

  try {
    const response = await fetch(`${USERS_API_BASE_URL}/users/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    if (!response.ok) return null
    const raw = (await response.json()) as RawProfile
    if (!raw.userId && !raw.id) return null
    return toProfile(raw)
  } catch {
    return null
  }
}

/**
 * PUT-запрос со «строгой» обработкой ошибок — пробрасывает {message} от бэкенда.
 */
async function putJsonStrict<T>(path: string, body: unknown): Promise<T> {
  const token = getAuthToken()
  const response = await fetch(`${USERS_API_BASE_URL}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    let message: string | null = null
    if (text) {
      try {
        const parsed = JSON.parse(text) as Record<string, unknown>
        const value = parsed.message ?? parsed.error
        message = typeof value === 'string' && value ? value : null
      } catch {
        message = text
      }
    }
    throw new Error(message ?? `Запрос не выполнен: ${response.status}`)
  }
  if (response.status === 204) {
    return undefined as T
  }
  return (await response.json()) as T
}

export async function updateProfileRequest(payload: {
  name?: string
  username?: string
}): Promise<UserProfile> {
  const raw = await putJsonStrict<RawProfile>('/users/me', payload)
  return toProfile(raw)
}

export async function updateAvatarRequest(avatarDataUrl: string | null): Promise<UserProfile> {
  if (avatarDataUrl == null) {
    throw new Error('Удаление аватара пока не поддерживается сервером')
  }
  const raw = await putJsonStrict<RawProfile>('/users/me/avatar', { avatarDataUrl })
  return toProfile(raw)
}

export async function updateNotificationsRequest(
  payload: Partial<NotificationPrefs>,
): Promise<UserProfile> {
  const raw = await putJsonStrict<RawProfile>('/users/me/notifications', payload)
  return toProfile(raw)
}
