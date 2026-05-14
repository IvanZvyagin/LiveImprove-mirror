import type { ReactNode } from 'react'
import { FW } from './focusWayPalette'
import {
  IconCategoryBook,
  IconCategoryCode,
  IconCategoryHeart,
  NeonWrap,
} from './FocusWayIcons'

const SZ = 18

/** Row glyph in habit list: prefer API icon token, else emoji map, else category default */
export function HabitRowGlyph({
  icon,
  categoryId,
}: {
  icon: string
  categoryId: string
}): ReactNode {
  const key = normalizeIconKey(icon, categoryId)
  if (!key) {
    return <span className="habit-item-fallback">{icon}</span>
  }

  if (key === 'health') {
    return (
      <NeonWrap color={FW.pink} strength="soft" size={SZ}>
        <IconCategoryHeart size={SZ} />
      </NeonWrap>
    )
  }
  if (key === 'learning') {
    return (
      <NeonWrap color={FW.purple} strength="soft" size={SZ}>
        <IconCategoryBook size={SZ} />
      </NeonWrap>
    )
  }
  if (key === 'code') {
    return (
      <NeonWrap color={FW.purple} strength="soft" size={SZ}>
        <IconCategoryCode size={SZ} />
      </NeonWrap>
    )
  }

  return <span className="habit-item-fallback">{icon}</span>
}

const HEALTH_EMOJI = ['🧘', '🏃', '💧', '🌿', '💪', '❤️']
const LEARN_EMOJI = ['📖', '🗣', '📚', '🎓']
const CODE_EMOJI = ['🧩', '🧱', '📐', '💻']

function normalizeIconKey(raw: string, categoryId: string): string {
  const t = raw.trim()
  if (t === 'health' || t === 'learning' || t === 'code') return t
  if (t.startsWith('fw:')) return t.replace(/^fw:/, '')
  if (HEALTH_EMOJI.some((e) => t.includes(e))) return 'health'
  if (LEARN_EMOJI.some((e) => t.includes(e))) return 'learning'
  if (CODE_EMOJI.some((e) => t.includes(e))) return 'code'
  if (categoryId === 'health' || categoryId === 'learning' || categoryId === 'code') return categoryId
  return ''
}

/** Card header: backend icon string heart | book | code (solid white glyphs) */
export function HabitCardHeaderGlyph({ icon }: { icon: string }): ReactNode {
  const solid = { fill: '#ffffff', stroke: 'none', opacity: 1 } as const
  if (icon === 'heart') {
    return (
      <svg
        className="habit-icon-glyph"
        viewBox="0 0 24 24"
        width={22}
        height={22}
        aria-hidden
      >
        <path
          d="M12 21s-7.5-4.7-9.6-9.1C.7 8.5 3.4 4.8 7 4.8c1.9 0 3.7 1 5 2.6 1.3-1.6 3.1-2.6 5-2.6 3.6 0 6.3 3.7 4.6 7.1C19.5 16.3 12 21 12 21Z"
          style={solid}
        />
      </svg>
    )
  }
  if (icon === 'book') {
    return (
      <svg
        className="habit-icon-glyph"
        viewBox="0 0 24 24"
        width={22}
        height={22}
        aria-hidden
      >
        <path
          d="M4 4.6c2.6-1 5.4-.4 7 1.1V20c-1.6-1.4-4.4-2-7-1V4.6Z"
          style={solid}
        />
        <path
          d="M20 4.6c-2.6-1-5.4-.4-7 1.1V20c1.6-1.4 4.4-2 7-1V4.6Z"
          style={solid}
        />
      </svg>
    )
  }
  return (
    <svg
      className="habit-icon-glyph"
      viewBox="0 0 24 24"
      width={22}
      height={22}
      aria-hidden
    >
      <path
        d="M9.1 7.4 4.5 12l4.6 4.6 1.6-1.6L7.6 12l3.1-3 -1.6-1.6Zm5.8 0L13.3 9l3.1 3-3.1 3 1.6 1.6L19.5 12l-4.6-4.6Z"
        style={solid}
      />
      <path
        d="M13.6 5.8 11 18.4l-1.9-.4L11.7 5.4l1.9.4Z"
        style={solid}
      />
    </svg>
  )
}
