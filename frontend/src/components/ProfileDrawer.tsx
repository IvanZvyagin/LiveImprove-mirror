import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { useProfileDrawer } from '../auth/ProfileDrawerContext'
import type { NotificationPrefs, UserProfile } from '../auth/profileTypes'
import styles from './ProfileDrawer.module.css'

/** Имя для отображения, если профиль ещё не подтянут. */
function nameOf(profile: UserProfile | null, fallback: string): string {
  return (profile?.name || fallback || 'Пользователь').trim()
}

function initialsOf(profile: UserProfile | null, fallback: string): string {
  const value = nameOf(profile, fallback)
  const [first = '', second = ''] = value.split(/\s+/)
  return ((first[0] ?? '') + (second[0] ?? '')).toUpperCase() || value[0].toUpperCase()
}

function handleOf(profile: UserProfile | null): string {
  if (profile?.username) return `@${profile.username}`
  const email = profile?.email ?? ''
  const idx = email.indexOf('@')
  return idx > 0 ? `@${email.slice(0, idx)}` : '@user'
}

type SubView = 'main' | 'security' | 'avatar' | 'notifications'

export default function ProfileDrawer() {
  const { open, closeDrawer } = useProfileDrawer()
  const { user, profile, logout } = useAuth()
  const navigate = useNavigate()

  const [mounted, setMounted] = useState(open)
  const [closing, setClosing] = useState(false)
  const [view, setView] = useState<SubView>('main')
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeButtonRef = useRef<HTMLButtonElement | null>(null)

  const close = useCallback(() => {
    setClosing(true)
    window.setTimeout(() => {
      setClosing(false)
      setView('main')
      closeDrawer()
    }, 220)
  }, [closeDrawer])

  useEffect(() => {
    if (open) {
      setMounted(true)
      setClosing(false)
    } else if (mounted) {
      setMounted(false)
    }
  }, [open, mounted])

  useEffect(() => {
    if (!mounted) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [mounted])

  useEffect(() => {
    if (!mounted) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
      }
    }
    window.addEventListener('keydown', onKey)
    closeButtonRef.current?.focus()
    return () => window.removeEventListener('keydown', onKey)
  }, [mounted, close])

  const onBackdropClick = useCallback(() => {
    close()
  }, [close])

  const handleLogout = useCallback(() => {
    logout()
    setClosing(false)
    closeDrawer()
    navigate('/auth', { replace: true })
  }, [logout, closeDrawer, navigate])

  if (!mounted) return null

  const fallbackName = user?.name || user?.email || ''

  return createPortal(
    <div role="presentation">
      <button
        type="button"
        aria-label="Закрыть"
        className={`${styles.backdrop}${closing ? ` ${styles.closing}` : ''}`}
        onClick={onBackdropClick}
      />
      <aside
        ref={panelRef}
        className={`${styles.panel}${closing ? ` ${styles.closing}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-drawer-title"
      >
        <DrawerHeader
          showBack={view !== 'main'}
          onBack={() => setView('main')}
          closeRef={closeButtonRef}
          onClose={close}
        />

        {view === 'main' ? (
          <MainView
            profile={profile}
            fallbackName={fallbackName}
            onLogout={handleLogout}
            onOpenSecurity={() => setView('security')}
            onOpenAvatar={() => setView('avatar')}
            onOpenNotifications={() => setView('notifications')}
            onEditPersonal={() => setView('avatar')}
          />
        ) : null}

        {view === 'security' ? <SecurityPanel /> : null}
        {view === 'avatar' ? <AvatarPanel profile={profile} fallbackName={fallbackName} /> : null}
        {view === 'notifications' ? <NotificationsPanel profile={profile} /> : null}
      </aside>
    </div>,
    document.body,
  )
}

