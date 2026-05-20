import type { CSSProperties } from 'react'
import { FW } from '../icons/focusWayPalette'
import { IconActionCheck, IconActionDelete, IconCategoryDumbbell, NeonWrap } from '../icons/FocusWayIcons'
import type { Goal, GoalAccent } from '../types/goals'
import ProgressRing from './ProgressRing'
import Card from './ui/Card'

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
  onComplete?: (goalId: string) => void
  onPause?: (goalId: string) => void
  onResume?: (goalId: string) => void
}

const renderGoalIcon = (icon: string, iconType: string) => {
  if (iconType === 'dollar') return <span className="goal-icon-text">$</span>
  if (iconType === 'dumbbell') {
    return (
      <NeonWrap color={FW.amber} strength="full" size={26}>
        <IconCategoryDumbbell size={22} />
      </NeonWrap>
    )
  }
  return <span>{icon}</span>
}

function PauseIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
      <rect x="14" y="5" width="4" height="14" rx="1.5" fill="currentColor" />
    </svg>
  )
}

function ResumeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 4.5l14 7.5-14 7.5V4.5Z" fill="currentColor" />
    </svg>
  )
}

export default function GoalCard({
  goal,
  accentStyle,
  onToggleItem,
  onDelete,
  onComplete,
  onPause,
  onResume,
}: GoalCardProps) {
  const completedCount = goal.items.filter((item) => item.done).length
  const deleteAccent = DELETE_NEON_BY_ACCENT[goal.accent]

  const isActive = goal.status === 'ACTIVE'
  const isPaused = goal.status === 'PAUSED'
  const isCompleted = goal.status === 'COMPLETED'
  const hasSubgoals = goal.items.length > 0

  return (
    <Card as="article" className={`goal-card${isPaused ? ' goal-card--paused' : ''}`} key={goal.id} style={accentStyle}>

      {/* Бейджи статуса — вне body, чтобы не приглушались при паузе */}
      {isPaused ? (
        <span className="goal-badge goal-badge--paused goal-badge--floating">⏸ На паузе</span>
      ) : null}
      {isCompleted ? (
        <span className="goal-badge goal-badge--completed goal-badge--floating">
          <IconActionCheck size={12} aria-hidden /> Выполнено
        </span>
      ) : null}

      {/* ── Контент: приглушается при паузе ── */}
      <div className="goal-card-body">

        {/* Заголовок: иконка + текст */}
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
        </div>

        {/* Прогресс */}
        <div className="goal-progress">
          <ProgressRing
            value={goal.progress}
            label="прогресс"
            className="goal-ring"
            accentColor={isPaused ? '#64748b' : 'var(--accent-color)'}
            trackColor="#1e293b"
            size={128}
          />
          <div className="goal-meta">
            <div>
              <div className="meta-label">Осталось времени</div>
              <div className="meta-value">
                <span className="meta-icon">{isPaused ? '⏸' : '⏳'}</span>
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

        {/* Подцели */}
        {hasSubgoals ? (
          <>
            <div className="goal-subtitle">
              Подцели
              <span className="goal-count">{completedCount} из {goal.items.length} завершено</span>
            </div>
            <ul className="goal-list">
              {goal.items.map((item, index) => {
                const handleToggle = () => {
                  if (!item.id || isPaused) return
                  onToggleItem?.(goal.id, item.id, !item.done)
                }
                return (
                  <li
                    key={`${goal.id}-${item.id ?? item.title}-${index}`}
                    className={item.done ? 'done' : ''}
                    role="button"
                    tabIndex={0}
                    onClick={handleToggle}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleToggle() }
                    }}
                  >
                    <span className="checkbox">{item.done ? '✓' : ''}</span>
                    <span className="goal-item-title">{item.title}</span>
                    <span className="goal-item-date">{item.date}</span>
                  </li>
                )
              })}
            </ul>
          </>
        ) : isActive ? (
          <p className="goal-no-subgoals">
            Подцелей нет — отметьте цель как выполненную, когда закончите
          </p>
        ) : null}

        {/* Прогресс-бар */}
        <div className="goal-progress-line">
          <div className="goal-progress-fill" style={{ width: `${goal.progress}%` }} />
        </div>

      </div>{/* /goal-card-body */}

      {/* ── Кнопки действий — всегда яркие ── */}
      <div className="goal-actions">
        {/* ACTIVE без подцелей → Завершить */}
        {isActive && !hasSubgoals && onComplete ? (
          <button
            type="button"
            className="goal-action-btn goal-action-btn--complete"
            onClick={() => onComplete(goal.id)}
          >
            <IconActionCheck size={14} aria-hidden />
            Завершить
          </button>
        ) : null}

        {/* ACTIVE → Пауза */}
        {isActive && onPause ? (
          <button
            type="button"
            className="goal-action-btn goal-action-btn--pause"
            onClick={() => onPause(goal.id)}
          >
            <PauseIcon />
            Пауза
          </button>
        ) : null}

        {/* PAUSED → Возобновить */}
        {isPaused && onResume ? (
          <button
            type="button"
            className="goal-action-btn goal-action-btn--resume"
            onClick={() => onResume(goal.id)}
          >
            <ResumeIcon />
            Возобновить
          </button>
        ) : null}

        {/* Всегда → Удалить */}
        {onDelete ? (
          <button
            type="button"
            className="goal-action-btn goal-action-btn--delete"
            style={{ color: deleteAccent }}
            onClick={() => onDelete(goal.id)}
          >
            <IconActionDelete size={14} aria-hidden />
            Удалить
          </button>
        ) : null}
      </div>

    </Card>
  )
}
