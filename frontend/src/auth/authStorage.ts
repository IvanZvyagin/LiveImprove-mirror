/**
 * Хранение текущего пользователя в localStorage.
 * Поле token — Supabase access JWT, который отправляется в Authorization: Bearer.
 */

export type AuthUser = {
  id: string
  email: string
  name: string
  token: string
}

const STORAGE_KEY = 'liveimprove.auth'

export function readAuthUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as AuthUser
    if (!parsed || typeof parsed.id !== 'string' || typeof parsed.token !== 'string') {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function writeAuthUser(user: AuthUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearAuthUser(): void {
  localStorage.removeItem(STORAGE_KEY)
}

export function getAuthToken(): string | null {
  return readAuthUser()?.token ?? null
}
