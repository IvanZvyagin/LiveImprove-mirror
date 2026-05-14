import type { MutableRefObject } from 'react'
import { useCallback, useLayoutEffect, useRef } from 'react'
import styles from './HabitTimePicker.module.css'

const ITEM = 44

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

function WheelColumn({
  values,
  value,
  onChange,
  openSeq,
  activeRef,
}: {
  values: string[]
  value: string
  onChange: (v: string) => void
  openSeq: number
  activeRef: MutableRefObject<string | null>
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const snapTimer = useRef(0)
  const idx = Math.max(0, values.indexOf(value))

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.scrollTop = idx * ITEM
  }, [idx, openSeq, values])

  const snap = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const raw = el.scrollTop / ITEM
    let i = Math.round(raw)
    i = Math.max(0, Math.min(values.length - 1, i))
    el.scrollTo({ top: i * ITEM, behavior: 'smooth' })
    const next = values[i]
    if (next !== activeRef.current) {
      activeRef.current = next
      onChange(next)
    }
  }, [values, onChange, activeRef])

  const onScroll = () => {
    window.clearTimeout(snapTimer.current)
    const el = scrollRef.current
    if (!el) return
    const i = Math.round(el.scrollTop / ITEM)
    const clamped = Math.max(0, Math.min(values.length - 1, i))
    const next = values[clamped]
    if (next !== activeRef.current) {
      activeRef.current = next
      onChange(next)
    }
    snapTimer.current = window.setTimeout(snap, 140)
  }

  return (
    <div className={styles.wheelWrap}>
      <div className={styles.wheelHighlight} aria-hidden />
      <div ref={scrollRef} className={styles.wheelScroll} onScroll={onScroll}>
        {values.map((v) => (
          <div
            key={v}
            className={`${styles.wheelItem} ${v === value ? styles.active : ''}`}
          >
            {v}
          </div>
        ))}
      </div>
    </div>
  )
}

export type HabitTimePickerProps = {
  value: string
  onChange: (hhmm: string) => void
  onClose: () => void
  openSeq: number
}

export default function HabitTimePicker({ value, onChange, onClose, openSeq }: HabitTimePickerProps) {
  const [h0, m0] = value.includes(':') ? value.split(':') : ['07', '00']
  const hour = HOURS.includes(h0) ? h0 : '07'
  const minute = MINUTES.includes(m0) ? m0 : '00'

  const hourRef = useRef<string | null>(hour)
  const minuteRef = useRef<string | null>(minute)
  hourRef.current = hour
  minuteRef.current = minute

  const setHour = (h: string) => {
    hourRef.current = h
    onChange(`${h}:${minuteRef.current ?? minute}`)
  }
  const setMinute = (m: string) => {
    minuteRef.current = m
    onChange(`${hourRef.current ?? hour}:${m}`)
  }

  return (
    <div className={styles.pickerRoot}>
      <div className={styles.picker}>
        <WheelColumn
          values={HOURS}
          value={hour}
          onChange={setHour}
          openSeq={openSeq}
          activeRef={hourRef}
        />
        <span className={styles.sep} aria-hidden>
          :
        </span>
        <WheelColumn
          values={MINUTES}
          value={minute}
          onChange={setMinute}
          openSeq={openSeq}
          activeRef={minuteRef}
        />
      </div>
      <div className={styles.footer}>
        <button type="button" className={styles.doneBtn} onClick={onClose}>
          Готово
        </button>
      </div>
    </div>
  )
}
