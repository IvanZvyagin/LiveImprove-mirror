import { useAuth } from '../auth/AuthContext'
import { useProfileDrawer } from '../auth/ProfileDrawerContext'

function initialsOf(name: string): string {
  const trimmed = name.trim()
  if (!trimmed) return 'U'
  const [first = '', second = ''] = trimmed.split(/\s+/)
  return ((first[0] ?? '') + (second[0] ?? '')).toUpperCase() || trimmed[0].toUpperCase()
}

/**
 * Кнопка пользователя в правом верхнем углу любого экрана. Открывает ProfileDrawer.
 */
export default function TopUserChip() {
  const { user, profile } = useAuth()
  const { openDrawer } = useProfileDrawer()

  if (!user) return null

  const name = profile?.name || user.name || user.email || 'Пользователь'
  const avatar = profile?.avatarDataUrl ?? null

  return (
    <button type="button" className="top-user-chip" onClick={openDrawer} aria-label={`Открыть профиль ${name}`}>
      <span className="top-user-chip__avatar" aria-hidden>
        {avatar ? <img src={avatar} alt="" /> : <span>{initialsOf(name)}</span>}
      </span>
      <span className="top-user-chip__name">{name}</span>
      <span className="top-user-chip__chev" aria-hidden>▾</span>
    </button>
  )
}
