import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

type EmptyStateProps = {
  icon: ReactNode
  title: string
  description?: ReactNode
  actionLabel?: string
  onAction?: () => void
  hint?: ReactNode
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  hint,
}: EmptyStateProps) {
  return (
    <div className={styles.wrap} role="status" aria-live="polite">
      <div className={styles.illustration}>{icon}</div>
      <h3 className={styles.title}>{title}</h3>
      {description ? <p className={styles.subtitle}>{description}</p> : null}
      {actionLabel && onAction ? (
        <button type="button" className={styles.action} onClick={onAction}>
          <svg viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </svg>
          {actionLabel}
        </button>
      ) : null}
      {hint ? <div className={styles.hint}>{hint}</div> : null}
    </div>
  )
}
