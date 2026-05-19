import './NewHabitModal.css'
import type { FormEvent } from 'react'
import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { CreateHabitPayload } from '../api/habits'
import { FW } from '../icons/focusWayPalette'
import {
  IconActionBell,
  IconCategoryBook,
  IconCategoryCode,
  IconCategoryHeart,
  IconClock,
  IconGrid2x2,
  IconSidebarCalendar,
  NeonWrap,
} from '../icons/FocusWayIcons'
import type { HabitCategory } from '../types/habits'
import HabitTimePicker from './HabitTimePicker'

export const HABIT_CATEGORY_OPTIONS = [
  { id: 'health', label: 'Здоровье', Icon: IconCategoryHeart, color: FW.pink },
  { id: 'learning', label: 'Обучение', Icon: IconCategoryBook, color: FW.purple },
  { id: 'code', label: 'Код', Icon: IconCategoryCode, color: FW.purple },
] as const

type HabitCategoryKey = (typeof HABIT_CATEGORY_OPTIONS)[number]['id']

type Props = {
  open: boolean
  onClose: () => void
  categories: HabitCategory[]
  defaultCategoryId: string
  onSubmit: (payload: CreateHabitPayload) => Promise<void>
}

function categoryChoicesFromApi(categories: HabitCategory[]) {
  const ids = new Set(categories.map((c) => c.id))
  const merged = HABIT_CATEGORY_OPTIONS.filter((o) => ids.has(o.id))
  return merged.length > 0 ? [...merged] : [...HABIT_CATEGORY_OPTIONS]
}

