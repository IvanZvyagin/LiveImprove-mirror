import './Goals.module.css'
import type { CSSProperties } from 'react'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../components/ConfirmDialog'
import CompletedGoalRow from '../components/CompletedGoalRow'
import EmptyState from '../components/EmptyState/EmptyState'
import GoalTargetIcon from '../components/EmptyState/icons/GoalTargetIcon'
import GoalCard from '../components/GoalCard'
import StatCard, { type StatIcon } from '../components/StatCard'
import Chip from '../components/ui/Chip'
import FabAddButton from '../components/ui/FabAddButton'
import IconButton from '../components/ui/IconButton'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import useGoals from '../hooks/useGoals'

type DialogState = {
  open: boolean
  title: string
  description: string
  confirmText: string
  variant: 'default' | 'danger'
  onConfirm: () => Promise<void>
}

const accentColors = {
  blue: {
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.28)',
    soft: 'rgba(59, 130, 246, 0.2)',
  },
  green: {
    color: '#22c55e',
    glow: 'rgba(34, 197, 94, 0.28)',
    soft: 'rgba(34, 197, 94, 0.2)',
  },
  orange: {
    color: '#f97316',
    glow: 'rgba(249, 115, 22, 0.28)',
    soft: 'rgba(249, 115, 22, 0.2)',
  },
  purple: {
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.28)',
    soft: 'rgba(168, 85, 247, 0.2)',
  },
} as const

const buildSparkline = (values: readonly number[], width: number, height: number) => {
  const resolvedValues =
    values.length >= 2 ? values : [values[0] ?? 0, values[0] ?? 0]
  const padding = 6
  const max = Math.max(...resolvedValues)
  const min = Math.min(...resolvedValues)
  const range = max - min || 1
  const step = (width - padding * 2) / (resolvedValues.length - 1)

  const points = resolvedValues.map((value, index) => {
    const x = padding + index * step
    const y = height - padding - ((value - min) / range) * (height - padding * 2)
    return { x, y }
  })

  const smoothPath = points.reduce((path, point, index, array) => {
    if (index === 0) {
      return `M ${point.x} ${point.y}`
    }

    const prev = array[index - 1]
    const next = array[index + 1] ?? point
    const prevPrev = array[index - 2] ?? prev

    const cp1x = prev.x + (point.x - prevPrev.x) / 6
    const cp1y = prev.y + (point.y - prevPrev.y) / 6
    const cp2x = point.x - (next.x - prev.x) / 6
    const cp2y = point.y - (next.y - prev.y) / 6

    return `${path} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`
  }, '')

  return { width, height, points, smoothPath }
}

const DIALOG_CLOSED: DialogState = {
  open: false,
  title: '',
  description: '',
  confirmText: 'Подтвердить',
  variant: 'default',
  onConfirm: async () => {},
}

