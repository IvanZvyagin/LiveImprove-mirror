const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1'

export const getJson = async <T>(path: string, fallback: T): Promise<T> => {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`)
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }
    return (await response.json()) as T
  } catch (error) {
    console.warn(`API error for ${path}`, error)
    return fallback
  }
}

export const trackUiAction = async (action: string, payload?: string) => {
  await postJson('/ui-actions', { action, payload: payload ?? '' })
}
