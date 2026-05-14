import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import styles from './Auth.module.css'

type Tab = 'login' | 'register'

export default function Auth() {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: { pathname?: string } } }
  const { login, register } = useAuth()

  const [tab, setTab] = useState<Tab>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) return
    setError(null)
    const trimmedEmail = email.trim()
    if (!trimmedEmail || !password) {
      setError('Введите логин и пароль')
      return
    }
    setSubmitting(true)
    try {
      if (tab === 'login') {
        await login(trimmedEmail, password)
      } else {
        await register(trimmedEmail, password)
      }
      const redirectTo = location.state?.from?.pathname ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error && err.message ? err.message : 'Не удалось выполнить вход')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.scene}>
      <div className={styles.arcs} aria-hidden />
      <div className={styles.card}>
        <div className={styles.logoRow}>
          <div className={styles.logoMark} aria-hidden>
            <LogoTrendIcon />
          </div>
          <div className={styles.logoText}>LiveImprove</div>
        </div>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'login'}
            className={`${styles.tab}${tab === 'login' ? ` ${styles.active}` : ''}`}
            onClick={() => setTab('login')}
          >
            Вход
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === 'register'}
            className={`${styles.tab}${tab === 'register' ? ` ${styles.active}` : ''}`}
            onClick={() => setTab('register')}
          >
            Регистрация
          </button>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-email">
              Email
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.iconLeft}>
                <MailIcon />
              </span>
              <input
                id="auth-email"
                type="text"
                autoComplete="username"
                placeholder="Введите ваш email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="auth-password">
              Пароль
            </label>
            <div className={styles.inputWrap}>
              <span className={styles.iconLeft}>
                <LockIcon />
              </span>
              <input
                id="auth-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                placeholder="Введите ваш пароль"
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className={styles.iconRight}
                aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {tab === 'login' ? (
            <div className={styles.forgotRow}>
              <button type="button" className={styles.forgotLink} onClick={() => setError('Восстановление пароля пока недоступно')}>
                Забыли пароль?
              </button>
            </div>
          ) : null}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? (tab === 'login' ? 'Вход…' : 'Создание…') : tab === 'login' ? 'Войти' : 'Создать аккаунт'}
          </button>

          {error ? <p className={styles.error}>{error}</p> : null}
        </form>

        <div className={styles.divider}>
          <span>Или войти через</span>
        </div>

        <div className={styles.socials} aria-hidden>
          <SocialButton label="VK">
            <VkIcon />
          </SocialButton>
          <SocialButton label="Telegram">
            <TelegramIcon />
          </SocialButton>
          <SocialButton label="Google">
            <GoogleIcon />
          </SocialButton>
          <SocialButton label="Yandex">
            <YandexIcon />
          </SocialButton>
          <SocialButton label="GitHub">
            <GithubIcon />
          </SocialButton>
        </div>
      </div>
    </div>
  )
}

function SocialButton({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <button type="button" className={styles.socialButton} aria-label={`Войти через ${label}`}>
      {children}
    </button>
  )
}

function LogoTrendIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 16.5L9.5 11L13 14.5L20 7.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M14.5 7.5H20V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M4 7.5L12 13L20 7.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="10.5" width="15" height="10.5" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5V8a4 4 0 1 1 8 0v2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2.5 12s3.5-6.5 9.5-6.5S21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 3l18 18M10.6 6.7A9 9 0 0 1 12 6.5C18 6.5 21.5 12 21.5 12s-1 1.7-2.7 3.3M6.4 8.4C4 10.3 2.5 12 2.5 12S6 17.5 12 17.5c1.3 0 2.5-.2 3.6-.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path d="M9.5 9.5a3.5 3.5 0 0 0 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function VkIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#0077FF" />
      <path
        d="M12.3 16.4h.85s.26-.03.39-.18c.13-.13.12-.39.12-.39s-.02-1.13.5-1.3c.51-.17 1.18 1.13 1.88 1.63.53.38.93.3.93.3l1.86-.03s.97-.06.5-.83c-.04-.06-.27-.57-1.4-1.61-1.18-1.1-1.02-.92.4-2.81.86-1.15 1.21-1.84 1.1-2.14-.1-.28-.72-.2-.72-.2H17.7s-.16-.02-.27.05c-.12.07-.19.23-.19.23s-.34.91-.79 1.68c-.95 1.62-1.34 1.71-1.49 1.61-.36-.23-.27-.92-.27-1.4 0-1.52.23-2.16-.45-2.32-.23-.06-.4-.1-.98-.1-.75 0-1.39 0-1.75.18-.24.12-.43.39-.32.4.13.02.43.08.59.3.21.27.2.89.2.89s.12 1.79-.29 2c-.28.15-.66-.16-1.5-1.65-.43-.76-.76-1.6-.76-1.6s-.06-.16-.18-.24c-.14-.1-.34-.13-.34-.13H6.92s-.31.01-.42.14c-.1.12-.01.36-.01.36s1.6 3.78 3.43 5.69c1.67 1.74 3.57 1.63 3.57 1.63h.81Z"
        fill="#fff"
      />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <defs>
        <linearGradient id="tg-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2AABEE" />
          <stop offset="100%" stopColor="#229ED9" />
        </linearGradient>
      </defs>
      <rect width="24" height="24" rx="6" fill="url(#tg-grad)" />
      <path
        d="M6.4 12.1l11.3-4.4c.5-.2 1 .1.9.7l-1.9 8.9c-.1.6-.6.7-1 .5l-2.9-2.1-1.4 1.4c-.2.2-.4.3-.7.3l.2-2.9 5.3-4.8c.2-.2 0-.3-.3-.1l-6.5 4.1-2.8-.9c-.6-.2-.6-.6.1-.9Z"
        fill="#fff"
      />
    </svg>
  )
}

function GoogleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#fff" />
      <path
        d="M19.6 12.2c0-.5 0-1-.1-1.4H12v2.7h4.3c-.2 1-.8 1.8-1.6 2.4v2h2.6c1.5-1.4 2.3-3.4 2.3-5.7Z"
        fill="#4285F4"
      />
      <path d="M12 20c2.2 0 4-.7 5.3-1.9l-2.6-2c-.7.5-1.6.8-2.7.8-2.1 0-3.8-1.4-4.4-3.3H4.9v2.1C6.2 18.3 8.9 20 12 20Z" fill="#34A853" />
      <path d="M7.6 13.6c-.2-.5-.3-1-.3-1.6 0-.6.1-1.1.3-1.6V8.3H4.9C4.3 9.4 4 10.7 4 12s.3 2.6.9 3.7l2.7-2.1Z" fill="#FBBC05" />
      <path d="M12 7.5c1.2 0 2.3.4 3.1 1.2l2.3-2.3C16 5.1 14.2 4.4 12 4.4 8.9 4.4 6.2 6.1 4.9 8.3l2.7 2.1C8.2 8.9 9.9 7.5 12 7.5Z" fill="#EA4335" />
    </svg>
  )
}

function YandexIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#FC3F1D" />
      <path d="M13.6 6h-2.4c-2.5 0-4.2 1.8-4.2 4.3 0 1.8.8 3.1 2.3 3.9l-2.8 4.6h1.9l3-5.1h1V19h1.7V6Zm-1.7 6.5h-.7c-1.3 0-2.4-.7-2.4-2.3 0-1.6.9-2.5 2.5-2.5h.6v4.8Z" fill="#fff" />
    </svg>
  )
}

function GithubIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <rect width="24" height="24" rx="6" fill="#181717" />
      <path
        d="M12 5.5c-3.6 0-6.5 2.9-6.5 6.5 0 2.9 1.9 5.3 4.5 6.2.3.1.4-.1.4-.3v-1.1c-1.8.4-2.2-.8-2.2-.8-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.7 0 1 .7 1 .7.6 1 1.6.7 2 .5.1-.4.2-.7.4-.9-1.4-.2-2.9-.7-2.9-3.2 0-.7.2-1.3.7-1.7-.1-.2-.3-.9.1-1.8 0 0 .6-.2 1.8.7.5-.2 1.1-.2 1.6-.2s1.1.1 1.6.2c1.2-.9 1.8-.7 1.8-.7.4.9.1 1.6.1 1.8.4.5.7 1 .7 1.7 0 2.5-1.5 3-2.9 3.2.2.2.4.6.4 1.2v1.7c0 .2.1.4.4.3 2.6-.9 4.5-3.3 4.5-6.2 0-3.6-2.9-6.5-6.5-6.5Z"
        fill="#fff"
      />
    </svg>
  )
}
