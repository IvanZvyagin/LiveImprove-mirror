import { useEffect, useMemo, useRef, useState } from 'react'
import styles from './GoalDatePicker.module.css'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь',
  'Февраль',
  'Март',
  'Апрель',
  'Май',
  'Июнь',
  'Июль',
  'Август',
  'Сентябрь',
  'Октябрь',
  'Ноябрь',
  'Декабрь',
]

const parseIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const toIso = (y: number, monthIndex: number, day: number) =>
  `${y}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

type GoalDatePickerProps = {
  value: string
  onChange: (iso: string) => void
  /** Для связи с <label htmlFor>. */
  triggerId?: string
  required?: boolean
}

export default function GoalDatePicker({ value, onChange, triggerId, required }: GoalDatePickerProps) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const base = value ? parseIso(value) : new Date()
  const [viewY, setViewY] = useState(base.getFullYear())
  const [viewM, setViewM] = useState(base.getMonth())

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  useEffect(() => {
    if (value) {
      const d = parseIso(value)
      setViewY(d.getFullYear())
      setViewM(d.getMonth())
    }
  }, [value])

  const grid = useMemo(() => {
    const first = new Date(viewY, viewM, 1)
    const lastDay = new Date(viewY, viewM + 1, 0).getDate()
    const offset = (first.getDay() + 6) % 7
    const cells: (number | null)[] = [...Array(offset).fill(null)]
    for (let d = 1; d <= lastDay; d++) cells.push(d)
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [viewY, viewM])

  const label = value
    ? parseIso(value).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : 'Выберите дату'

  const today = new Date()
  const isToday = (day: number) =>
    day === today.getDate() && viewM === today.getMonth() && viewY === today.getFullYear()

  const isSelected = (day: number) => {
    if (!value) return false
    const d = parseIso(value)
    return day === d.getDate() && viewM === d.getMonth() && viewY === d.getFullYear()
  }

  const prevMonth = () => {
    if (viewM === 0) {
      setViewM(11)
      setViewY((y) => y - 1)
    } else setViewM((m) => m - 1)
  }

  const nextMonth = () => {
    if (viewM === 11) {
      setViewM(0)
      setViewY((y) => y + 1)
    } else setViewM((m) => m + 1)
  }

  const pick = (day: number) => {
    onChange(toIso(viewY, viewM, day))
    setOpen(false)
  }

  return (
    <div className={styles.root} ref={wrapRef}>
      <input type="hidden" value={value} required={required} readOnly aria-hidden tabIndex={-1} />
      <button
        id={triggerId}
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className={styles.triggerIcon} aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M3 10h18M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </span>
        <span className={value ? styles.triggerText : styles.triggerPlaceholder}>{label}</span>
      </button>
      {open ? (
        <div className={styles.popover} role="dialog" aria-label="Календарь">
          <div className={styles.popoverHead}>
            <button type="button" className={styles.navBtn} onClick={prevMonth} aria-label="Предыдущий месяц">
              ‹
            </button>
            <span className={styles.monthTitle}>
              {MONTHS[viewM]} {viewY}
            </span>
            <button type="button" className={styles.navBtn} onClick={nextMonth} aria-label="Следующий месяц">
              ›
            </button>
          </div>
          <div className={styles.weekdays}>
            {WEEKDAYS.map((w) => (
              <span key={w} className={styles.weekday}>
                {w}
              </span>
            ))}
          </div>
          <div className={styles.grid}>
            {grid.map((cell, i) =>
              cell === null ? (
                <span key={`e-${viewY}-${viewM}-${i}`} className={styles.cellEmpty} />
              ) : (
                <button
                  key={`${viewY}-${viewM}-${cell}-${i}`}
                  type="button"
                  className={`${styles.day}${isSelected(cell) ? ` ${styles.daySelected}` : ''}${isToday(cell) ? ` ${styles.dayToday}` : ''}`}
                  onClick={() => pick(cell)}
                >
                  {cell}
                </button>
              ),
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