export default function NewHabitModal({ open, onClose, categories, defaultCategoryId, onSubmit }: Props) {
  const titleId = useId()
  const [title, setTitle] = useState('')
  const [frequency, setFrequency] = useState<'daily' | 'weekly'>('daily')
  const [reminderTime, setReminderTime] = useState('07:00')
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [categoryId, setCategoryId] = useState<HabitCategoryKey>(
    () => (HABIT_CATEGORY_OPTIONS.some((o) => o.id === defaultCategoryId) ? defaultCategoryId : 'health') as HabitCategoryKey,
  )
  const [submitting, setSubmitting] = useState(false)
  const [timePanelOpen, setTimePanelOpen] = useState(false)
  const [timeOpenSeq, setTimeOpenSeq] = useState(0)
  const [catOpen, setCatOpen] = useState(false)
  const catRef = useRef<HTMLDivElement>(null)

  const choices = categoryChoicesFromApi(categories)
  const selectedCat = choices.find((c) => c.id === categoryId) ?? choices[0]

  useEffect(() => {
    if (!open) return
    setTitle('')
    setFrequency('daily')
    setReminderTime('07:00')
    setReminderEnabled(true)
    setTimePanelOpen(false)
    setCatOpen(false)
    const ch = categoryChoicesFromApi(categories)
    const allowed = new Set<string>(ch.map((c) => c.id))
    const nextId = (allowed.has(defaultCategoryId) ? defaultCategoryId : ch[0]?.id ?? 'health') as HabitCategoryKey
    setCategoryId(nextId)
    setTimeOpenSeq((s) => s + 1)
  }, [open, defaultCategoryId, categories])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  useEffect(() => {
    if (!catOpen) return
    const onDoc = (e: MouseEvent) => {
      if (!catRef.current?.contains(e.target as Node)) setCatOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [catOpen])

  const toggleTimePanel = useCallback(() => {
    setTimePanelOpen((v) => {
      if (!v) setTimeOpenSeq((s) => s + 1)
      return !v
    })
  }, [])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setSubmitting(true)
    try {
      await onSubmit({
        title: trimmed,
        category: categoryId,
        frequency,
        reminderTime,
        reminderEnabled,
        description: frequency === 'weekly' ? 'Еженедельно' : 'Ежедневно',
        iconValue: `fw:${categoryId}`,
      })
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  const CategoryIcon = selectedCat.Icon

  const modal = (
    <>
      <button type="button" className="nhm-backdrop" aria-label="Закрыть" onClick={onClose} />
      <div className="nhm-overlay">
        <div
          className="nhm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(ev) => ev.stopPropagation()}
        >
          <button type="button" className="nhm-close" aria-label="Закрыть окно" onClick={onClose}>
            ×
          </button>
          <h2 className="nhm-title" id={titleId}>
            Создание привычки
          </h2>

          <form className="nhm-form" onSubmit={handleSubmit}>
            <div>
              <div className="nhm-field-label">Название привычки</div>
              <div className="nhm-title-row">
                <div className="nhm-heart-box">
                  <NeonWrap color={FW.pink} strength="full" size={30}>
                    <IconCategoryHeart size={26} />
                  </NeonWrap>
                </div>
                <input
                  className="nhm-title-input"
                  autoFocus
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Утренняя медитация"
                  aria-label="Название привычки"
                />
              </div>
            </div>

            <div>
              <div className="nhm-field-label">
                <NeonWrap color={FW.amber} strength="soft" size={20}>
                  <IconSidebarCalendar size={18} />
                </NeonWrap>
                Частота
              </div>
              <div className="nhm-seg" role="group" aria-label="Частота привычки">
                <button
                  type="button"
                  className="nhm-seg-btn"
                  data-active={frequency === 'daily'}
                  onClick={() => setFrequency('daily')}
                >
                  {frequency === 'daily' ? <span className="nhm-check">✓</span> : null}
                  Ежедневно
                </button>
                <button
                  type="button"
                  className="nhm-seg-btn"
                  data-active={frequency === 'weekly'}
                  onClick={() => setFrequency('weekly')}
                >
                  {frequency === 'weekly' ? <span className="nhm-check">✓</span> : null}
                  Еженедельно
                </button>
              </div>
            </div>

            <div>
              <div className="nhm-field-label">
                <NeonWrap color={FW.blue} strength="soft" size={20}>
                  <IconClock size={18} />
                </NeonWrap>
                Время
              </div>
              <div className="nhm-time-wrap">
                <button
                  type="button"
                  className="nhm-time-btn"
                  data-open={timePanelOpen}
                  onClick={toggleTimePanel}
                >
                  {reminderTime}
                  <NeonWrap color={FW.blue} strength="soft" size={22}>
                    <IconClock size={20} />
                  </NeonWrap>
                </button>
                {timePanelOpen ? (
                  <div className="nhm-time-pop">
                    <HabitTimePicker
                      value={reminderTime}
                      onChange={setReminderTime}
                      openSeq={timeOpenSeq}
                      onClose={() => setTimePanelOpen(false)}
                    />
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="nhm-field-label">
                <NeonWrap color={FW.purple} strength="soft" size={20}>
                  <IconGrid2x2 size={18} />
                </NeonWrap>
                Категория
              </div>
              <div className="nhm-cat" ref={catRef}>
                <button
                  type="button"
                  className="nhm-cat-trigger"
                  data-open={catOpen}
                  onClick={() => setCatOpen((v) => !v)}
                  aria-expanded={catOpen}
                >
                  <span className="nhm-cat-left">
                    <span className="nhm-cat-ico">
                      <NeonWrap color={selectedCat.color} strength="full" size={30}>
                        <CategoryIcon size={26} />
                      </NeonWrap>
                    </span>
                    <span className="nhm-cat-label">{selectedCat.label}</span>
                  </span>
                  <span className="nhm-cat-chev">▼</span>
                </button>
                {catOpen ? (
                  <div className="nhm-cat-panel" role="listbox">
                    {choices.map((opt) => {
                      const OptIcon = opt.Icon
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          className="nhm-cat-opt"
                          data-active={opt.id === categoryId}
                          role="option"
                          aria-selected={opt.id === categoryId}
                          onClick={() => {
                            setCategoryId(opt.id as HabitCategoryKey)
                            setCatOpen(false)
                          }}
                        >
                          <span className="nhm-cat-opt-ico">
                            <NeonWrap color={opt.color} strength="full" size={32}>
                              <OptIcon size={28} />
                            </NeonWrap>
                          </span>
                          <span className="nhm-cat-opt-text">{opt.label}</span>
                        </button>
                      )
                    })}
                  </div>
                ) : null}
              </div>
            </div>

            <div>
              <div className="nhm-field-label">
                <NeonWrap color={FW.amber} strength="soft" size={20}>
                  <IconActionBell size={18} />
                </NeonWrap>
                Напоминание
              </div>
              <div className="nhm-reminder">
                <div className="nhm-reminder-text">
                  <div className="nhm-reminder-title">Уведомления</div>
                  <div className="nhm-reminder-sub">Получать напоминания о привычке</div>
                </div>
                <button
                  type="button"
                  className="nhm-switch"
                  data-on={reminderEnabled}
                  role="switch"
                  aria-checked={reminderEnabled}
                  onClick={() => setReminderEnabled((v) => !v)}
                >
                  <span className="nhm-switch-thumb" />
                </button>
              </div>
            </div>

            <button className="nhm-submit" type="submit" disabled={submitting || !title.trim()}>
              Создать привычку
            </button>
          </form>
        </div>
      </div>
    </>
  )

  return createPortal(modal, document.body)
}
