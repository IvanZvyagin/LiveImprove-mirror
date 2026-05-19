import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { OAUTH_RETURN_STORAGE_KEY } from '../auth/oauth'
import { supabase } from '../lib/supabaseClient'
import styles from './Auth.module.css'

/**
 * Целевой URL после OAuth (записывается на странице /auth перед редиректом на провайдера).
 */
export default function AuthCallback() {
  const navigate = useNavigate()
  const { applySupabaseSession } = useAuth()
  const [message, setMessage] = useState('Завершение входа…')
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search)
        const code = params.get('code')

        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          if (exchangeError) {
            // В dev (StrictMode) эффект может сработать повторно; даём шанс уже сохранённой сессии.
            const {
              data: { session: existingSession },
            } = await supabase.auth.getSession()
            if (!existingSession) {
              setMessage(exchangeError.message)
              navigate('/auth', { replace: true })
              return
            }
          }
        }

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError || !session) {
          setMessage(sessionError?.message ?? 'Сессия не найдена')
          navigate('/auth', { replace: true })
          return
        }

        applySupabaseSession(session)

        const returnTo = sessionStorage.getItem(OAUTH_RETURN_STORAGE_KEY) ?? '/'
        sessionStorage.removeItem(OAUTH_RETURN_STORAGE_KEY)
        navigate(returnTo, { replace: true })
      } catch (e) {
        setMessage(e instanceof Error ? e.message : 'Ошибка входа')
        navigate('/auth', { replace: true })
      }
    }

    void run()
  }, [applySupabaseSession, navigate])

  return (
    <div className={styles.scene}>
      <div className={styles.card}>
        <p className={styles.logoText}>{message}</p>
      </div>
    </div>
  )
}
