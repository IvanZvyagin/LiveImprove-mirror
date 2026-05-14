import './NewGoal.css'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import GoalDatePicker from '../components/GoalDatePicker'
import { FW } from '../icons/focusWayPalette'
import {
  IconCategoryBook,
  IconCategoryFinance,
  IconCategoryHeart,
  IconSparkle,
  NeonWrap,
} from '../icons/FocusWayIcons'
import useGoals from '../hooks/useGoals'

const categoryOptions = [
  { title: 'Обучение', Icon: IconCategoryBook, color: FW.purple },
  { title: 'Финансы', Icon: IconCategoryFinance, color: FW.green },
  { title: 'Здоровье', Icon: IconCategoryHeart, color: FW.pink },
  { title: 'Личное', Icon: IconSparkle, color: FW.blue },
] as const

const DESC_MAX = 500

const mkId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `sg-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

type SubRow = { id: string; text: string; done: boolean }

const defaultTargetDate = () => {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

const TargetIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
)

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 002 2h6a2 2 0 002-2l1-12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

const DetailsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
    <path
      d="M4 6h16M4 12h10M4 18h14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

export default function NewGoal() {
  const navigate = useNavigate()
  const { addGoal, trackAction } = useGoals()
  const formId = useId()

  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string>('Обучение')
  const [targetDate, setTargetDate] = useState(defaultTargetDate)
  const [description, setDescription] = useState('')
  const [subgoals, setSubgoals] = useState<SubRow[]>(() => [{ id: mkId(), text: '', done: false }])
  const [submitting, setSubmitting] = useState(false)

  const [categoryOpen, setCategoryOpen] = useState(false)
  const categoryRef = useRef<HTMLDivElement>(null)

  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const closeModal = useCallback(() => navigate('/goals'), [navigate])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (pendingDeleteId) setPendingDeleteId(null)
      else closeModal()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal, pendingDeleteId])

  useEffect(() => {
    if (!categoryOpen) return
    const onDoc = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) setCategoryOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [categoryOpen])

  const selectedCat = categoryOptions.find((c) => c.title === category) ?? categoryOptions[0]
  const SelectedCatIcon = selectedCat.Icon

  const addSubgoal = () => {
    setSubgoals((rows) => [...rows, { id: mkId(), text: '', done: false }])
  }

  const updateSubText = (id: string, text: string) => {
    setSubgoals((rows) => rows.map((r) => (r.id === id ? { ...r, text } : r)))
  }

  const toggleSubDone = (id: string) => {
    setSubgoals((rows) => rows.map((r) => (r.id === id ? { ...r, done: !r.done } : r)))
  }

  const requestDeleteSub = (id: string) => setPendingDeleteId(id)

  const confirmDeleteSub = () => {
    if (!pendingDeleteId) return
    setSubgoals((rows) => rows.filter((r) => r.id !== pendingDeleteId))
    setPendingDeleteId(null)
  }

  const onDescChange = (v: string) => {
    if (v.length <= DESC_MAX) setDescription(v)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const subGoalTitles = subgoals.map((s) => s.text.trim()).filter(Boolean)
      await addGoal({
        title: title.trim() || 'Новая цель',
        category,
        targetDate,
        description: description.trim() || undefined,
        subGoalTitles,
      })
      await trackAction('goals.created', title.trim() || 'Новая цель')
      navigate('/goals')
    } finally {
      setSubmitting(false)
    }
  }

  return createPortal(
    <div className="ngo-overlay" role="presentation">
      <button type="button" className="ngo-backdrop" aria-label="Закрыть" onClick={closeModal} />
      <div
        className="ngo-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        aria-describedby={`${formId}-desc`}
      >
        <button type="button" className="ngo-close" onClick={closeModal} aria-label="Закрыть">
          ×
        </button>

        <header className="ngo-header">
          <h1 id={`${formId}-title`} className="ngo-title">
            Создание новой цели
          </h1>
          <p id={`${formId}-desc`} className="ngo-subtitle">
            Определите свою цель и шаги для её достижения
          </p>
        </header>

        <form className="ngo-form" onSubmit={handleSubmit}>
          <div className="ngo-field">
            <label className="ngo-label" htmlFor={`${formId}-title-input`}>
              Название
            </label>
            <div className="ngo-input-shell">
              <span className="ngo-input-icon ngo-input-icon--accent">
                <TargetIcon />
              </span>
              <input
                id={`${formId}-title-input`}
                className="ngo-input"
                required
                autoComplete="off"
                placeholder="Выучить Kubernetes"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
          </div>

          <div className="ngo-row2">
            <div className="ngo-field">
              <label className="ngo-label" htmlFor="goal-deadline-trigger">
                Конечная дата
              </label>
              <GoalDatePicker value={targetDate} onChange={setTargetDate} triggerId="goal-deadline-trigger" required />
            </div>
            <div className="ngo-field" ref={categoryRef}>
              <span className="ngo-label" id={`${formId}-cat-label`}>
                Категория
              </span>
              <button
                type="button"
                className="ngo-select-trigger"
                aria-labelledby={`${formId}-cat-label`}
                aria-expanded={categoryOpen}
                aria-haspopup="listbox"
                onClick={() => setCategoryOpen((o) => !o)}
              >
                <span className="ngo-select-ico" aria-hidden>
                  <NeonWrap color={selectedCat.color} strength="full" size={28}>
                    <SelectedCatIcon size={24} />
                  </NeonWrap>
                </span>
                <span className="ngo-select-text">{category}</span>
                <span className={`ngo-chevron${categoryOpen ? ' ngo-chevron--up' : ''}`} aria-hidden>
                  ▾
                </span>
              </button>
              {categoryOpen ? (
                <ul className="ngo-select-list" role="listbox">
                  {categoryOptions.map((opt) => {
                    const OptIco = opt.Icon
                    return (
                      <li key={opt.title} role="option" aria-selected={category === opt.title}>
                        <button
                          type="button"
                          className={`ngo-select-option${category === opt.title ? ' selected' : ''}`}
                          onClick={() => {
                            setCategory(opt.title)
                            setCategoryOpen(false)
                          }}
                        >
                          <span className="ngo-select-opt-ico">
                            <NeonWrap color={opt.color} strength="full" size={30}>
                              <OptIco size={26} />
                            </NeonWrap>
                          </span>
                          {opt.title}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              ) : null}
            </div>
          </div>

          <div className="ngo-field">
            <label className="ngo-label" htmlFor={`${formId}-details`}>
              Детали
            </label>
            <div className="ngo-textarea-shell">
              <span className="ngo-textarea-icon" aria-hidden>
                <DetailsIcon />
              </span>
              <textarea
                id={`${formId}-details`}
                className="ngo-textarea"
                placeholder="Опишите, чего вы хотите достичь и почему это важно..."
                value={description}
                onChange={(e) => onDescChange(e.target.value)}
                rows={5}
                maxLength={DESC_MAX}
              />
              <span className="ngo-counter">
                {description.length}/{DESC_MAX}
              </span>
            </div>
          </div>

          <div className="ngo-subsection">
            <div className="ngo-sub-head">
              <span className="ngo-sub-title">Подцели</span>
              <button
                type="button"
                className="ngo-add-round"
                onClick={addSubgoal}
                aria-label="Добавить подцель"
              >
                +
              </button>
            </div>
            <ul className="ngo-sub-list">
              {subgoals.map((row) => (
                <li key={row.id} className="ngo-sub-item">
                  <span className="ngo-drag" aria-hidden title="Перетаскивание скоро">
                    ⋮⋮
                  </span>
                  <button
                    type="button"
                    className={`ngo-sub-check${row.done ? ' done' : ''}`}
                    onClick={() => toggleSubDone(row.id)}
                    aria-pressed={row.done}
                    aria-label={row.done ? 'Отметить невыполненной' : 'Отметить выполненной'}
                  >
                    {row.done ? '✓' : ''}
                  </button>
                  <input
                    className="ngo-sub-input"
                    type="text"
                    placeholder="Название подцели"
                    value={row.text}
                    onChange={(e) => updateSubText(row.id, e.target.value)}
                    aria-label="Текст подцели"
                  />
                  <button
                    type="button"
                    className="ngo-trash"
                    onClick={() => requestDeleteSub(row.id)}
                    aria-label="Удалить подцель"
                  >
                    <TrashIcon />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <footer className="ngo-footer">
            <button type="button" className="ngo-btn ngo-btn--secondary" onClick={closeModal}>
              Отмена
            </button>
            <button type="submit" className="ngo-btn ngo-btn--primary" disabled={submitting}>
              <span className="ngo-btn-ico" aria-hidden>
                <TargetIcon />
              </span>
              {submitting ? 'Создаём…' : 'Создать цель'}
            </button>
          </footer>
        </form>
      </div>

      {pendingDeleteId ? (
        <div
          className="ngo-confirm-overlay"
          role="presentation"
          onClick={() => setPendingDeleteId(null)}
        >
          <div
            className="ngo-confirm"
            role="alertdialog"
            aria-labelledby={`${formId}-cd-title`}
            onClick={(e) => e.stopPropagation()}
          >
            <p id={`${formId}-cd-title`} className="ngo-confirm-title">
              Удалить подцель?
            </p>
            <p className="ngo-confirm-text">Точно хотите удалить эту подцель? Это действие нельзя отменить.</p>
            <div className="ngo-confirm-actions">
              <button type="button" className="ngo-btn ngo-btn--secondary" onClick={() => setPendingDeleteId(null)}>
                Нет
              </button>
              <button type="button" className="ngo-btn ngo-btn--danger" onClick={confirmDeleteSub}>
                Да, удалить
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  )
}