function DrawerHeader({
  showBack,
  onBack,
  onClose,
  closeRef,
}: {
  showBack: boolean
  onBack: () => void
  onClose: () => void
  closeRef: React.RefObject<HTMLButtonElement | null>
}) {
  return (
    <div className={styles.header}>
      {showBack ? (
        <button type="button" className={styles.headerBack} onClick={onBack} aria-label="Назад">
          <ArrowLeftIcon />
        </button>
      ) : null}
      <div className={styles.logoMark} aria-hidden>
        <LogoTrendIcon />
      </div>
      <div id="profile-drawer-title" className={styles.logoText}>
        LiveImprove
      </div>
      <button
        ref={closeRef}
        type="button"
        className={styles.headerClose}
        onClick={onClose}
        aria-label="Закрыть"
      >
        <CloseIcon />
      </button>
    </div>
  )
}

function MainView({
  profile,
  fallbackName,
  onLogout,
  onOpenSecurity,
  onOpenAvatar,
  onOpenNotifications,
  onEditPersonal,
}: {
  profile: UserProfile | null
  fallbackName: string
  onLogout: () => void
  onOpenSecurity: () => void
  onOpenAvatar: () => void
  onOpenNotifications: () => void
  onEditPersonal: () => void
}) {
  const name = nameOf(profile, fallbackName)
  const handle = handleOf(profile)
  const initials = initialsOf(profile, fallbackName)
  const avatar = profile?.avatarDataUrl ?? null

  return (
    <>
      <Section label="1. Личные данные">
        <div className={styles.personal}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatarRing}>
              <div className={styles.avatarInner}>
                {avatar ? <img src={avatar} alt="" className={styles.avatarImg} /> : initials}
              </div>
            </div>
            <button
              type="button"
              className={styles.avatarPencil}
              aria-label="Изменить фото профиля"
              onClick={onEditPersonal}
            >
              <PencilIcon />
            </button>
          </div>
          <div className={styles.personalText}>
            <div className={styles.personalName}>{name}</div>
            <div className={styles.personalHandle}>{handle}</div>
          </div>
        </div>
      </Section>

      <Section label="2. Настройки профиля">
        <div className={styles.settingsList}>
          <SettingsRow icon={<ShieldIcon />} label="Безопасность" onClick={onOpenSecurity} />
          <SettingsRow icon={<UserIcon />} label="Фото профиля" onClick={onOpenAvatar} />
          <SettingsRow icon={<BellIcon />} label="Уведомления" onClick={onOpenNotifications} />
        </div>
      </Section>

      <Section label="3. Информация о подписке">
        <ProPlanCard />
      </Section>

      <Section label="4. Выход">
        <button type="button" className={styles.logout} onClick={onLogout}>
          <LogoutIcon /> Выйти
        </button>
      </Section>
    </>
  )
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <div className={styles.sectionLabel}>{label}</div>
      <div className={styles.section}>{children}</div>
    </div>
  )
}

function SettingsRow({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button type="button" className={styles.settingsRow} onClick={onClick}>
      <span className={styles.settingsIcon}>{icon}</span>
      <span>{label}</span>
      <span className={styles.chev}>
        <ChevronRightIcon />
      </span>
    </button>
  )
}

function ProPlanCard() {
  const renewalDate = useMemo(() => {
    const d = new Date()
    d.setFullYear(d.getFullYear() + 1)
    return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
  }, [])

  return (
    <div className={styles.pro}>
      <div className={styles.proHeader}>
        <div className={styles.proCrown}>PRO</div>
        <div>
          <div className={styles.proTitleRow}>
            <div className={styles.proName}>Pro Plan</div>
            <span className={styles.proStatus}>Активна</span>
          </div>
          <div className={styles.proDate}>
            <CalendarIcon /> Подписка действует до {renewalDate}
          </div>
        </div>
      </div>

      <div>
        <div className={styles.proBar}>
          <div className={styles.proBarTrack}>
            <div className={styles.proBarFill} style={{ width: '100%' }} />
          </div>
          <span className={styles.proBarText}>100%</span>
        </div>
        <div className={styles.proBarHint}>Вы используете все преимущества Pro плана</div>
      </div>

      <div className={styles.proFeatures}>
        <ProFeature icon={<InfinityIcon />} label="Безлимитные цели" />
        <ProFeature icon={<ChartIcon />} label="Расширенная аналитика" />
        <ProFeature icon={<CloudIcon />} label="Резервное копирование" />
        <ProFeature icon={<HeadsetIcon />} label="Приоритетная поддержка" />
      </div>
    </div>
  )
}

