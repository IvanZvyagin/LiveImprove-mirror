import type { CSSProperties } from 'react'
import { FW, fwNeonFilter } from '../icons/focusWayPalette'
import { IconActionDelete, IconCategoryDumbbell, NeonWrap } from '../icons/FocusWayIcons'
import type { Goal, GoalAccent } from '../types/goals'
import ProgressRing from './ProgressRing'
import Card from './ui/Card'

/** Совпадает с `accentColors` на странице целей — неон корзины = акцент карточки */
const DELETE_NEON_BY_ACCENT: Record<GoalAccent, string> = {
  blue: '#3b82f6',
  green: '#22c55e',
  orange: '#f97316',
  purple: '#a855f7',
}

type GoalCardProps = {
  goal: Goal
  accentStyle: CSSProperties
  onToggleItem?: (goalId: string, itemId: string, done: boolean) => void
  onDelete?: (goalId: string) => void
}

const renderGoalIcon = (icon: string, iconType: string) => {
  if (iconType === 'dollar') {
    return <span className="goal-icon-text">$</span>
  }

  if (iconType === 'dumbbell') {
    return (
      <NeonWrap color={FW.amber} strength="full" size={26}>
        <IconCategoryDumbbell size={22} />
      </NeonWrap>
    )
  }

  return <span>{icon}</span>
}

export default function GoalCard({ goal, accentStyle, onToggleItem, onDelete }: GoalCardProps) {
  const completedCount = goal.items.filter((item) => item.done).length
  const deleteAccent = DELETE_NEON_BY_ACCENT[goal.accent]

  return (
    <Card as="article" className="goal-card" key={goal.id} style={accentStyle}>
      <div className="goal-header">
        <div className={`goal-icon goal-icon-${goal.iconType}`}>
          {renderGoalIcon(goal.icon, goal.iconType)}
        </div>
        <div className="goal-header-text">
          <div className="goal-title">{goal.title}</div>
          <div className="goal-category-row">
            <span className="goal-category-dot" aria-hidden />
            <span className="goal-category">{goal.category}</span>
          </div>
        </div>
        {onDelete && goal.id ? (
          <button
            type="button"
            className="goal-delete"
            aria-label="Удалить цель"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(goal.id)
            }}
          >
            <IconActionDelete
              size={21}
              style={{ color: deleteAccent, filter: fwNeonFilter(deleteAccent, 'strong') }}
            />
          </button>
        ) : null}
      </div>

      <div className="goal-progress">
        <ProgressRing
          value={goal.progress}
          label="прогресс"
          className="goal-ring"
          accentColor="var(--accent-color)"
          trackColor="#1e293b"
          size={128}
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
