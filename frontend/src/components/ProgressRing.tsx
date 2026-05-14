import type { CSSProperties, ReactNode } from 'react'
import styles from './ProgressRing.module.css'

const DEFAULT_SIZE = 140
const STROKE = 9

type ProgressRingProps = {
  value: number
  label: ReactNode
  valueSuffix?: string
  className?: string
  accentColor?: string
  trackColor?: string
  /** Диаметр SVG в px (по умолчанию 140). */
  size?: number
}

/**
 * Круговой прогресс: SVG + плавная анимация при изменении value.
 */
export default function ProgressRing({
  value,
  label,
  valueSuffix = '%',
  className,
  accentColor = 'var(--accent)',
  trackColor = '#2a3244',
  size: sizeProp,
}: ProgressRingProps) {
  const size = sizeProp ?? DEFAULT_SIZE
  const r = size / 2 - STROKE / 2 - 2
  const circ = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, Math.round(value)))
  const offset = circ - (clamped / 100) * circ

  const wrapStyle = {
    ['--ring-accent' as string]: accentColor,
    ['--ring-track' as string]: trackColor,
    width: size,
    height: size,
  } as CSSProperties

  return (
    <div
      className={`${styles.wrap}${className ? ` ${className}` : ''}`}
      style={wrapStyle}
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${size} ${size}`}
        width={size}
        height={size}
        aria-hidden
      >
        <circle
          className={styles.track}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={STROKE}
        />
        <circle
          className={styles.progress}
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className={styles.center}>
        <div className={styles.value}>
          {clamped}
          {valueSuffix}
        </div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  )
}