function ProFeature({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className={styles.proFeature}>
      <div className={styles.proFeatureIcon}>{icon}</div>
      <div className={styles.proFeatureLabel}>{label}</div>
    </div>
  )
}

/* ---------- Sub-views ---------- */

function SecurityPanel() {
  const { changePassword } = useAuth()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    if (!current || !next) {
      setError('Заполните оба поля')
      return
    }
    if (next.length < 4) {
      setError('Новый пароль должен быть не короче 4 символов')
      return
    }
    if (next !== confirm) {
      setError('Пароли не совпадают')
      return
    }
    setSubmitting(true)
    try {
      await changePassword(current, next)
      setSuccess('Пароль обновлён')
      setCurrent('')
      setNext('')
      setConfirm('')
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Не удалось сменить пароль')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.sub} onSubmit={onSubmit}>
      <div className={styles.subHeader}>Безопасность</div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="security-current">
          Текущий пароль
        </label>
        <input
          id="security-current"
          type="password"
          className={styles.input}
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="security-new">
          Новый пароль
        </label>
        <input
          id="security-new"
          type="password"
          className={styles.input}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="security-confirm">
          Повторите пароль
        </label>
        <input
          id="security-confirm"
          type="password"
          className={styles.input}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
        />
      </div>
      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? 'Сохранение…' : 'Сменить пароль'}
      </button>
      {error ? <p className={styles.statusError}>{error}</p> : null}
      {success ? <p className={styles.statusSuccess}>{success}</p> : null}
    </form>
  )
}

function AvatarPanel({
  profile,
  fallbackName,
}: {
  profile: UserProfile | null
  fallbackName: string
}) {
  const { updateAvatar, updateProfile } = useAuth()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [name, setName] = useState(profile?.name ?? fallbackName)
  const [username, setUsername] = useState(profile?.username ?? '')

  useEffect(() => {
    setName(profile?.name ?? fallbackName)
    setUsername(profile?.username ?? '')
  }, [profile, fallbackName])

  const onPick = () => fileInputRef.current?.click()

  const onFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setError('Выберите файл-изображение')
      return
    }
    if (file.size > 1_500_000) {
      setError('Файл больше 1.5 МБ — выберите поменьше')
      return
    }
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      const dataUrl = await readFileAsDataUrl(file)
      await updateAvatar(dataUrl)
      setSuccess('Аватар обновлён')
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Не удалось загрузить файл')
    } finally {
      setSubmitting(false)
    }
  }

  const onRemove = async () => {
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      await updateAvatar(null)
      setSuccess('Аватар удалён')
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Не удалось удалить аватар')
    } finally {
      setSubmitting(false)
    }
  }

  const onSaveText = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(null)
    setSubmitting(true)
    try {
      await updateProfile({ name: name.trim(), username: username.trim() })
      setSuccess('Профиль обновлён')
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Не удалось сохранить')
    } finally {
      setSubmitting(false)
    }
  }

  const avatar = profile?.avatarDataUrl ?? null

  return (
    <div className={styles.sub}>
      <div className={styles.subHeader}>Фото профиля</div>
      <div className={styles.avatarPreview}>
        <div className={styles.avatarPreviewCircle}>
          {avatar ? (
            <img src={avatar} alt="" />
          ) : (
            <span style={{ fontSize: 24, fontWeight: 700 }}>{initialsOf(profile, fallbackName)}</span>
          )}
        </div>
        <div className={styles.avatarActions}>
          <button type="button" className={styles.avatarBtn} onClick={onPick} disabled={submitting}>
            Загрузить фото
          </button>
          {avatar ? (
            <button
              type="button"
              className={`${styles.avatarBtn} ${styles.danger}`}
              onClick={onRemove}
              disabled={submitting}
            >
              Удалить
            </button>
          ) : null}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={onFile}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      <form className={styles.sub} onSubmit={onSaveText}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-name">
            Имя и фамилия
          </label>
          <input
            id="profile-name"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="profile-username">
            Логин (@username)
          </label>
          <input
            id="profile-username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
          />
        </div>
        <button type="submit" className={styles.submit} disabled={submitting}>
          {submitting ? 'Сохранение…' : 'Сохранить'}
        </button>
        {error ? <p className={styles.statusError}>{error}</p> : null}
        {success ? <p className={styles.statusSuccess}>{success}</p> : null}
      </form>
    </div>
  )
}

