import { getAuthToken } from '../auth/authStorage'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

/** Добавляем Bearer JWT (Supabase access token) к API-запросам. */
function authHeaders(extra?: Record<string, string>): Record<string, string> {
  const headers: Record<string, string> = { ...(extra ?? {}) }
  const token = getAuthToken()
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

export const getJson = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: authHeaders(),
    })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return (await response.json()) as T
  } catch (error) {
    console.warn(`API error for ${path}, fallback used`, error)
    return fallback
  }
}

export const postJson = async <T>(
  path: string,
  body: unknown,
  fallback?: T,
): Promise<T | undefined> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: authHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    const contentType = response.headers.get('content-type')
    if (!contentType || response.status === 204) {
      return fallback
    }
    if (!contentType.includes('application/json')) {
      return fallback
    }
    return (await response.json()) as T
  } catch (error) {
    console.warn(`API error for ${path}`, error)
    return fallback
  }
}

export const deleteRequest = async (path: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'omit',
    headers: authHeaders(),
  })
  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    throw new Error(`Delete failed: ${response.status}${detail ? ` ${detail}` : ''}`)
  }
}

/**
 * POST без fallback: пробрасывает ошибку с текстом из ответа. Используется в auth-флоу,
 * где нужно показать пользователю конкретное сообщение от бэкенда.
 */
export const postJsonStrict = async <T>(path: string, body: unknown): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  })
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    const message = extractErrorMessage(text) ?? `Запрос не выполнен: ${response.status}`
    throw new Error(message)
  }
  return (await response.json()) as T
}

function extractErrorMessage(raw: string): string | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>
    const message = parsed.message ?? parsed.error
    return typeof message === 'string' && message.length > 0 ? message : null
  } catch {
    return raw.length > 0 ? raw : null
  }
}

export const trackUiAction = async (action: string, payload?: string) => {
  await postJson('/ui-actions', { action, payload: payload ?? '' })
}
