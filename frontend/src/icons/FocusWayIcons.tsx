import type { CSSProperties, ReactNode } from 'react'
import { fwNeonFilter } from './focusWayPalette'

const S = 1.75

type BaseProps = {
  size?: number
  className?: string
  style?: CSSProperties
}

function Svg({ size = 24, className, style, children }: BaseProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      style={style}
      aria-hidden
    >
      {children}
    </svg>
  )
}

export function NeonWrap({
  color,
  strength = 'full',
  active = true,
  size = 22,
  children,
}: {
  color: string
  strength?: 'soft' | 'full' | 'strong'
  active?: boolean
  size?: number
  children: ReactNode
}) {
  const f = active ? fwNeonFilter(color, strength) : fwNeonFilter(color, 'soft')
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color,
        filter: f,
        lineHeight: 0,
        width: size,
        height: size,
      }}
    >
      {children}
    </span>
  )
}

/* ——— Sidebar ——— */

export function IconSidebarHome({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M4 10.5 12 4l8 6.5V19a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19v-8.5Z"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <path d="M9.5 21.5v-7h5v7" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

export function IconSidebarGoals({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth={S} />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth={S} />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
      <path
        d="M17.5 6.5l-4 4"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinecap="round"
      />
      <path
        d="M18 4v3.5h-3.2"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconSidebarHabits({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M9 3.5h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-14a2 2 0 0 1 2-2Z"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <path d="M9 3.5V2" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <path d="M15 3.5V2" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <path d="M8 8.5h8M8 12h8M8 15.5h5" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

export function IconSidebarCalendar({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth={S} />
      <path d="M8 3v4M16 3v4M3 11h18" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <path
        d="M7 15h2M11 15h2M15 15h2M7 18h2M11 18h2"
        stroke="currentColor"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
    </Svg>
  )
}

export function IconClock({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={S} />
      <path d="M12 8v4.5l3 2" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

export function IconGrid2x2({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <rect x="4" y="4" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth={S} />
      <rect x="14" y="4" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth={S} />
      <rect x="4" y="14" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth={S} />
      <rect x="14" y="14" width="6" height="6" rx="1.2" stroke="currentColor" strokeWidth={S} />
    </Svg>
  )
}

export function IconSidebarAnalytics({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path d="M5 19V11" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <path d="M12 19V8" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <path d="M19 19V5" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

/* ——— Categories ——— */

export function IconCategoryWheel({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="7" stroke="currentColor" strokeWidth={S} />
      <circle cx="12" cy="12" r="2" stroke="currentColor" strokeWidth={S} />
      <path d="M12 5v14M5 12h14M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="currentColor" strokeWidth={1.25} strokeLinecap="round" />
    </Svg>
  )
}

export function IconCategoryFinance({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M12 3v18M15 7.5a3 3 0 0 0-6 0c0 2.2 6 1.8 6 4.5a3 3 0 0 1-6 0"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

/** Гантель: три вертикальных блина с каждой стороны (короткий — длинный — средний к грифу) */
export function IconCategoryDumbbell({ size }: BaseProps) {
  const r = 0.55
  return (
    <Svg size={size}>
      <path d="M9.65 12h4.7" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <rect x="2.35" y="10" width="2.05" height="4" rx={r} stroke="currentColor" strokeWidth={S} fill="none" />
      <rect x="4.85" y="7.5" width="2.05" height="9" rx={r} stroke="currentColor" strokeWidth={S} fill="none" />
      <rect x="7.35" y="9" width="2.05" height="6" rx={r} stroke="currentColor" strokeWidth={S} fill="none" />
      <rect x="19.6" y="10" width="2.05" height="4" rx={r} stroke="currentColor" strokeWidth={S} fill="none" />
      <rect x="17.1" y="7.5" width="2.05" height="9" rx={r} stroke="currentColor" strokeWidth={S} fill="none" />
      <rect x="14.6" y="9" width="2.05" height="6" rx={r} stroke="currentColor" strokeWidth={S} fill="none" />
    </Svg>
  )
}

export function IconCategoryBook({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M5 5.5c2.5-1 5.5-.2 7 1.4C13.5 5.3 16.5 4.5 19 5.5V18c-2.5-1-5.5-.3-7 1.2-1.5-1.5-4.5-2.2-7-1.2V5.5Z"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <path d="M12 6.9V20" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

export function IconCategoryPlane({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M10.5 18 12 13l-5-3 8-4.5 2.5-4c.3-.5 1-.5 1.3 0l1.2 2.1c.2.4 0 .9-.4 1.1L14 10.5l-3.5 7.5Z"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <path d="M5 19.5h4" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

export function IconCategoryHeart({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M12 20s-7-4.6-9-8.8C.5 8.5 3.5 5 7 5c1.8 0 3.4.9 4.3 2.3A5.3 5.3 0 0 1 17 5c3.5 0 6.5 3.5 4 6.2-2 4.2-9 8.8-9 8.8Z"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconCategoryCode({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path d="m8 9-3 3 3 3" stroke="currentColor" strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m16 9 3 3-3 3" stroke="currentColor" strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m14 7-4 10" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

/* ——— Actions ——— */

export function IconActionAdd({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={S} />
      <path d="M12 8.5v7M8.5 12h7" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

export function IconActionDelete({ size, className, style }: BaseProps) {
  return (
    <Svg size={size} className={className} style={style}>
      <path d="M4 7h16" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
      <path
        d="M7 7v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V7M10 11v6M14 11v6M9 7V5h6v2"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

export function IconActionEdit({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="m15.5 5.5 3 3L9 18H6v-3L15.5 5.5Z"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <path d="M13 8l3 3" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

export function IconActionCheck({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth={S} />
      <path d="m8.5 12.2 2.3 2.2L15.5 9.5" stroke="currentColor" strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  )
}

export function IconActionBell({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M12 4a3.5 3.5 0 0 1 3.5 3.5V11l1.3 2.6a.8.8 0 0 1-.7 1.1H8.9a.8.8 0 0 1-.7-1.1L9.5 11V7.5A3.5 3.5 0 0 1 12 4Z"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinejoin="round"
      />
      <path d="M10 18a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth={S} strokeLinecap="round" />
    </Svg>
  )
}

/** App logo mark — code brackets, purple */
export function IconLogoCode({ size }: BaseProps) {
  return <IconCategoryCode size={size} />
}

/** Accent burst — «личное» / highlights */
export function IconSparkle({ size }: BaseProps) {
  return (
    <Svg size={size}>
      <path
        d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.4 5.4l2.2 2.2M16.4 16.4l2.2 2.2M18.6 5.4l-2.2 2.2M5.4 18.6l2.2-2.2"
        stroke="currentColor"
        strokeWidth={S}
        strokeLinecap="round"
      />
    </Svg>
  )
}
