import './Habits.module.css'
import type { CSSProperties } from 'react'
import ProgressRing from '../components/ProgressRing'
import WeeklyProgress from '../components/WeeklyProgress'
import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import IconButton from '../components/ui/IconButton'
import useHabits from '../hooks/useHabits'

const accentColors = {
  green: {
    color: '#2ee58a',
    glow: 'rgba(46, 229, 138, 0.25)',
    soft: 'rgba(46, 229, 138, 0.2)',
    iconBg: 'linear-gradient(135deg, #14532d, #22c55e)',
  },
  blue: {
    color: '#4f8cff',
    glow: 'rgba(79, 140, 255, 0.24)',
    soft: 'rgba(79, 140, 255, 0.2)',
    iconBg: 'linear-gradient(135deg, #1e3a8a, #60a5fa)',
  },
  purple: {
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.24)',
    soft: 'rgba(168, 85, 247, 0.2)',
    iconBg: 'linear-gradient(135deg, #4c1d95, #a855f7)',
  },
} as const

const renderCategoryIcon = (icon: string) => {
  if (icon === 'heart') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 20.5s-6.5-4.3-8.5-8.2C1.8 9 3.6 6.3 6.3 6.1c1.6-.1 3.1.7 4 2 0.9-1.3 2.4-2.1 4-2 2.7.2 4.5 2.9 2.8 6.2-2 3.9-8.5 8.2-8.5 8.2z" />
      </svg>
    )
  }

  if (icon === 'book') {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 6.5c0-1 0.8-1.8 1.8-1.8H20v14.6H5.8C4.8 19.3 4 18.5 4 17.5v-11z" />
        <path d="M7 7h10" />
        <path d="M7 10h8" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 7l5 5-5 5" />
      <path d="M13 7h5v10h-5" />
    </svg>
  )
}

export default function Habits() {
  const { data: habits, toggleHabit, addHabit, trackAction } = useHabits()

  return (
    <div className="page habits-page">
      <header className="page-topbar">
        <div className="page-title">
          <h2>Привычки</h2>
          <div className="tab-row">
            {habits.tabs.map((tab, index) => (
              <button
                className={`tab${index === 0 ? ' active' : ''}`}
                key={tab}
                type="button"
                onClick={() => trackAction('habits.tab', tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="page-actions">
          <Chip type="button" onClick={() => trackAction('habits.today')}>
            Сегодня
          </Chip>
          <button className="button" type="button" onClick={addHabit}>
            + Добавить привычку
          </button>
        </div>
      </header>

      <section className="habit-cards">
        {habits.categories.map((category) => {
          const accentStyle = {
            '--accent-color': accentColors[category.accent].color,
            '--accent-glow': accentColors[category.accent].glow,
            '--accent-soft': accentColors[category.accent].soft,
            '--icon-bg': accentColors[category.accent].iconBg,
          } as CSSProperties

          return (
            <Card as="article" className="habit-card large" key={category.id} style={accentStyle}>
              <div className="habit-card-header">
                <div className="habit-icon">{renderCategoryIcon(category.icon)}</div>
                <div>
                  <div className="habit-title">{category.title}</div>
                  <div className="habit-count">{category.count} привычки</div>
                </div>
                <IconButton type="button">⋯</IconButton>
              </div>

              <div className="habit-ring">
                <ProgressRing
                  value={category.progress}
                  label="на сегодня"
                  accentColor="var(--accent-color)"
                  className="habit-ring__ring"
                />
              </div>

              <ul className="habit-list">
                {category.habits.map((habit) => (
                  <li
                    key={habit.id ?? habit.title}
                    className={habit.done ? 'done' : ''}
                    role="button"
                    tabIndex={0}
                    onClick={() => habit.id && toggleHabit(habit.id, !habit.done)}
                    onKeyDown={(event) => {
                      if ((event.key === 'Enter' || event.key === ' ') && habit.id) {
                        event.preventDefault()
                        toggleHabit(habit.id, !habit.done)
                      }
                    }}
                  >
                    <span className="checkbox">{habit.done ? '✓' : ''}</span>
                    <span className="habit-item-icon">{habit.icon}</span>
                    <div>
                      <div className="habit-item-title">{habit.title}</div>
                      <div className="habit-item-subtitle">{habit.subtitle}</div>
                    </div>
                    <span className="habit-time">{habit.time}</span>
                  </li>
                ))}
              </ul>

              <button className="link-button" type="button" onClick={addHabit}>
                + Добавить привычку
              </button>
            </Card>
          )
        })}
      </section>

      <WeeklyProgress total={habits.weeklyTotal} items={habits.weeklyProgress} />
    </div>
  )
}
