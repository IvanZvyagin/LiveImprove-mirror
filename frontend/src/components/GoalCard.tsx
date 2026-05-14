import type { CSSProperties } from 'react'
import type { Goal } from '../types/goals'
import ProgressRing from './ProgressRing'
import Card from './ui/Card'
import IconButton from './ui/IconButton'

type GoalCardProps = {
  goal: Goal
  accentStyle: CSSProperties
  onToggleItem?: (goalId: string, itemId: string, done: boolean) => void
}

const renderGoalIcon = (icon: string, iconType: string) => {
  if (iconType === 'dollar') {
    return <span className="goal-icon-text">$</span>
  }

  if (iconType === 'dumbbell') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true" className="goal-icon-svg fill dumbbell">
        <g transform="rotate(-32 12 12)">
          <rect x="3" y="8.5" width="3.2" height="7" rx="1.2" />
          <rect x="17.8" y="8.5" width="3.2" height="7" rx="1.2" />
          <rect x="6.2" y="10.2" width="11.6" height="3.6" rx="1.8" />
          <rect x="5.2" y="9.4" width="1.4" height="5.2" rx="0.7" />
          <rect x="17.4" y="9.4" width="1.4" height="5.2" rx="0.7" />
        </g>
      </svg>
    )
  }

  return <span>{icon}</span>
}

export default function GoalCard({ goal, accentStyle, onToggleItem }: GoalCardProps) {
  const completedCount = goal.items.filter((item) => item.done).length

  return (
    <Card as="article" className="goal-card" key={goal.id} style={accentStyle}>
      <div className="goal-header">
        <div className={`goal-icon goal-icon-${goal.iconType}`}>
          {renderGoalIcon(goal.icon, goal.iconType)}
        </div>
        <div>
          <div className="goal-title">{goal.title}</div>
          <div className="goal-category">{goal.category}</div>
        </div>
        <IconButton type="button">⋯</IconButton>
      </div>

      <div className="goal-progress">
        <ProgressRing
          value={goal.progress}
          label="прогресс"
          className="goal-ring"
          accentColor="var(--accent-color)"
        />
        <div className="goal-meta">
          <div>
            <div className="meta-label">Осталось времени</div>
            <div className="meta-value">
              <span className="meta-icon">⏳</span>
              {goal.timeLeft}
            </div>
          </div>
          <div>
            <div className="meta-label">Целевой срок</div>
            <div className="meta-value">
              <span className="meta-icon">🗓</span>
              {goal.targetDate}
            </div>
          </div>
        </div>
      </div>

      <div className="goal-subtitle">
        Подцели
        <span className="goal-count">
          {completedCount} из {goal.items.length} завершено
        </span>
      </div>
      <ul className="goal-list">
        {goal.items.map((item, index) => {
          const handleToggle = () => {
            if (!item.id) return
            onToggleItem?.(goal.id, item.id, !item.done)
          }

          return (
            <li
              key={`${goal.id}-${item.id ?? item.title}-${index}`}
              className={item.done ? 'done' : ''}
              role="button"
              tabIndex={0}
              onClick={handleToggle}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  handleToggle()
                }
              }}
            >
              <span className="checkbox">{item.done ? '✓' : ''}</span>
              <span className="goal-item-title">{item.title}</span>
              <span className="goal-item-date">{item.date}</span>
            </li>
          )
        })}
      </ul>
      <div className="goal-progress-line">
        <div className="goal-progress-fill" style={{ width: `${goal.progress}%` }} />
      </div>
    </Card>
  )
}
