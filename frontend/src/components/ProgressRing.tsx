import type { ReactNode } from 'react'
import styles from './ProgressRing.module.css'

type ProgressRingProps = {
  value: number
  label: ReactNode
  valueSuffix?: string
  className?: string
  accentColor?: string
  trackColor?: string
}

export default function ProgressRing({
  value,
  label,
  valueSuffix = '%',
  className,
  accentColor = 'var(--accent)',
  trackColor = '#1f2637',
}: ProgressRingProps) {
  const degrees = Math.round((value / 100) * 360)

  return (
    <div
      className={`${styles.ring}${className ? ` ${className}` : ''}`}
      style={{
        background: `conic-gradient(${accentColor} ${degrees}deg, ${trackColor} 0deg)`,
      }}
    >
      <div className={styles.center}>
        <div className={styles.value}>
          {value}
          {valueSuffix}
        </div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  )
}
