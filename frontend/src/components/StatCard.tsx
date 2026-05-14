import type { CSSProperties } from 'react'

export type StatIcon = 'target' | 'check' | 'bolt'

type StatCardProps = {
  label: string
  value: string | number
  iconType: StatIcon
  color: string
  soft: string
}

const renderStatsIcon = (type: StatIcon) => {
  if (type === 'target') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="3.5" />
        <path d="M18.5 5.5L12 12" />
      </svg>
    )
  }

  if (type === 'check') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M8.5 12.5l2.5 2.5 4.5-5" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M13.5 2L6 13h6l-1.5 9L18 11h-6l1.5-9z" />
    </svg>
  )
}

export default function StatCard({ label, value, iconType, color, soft }: StatCardProps) {
  return (
    <div
      className="stats-item"
      style={
        {
          '--stat-color': color,
          '--stat-bg': soft,
        } as CSSProperties
      }
    >
      <span className="stats-icon">{renderStatsIcon(iconType)}</span>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  )
}
