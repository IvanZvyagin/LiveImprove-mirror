import './Habits.module.css'
import type { CSSProperties } from 'react'
import { useState } from 'react'
import ProgressRing from '../components/ProgressRing'
import WeeklyProgress from '../components/WeeklyProgress'
import NewHabitModal from '../components/NewHabitModal'
import Card from '../components/ui/Card'
import FabAddButton from '../components/ui/FabAddButton'
import useHabits from '../hooks/useHabits'
import { fwNeonFilter } from '../icons/focusWayPalette'
import { IconActionDelete } from '../icons/FocusWayIcons'
import { HabitCardHeaderGlyph } from '../icons/habitGlyphs'
import type { HabitAccent, HabitCategory } from '../types/habits'

const accentColors = {
  green: {
    color: '#2ee58a',
    glow: 'rgba(46, 229, 138, 0.25)',
    soft: 'rgba(46, 229, 138, 0.2)',
    iconBg: '#22c55e',
  },
  blue: {
    color: '#4f8cff',
    glow: 'rgba(79, 140, 255, 0.24)',
    soft: 'rgba(79, 140, 255, 0.2)',
    iconBg: '#3b82f6',
  },
  purple: {
    color: '#c084fc',
    glow: 'rgba(192, 132, 252, 0.28)',
    soft: 'rgba(192, 132, 252, 0.22)',
    iconBg: '#a855f7',
  },
} as const

/** Неон корзины в шапке карточки — как на странице целей */
const DELETE_NEON_BY_HABIT_ACCENT: Record<HabitAccent, string> = {
  green: '#2ee58a',
  blue: '#4f8cff',
  purple: '#c084fc',
}

export default function Habits() {
  const { data: habits, toggleHabit, addHabit, deleteHabitsByIds, trackAction } = useHabits()
  const [habitModalOpen, setHabitModalOpen] = useState(false)
  const [modalDefaultCategoryId, setModalDefaultCategoryId] = useState('health')

  const openHabitModal = (categoryId?: string) => {
    const id = categoryId ?? habits.categories[0]?.id ?? 'health'
    setModalDefaultCategoryId(id)
    setHabitModalOpen(true)
  }

  const confirmDeleteCategoryHabits = async (category: HabitCategory) => {
    const ids = category.habits.map((h) => h.id).filter((id): id is string => Boolean(id))
    if (ids.length === 0) {
      return
    }
    if (
      !window.confirm(`Удалить все привычки в разделе «${category.title}»? Это действие нельзя отменить.`)
    ) {
      return
    }
    try {
      await deleteHabitsByIds(ids)
      void trackAction('habits.category_cleared', category.id)
    } catch {
      window.alert('Не удалось удалить привычки. Проверьте соединение с сервером.')
    }
  }

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
          <FabAddButton ariaLabel="Добавить привычку" onClick={() => openHabitModal()} />
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
                <div className="habit-icon">
                  <HabitCardHeaderGlyph icon={category.icon} />
                </div>
                <div className="habit-header-text">
                  <div className="habit-title">{category.title}</div>
                  <div className="habit-count">{category.count} привычки</div>
                </div>
                {category.habits.some((h) => h.id) ? (
                  <button
                    type="button"
                    className="goal-delete"
                    aria-label={`Удалить все привычки в разделе «${category.title}»`}
                    onClick={(e) => {
                      e.stopPropagation()
                      void confirmDeleteCategoryHabits(category)
                    }}
                  >
                    <IconActionDelete
                      size={21}
                      style={{
                        color: DELETE_NEON_BY_HABIT_ACCENT[category.accent],
                        filter: fwNeonFilter(DELETE_NEON_BY_HABIT_ACCENT[category.accent], 'strong'),
                      }}
                    />
                  </button>
                ) : null}
              </div>

              <div className="habit-ring">
                <ProgressRing
                  value={category.progress}
                  label="на сегодня"
                  accentColor="var(--accent-color)"
                  trackColor="#1e293b"
                  size={160}
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
                    <div>
                      <div className="habit-item-title">{habit.title}</div>
                      <div className="habit-item-subtitle">{habit.subtitle}</div>
                    </div>
                    <span className="habit-time">{habit.time}</span>
                  </li>
                ))}
              </ul>
            </Card>
          )
        })}
      </section>

      <WeeklyProgress total={habits.weeklyTotal} items={habits.weeklyProgress} />

      <NewHabitModal
        open={habitModalOpen}
        onClose={() => setHabitModalOpen(false)}
        categories={habits.categories}
        defaultCategoryId={modalDefaultCategoryId}
        onSubmit={async (payload) => {
          await addHabit(payload)
          setHabitModalOpen(false)
          void trackAction('habits.created', payload.category)
        }}
      />
    </div>
  )
}
