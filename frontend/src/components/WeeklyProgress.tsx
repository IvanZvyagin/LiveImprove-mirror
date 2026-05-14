import type { WeeklyProgressItem } from '../types/habits'
import Card from './ui/Card'

type WeeklyProgressProps = {
  total: string
  items: WeeklyProgressItem[]
}

export default function WeeklyProgress({ total, items }: WeeklyProgressProps) {
  return (
    <Card as="section" className="weekly-card">
      <div className="weekly-row">
        <div className="weekly-summary">
          <div className="weekly-icon">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 3l2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L12 3z" />
            </svg>
          </div>
          <div>
            <div className="weekly-title">Общий прогресс за неделю</div>
            <div className="weekly-subtitle">{total}</div>
          </div>
        </div>
        <div className="weekly-progress">
          <div className="weekly-track">
            {items.map((day) => (
              <div className="weekly-segment" key={day.label}>
                <div
                  className="weekly-segment-fill"
                  style={{ width: `${day.value * 100}%`, background: day.color }}
                />
              </div>
            ))}
          </div>
          <div className="weekly-labels">
            {items.map((day) => (
              <span key={`${day.label}-label`}>{day.label}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