export default function Goals() {
  const navigate = useNavigate()
  const { data: goals, toggleItem, removeGoal, finishGoal, pauseGoalById, resumeGoalById, trackAction } = useGoals()

  const [dialog, setDialog] = useState<DialogState>(DIALOG_CLOSED)
  const closeDialog = useCallback(() => setDialog(DIALOG_CLOSED), [])

  const handleDialogConfirm = useCallback(async () => {
    closeDialog()
    await dialog.onConfirm()
  }, [dialog, closeDialog])

  const handleDeleteGoal = useCallback((goalId: string) => {
    setDialog({
      open: true,
      title: 'Удалить цель?',
      description: 'Это действие нельзя отменить. Все подцели будут удалены.',
      confirmText: 'Удалить',
      variant: 'danger',
      onConfirm: async () => {
        await removeGoal(goalId)
        await trackAction('goals.deleted', goalId)
      },
    })
  }, [removeGoal, trackAction])

  const handleCompleteGoal = useCallback((goalId: string) => {
    setDialog({
      open: true,
      title: 'Завершить цель?',
      description: 'Цель будет помечена как выполненная.',
      confirmText: 'Завершить',
      variant: 'default',
      onConfirm: async () => {
        await finishGoal(goalId)
        await trackAction('goals.completed', goalId)
      },
    })
  }, [finishGoal, trackAction])

  const handlePauseGoal = useCallback(async (goalId: string) => {
    await pauseGoalById(goalId)
    await trackAction('goals.paused', goalId)
  }, [pauseGoalById, trackAction])

  const handleResumeGoal = useCallback(async (goalId: string) => {
    await resumeGoalById(goalId)
    await trackAction('goals.resumed', goalId)
  }, [resumeGoalById, trackAction])
  const statsChart = buildSparkline(goals.stats.trend, 220, 70)
  const isEmpty = goals.goals.length === 0 && goals.completed.length === 0

  const statsMetrics: Array<{
    label: string
    value: number | string
    iconType: StatIcon
    color: string
    soft: string
  }> = [
    {
      label: 'Активных целей',
      value: goals.stats.active,
      iconType: 'target',
      color: '#34d399',
      soft: 'rgba(52, 211, 153, 0.18)',
    },
    {
      label: 'Завершено целей',
      value: goals.stats.completed,
      iconType: 'check',
      color: '#a855f7',
      soft: 'rgba(168, 85, 247, 0.2)',
    },
    {
      label: 'Общий прогресс',
      value: `${goals.stats.averageProgress}%`,
      iconType: 'bolt',
      color: '#f59e0b',
      soft: 'rgba(245, 158, 11, 0.2)',
    },
  ]

  return (
    <div className="page goals-page">
      <header className="page-topbar">
        <div className="page-title">
          <h2>Цели</h2>
          <div className="tab-row">
            {goals.tabs.map((tab, index) => (
              <button
                className={`tab${index === 0 ? ' active' : ''}`}
                key={tab}
                type="button"
                onClick={() => trackAction('goals.tab', tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="page-actions">
          <div className="search-field">
            <span className="search-icon">🔍</span>
            <input type="text" placeholder="Поиск целей..." />
          </div>
          <IconButton type="button" badge="3" onClick={() => trackAction('goals.notifications')}>
            🔔
          </IconButton>
          <FabAddButton ariaLabel="Новая цель" onClick={() => navigate('/goals/new')} />
        </div>
      </header>

      {isEmpty ? (
        <EmptyState
          icon={<GoalTargetIcon size={320} />}
          title="Время ставить новые цели"
          description={
            <>
              Ваш путь к успеху начинается с первого шага. Создайте свою
              первую цель, чтобы начать отслеживать прогресс.
            </>
          }
          actionLabel="Создать первую цель"
          onAction={() => navigate('/goals/new')}
        />
      ) : (
        <>
          <div className="goals-toolbar">
            <div className="view-toggle">
              <Chip active type="button" onClick={() => trackAction('goals.view', 'cards')}>
                Карточки
              </Chip>
              <Chip type="button" onClick={() => trackAction('goals.view', 'list')}>
                Список
              </Chip>
            </div>
          </div>

          <section className="goals-grid">
            {goals.goals.map((goal) => {
              const accentStyle = {
                '--accent-color': accentColors[goal.accent].color,
                '--accent-glow': accentColors[goal.accent].glow,
                '--accent-soft': accentColors[goal.accent].soft,
              } as CSSProperties

              return (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  accentStyle={accentStyle}
                  onToggleItem={(_, itemId, done) => toggleItem(itemId, done)}
                  onDelete={handleDeleteGoal}
                  onComplete={handleCompleteGoal}
                  onPause={handlePauseGoal}
                  onResume={handleResumeGoal}
                />
              )
            })}
          </section>

          <section className="goals-bottom">
            <div className="completed-section">
              <div className="section-title">
                Завершенные цели <span>{goals.completed.length}</span>
              </div>
              <div className="completed-list">
                {goals.completed.map((goal) => {
                  const accentStyle = {
                    '--accent-color': accentColors[goal.accent].color,
                    '--accent-glow': accentColors[goal.accent].glow,
                    '--accent-soft': accentColors[goal.accent].soft,
                  } as CSSProperties

                  return <CompletedGoalRow key={goal.id} goal={goal} accentStyle={accentStyle} />
                })}
              </div>
            </div>

            <Card className="stats-card">
              <SectionHeader
                title="Общая статистика"
                actions={
                  <Chip type="button" active>
                    {goals.stats.period}
                  </Chip>
                }
              />
              <div className="stats-metrics">
                {statsMetrics.map((metric) => (
                  <StatCard
                    key={metric.label}
                    label={metric.label}
                    value={metric.value}
                    iconType={metric.iconType}
                    color={metric.color}
                    soft={metric.soft}
                  />
                ))}
              </div>
              <div className="stats-chart">
                <svg viewBox={`0 0 ${statsChart.width} ${statsChart.height}`} role="presentation">
                  <defs>
                    <linearGradient id="statsLineGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                    <filter id="statsGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  <path className="stats-line" d={statsChart.smoothPath} stroke="url(#statsLineGradient)" />
                  <path
                    className="stats-line glow"
                    d={statsChart.smoothPath}
                    stroke="url(#statsLineGradient)"
                    filter="url(#statsGlow)"
                  />
                </svg>
              </div>
            </Card>
          </section>
        </>
      )}

      <ConfirmDialog
        open={dialog.open}
        title={dialog.title}
        description={dialog.description}
        confirmText={dialog.confirmText}
        variant={dialog.variant}
        onConfirm={handleDialogConfirm}
        onCancel={closeDialog}
      />
    </div>
  )
}
