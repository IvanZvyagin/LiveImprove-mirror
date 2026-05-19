/**
 * Расширенный профиль пользователя для ProfileDrawer (имя, @login, аватар, уведомления).
 */
export type NotificationPrefs = {
  email: boolean
  push: boolean
  habits: boolean
  goals: boolean
}

export type UserProfile = {
  id: string
  email: string
  name: string
  username: string | null
  avatarDataUrl: string | null
  notifications: NotificationPrefs
}