function NotificationsPanel({ profile }: { profile: UserProfile | null }) {
  const { updateNotifications } = useAuth()
  const [prefs, setPrefs] = useState<NotificationPrefs>(
    profile?.notifications ?? { email: true, push: true, habits: true, goals: true },
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (profile?.notifications) setPrefs(profile.notifications)
  }, [profile])

  const toggle = async (key: keyof NotificationPrefs) => {
    const nextValue = !prefs[key]
    const optimistic = { ...prefs, [key]: nextValue }
    setPrefs(optimistic)
    setError(null)
    setSubmitting(true)
    try {
      await updateNotifications({ [key]: nextValue })
    } catch (err) {
      setPrefs(prefs)
      setError(err instanceof Error && err.message ? err.message : 'Не удалось обновить')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.sub}>
      <div className={styles.subHeader}>Уведомления</div>
      <ToggleRow label="Email-уведомления" on={prefs.email} disabled={submitting} onClick={() => toggle('email')} />
      <ToggleRow label="Push-уведомления" on={prefs.push} disabled={submitting} onClick={() => toggle('push')} />
      <ToggleRow label="Напоминания о привычках" on={prefs.habits} disabled={submitting} onClick={() => toggle('habits')} />
      <ToggleRow label="Напоминания о целях" on={prefs.goals} disabled={submitting} onClick={() => toggle('goals')} />
      {error ? <p className={styles.statusError}>{error}</p> : null}
    </div>
  )
}

function ToggleRow({
  label,
  on,
  disabled,
  onClick,
}: {
  label: string
  on: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <div className={styles.notifRow}>
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        className={`${styles.toggle}${on ? ` ${styles.on}` : ''}`}
        onClick={onClick}
        disabled={disabled}
      />
    </div>
  )
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

/* ---------- Icons ---------- */

function LogoTrendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 16.5L9.5 11L13 14.5L20 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14.5 7.5H20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PencilIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 17l-1 4 4-1L19.5 7.5a2.121 2.121 0 0 0-3-3L4 17Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M14.5 5.5l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.5l8 3v6c0 4.5-3.4 7.5-8 8.5-4.6-1-8-4-8-8.5v-6l8-3Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
      <path d="M4 20c1.5-3.5 4.5-5 8-5s6.5 1.5 8 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 16.5h12l-1.5-2.5V11A4.5 4.5 0 0 0 12 6.5 4.5 4.5 0 0 0 7.5 11v3L6 16.5Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3.5 9.5h17" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M14 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M10 12h11M18 9l3 3-3 3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function InfinityIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 12c0-2.5 2-4.5 4.5-4.5 1.5 0 2.5 1 3.5 2.5 1 1.5 2 2.5 3.5 2.5C20 12.5 22 10.5 22 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M18 12c0 2.5-2 4.5-4.5 4.5-1.5 0-2.5-1-3.5-2.5C9 12.5 8 11.5 6.5 11.5 4 11.5 2 13.5 2 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function ChartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 19V10M11 19V5M17 19v-6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function CloudIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M7.5 17.5h9a4 4 0 0 0 .3-7.99A6 6 0 0 0 5.5 11.5a3.5 3.5 0 0 0 2 6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function HeadsetIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <rect x="3.5" y="14" width="4" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <rect x="16.5" y="14" width="4" height="6" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
      <path d="M20 19c0 1.5-1.5 2.5-3.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}
