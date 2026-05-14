import './Goals.module.css'
import type { CSSProperties } from 'react'
import CompletedGoalRow from '../components/CompletedGoalRow'
import GoalCard from '../components/GoalCard'
import StatCard, { type StatIcon } from '../components/StatCard'
import Chip from '../components/ui/Chip'
import IconButton from '../components/ui/IconButton'
import SectionHeader from '../components/ui/SectionHeader'
import Card from '../components/ui/Card'
import useGoals from '../hooks/useGoals'

const accentColors = {
  blue: {
    color: '#4f8cff',
    glow: 'rgba(79, 140, 255, 0.25)',
    soft: 'rgba(79, 140, 255, 0.2)',
  },
  green: {
    color: '#2ee58a',
    glow: 'rgba(46, 229, 138, 0.22)',
    soft: 'rgba(46, 229, 138, 0.2)',
  },
  orange: {
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.25)',
    soft: 'rgba(245, 158, 11, 0.2)',
  },
  purple: {
    color: '#8b5cf6',
    glow: 'rgba(139, 92, 246, 0.25)',
    soft: 'rgba(139, 92, 246, 0.2)',
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

export default function Goals() {
  const { data: goals, addGoal, toggleItem, trackAction } = useGoals()
  const statsChart = buildSparkline(goals.stats.trend, 220, 70)
  const statsMetrics: Array<{
    label: string
    value: string | number
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
          <div className="user-chip">
            <span className="user-avatar">А</span>
            <span>Алексей</span>
            <span className="chevron">▾</span>
          </div>
          <button className="button" type="button" onClick={addGoal}>
            + Новая цель
          </button>
        </div>
      </header>

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
    </div>
  )
}
