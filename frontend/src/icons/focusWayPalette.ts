/** FocusWay / productivity dark UI palette — neon accent lines */
export const FW = {
  blue: '#3B82F6',
  green: '#10B981',
  purple: '#8B5CF6',
  amber: '#F59E0B',
  pink: '#EC4899',
  bg: '#0B0E14',
} as const

export type FWColor = (typeof FW)[keyof typeof FW]

export function fwRgba(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16)
  const r = (n >> 16) & 255
  const g = (n >> 8) & 255
  const b = n & 255
  return `rgba(${r},${g},${b},${alpha})`
}

/** Outer glow (drop-shadow stack). `strong` — заметное свечение (например корзина на карточке цели). */
export function fwNeonFilter(hex: string, strength: 'soft' | 'full' | 'strong' = 'full'): string {
  if (strength === 'soft') {
    return `drop-shadow(0 0 2px ${fwRgba(hex, 0.9)}) drop-shadow(0 0 6px ${fwRgba(hex, 0.28)}) drop-shadow(0 0 12px ${fwRgba(hex, 0.14)})`
  }
  if (strength === 'strong') {
    return [
      `drop-shadow(0 0 1px ${fwRgba(hex, 1)})`,
      `drop-shadow(0 0 3px ${fwRgba(hex, 0.95)})`,
      `drop-shadow(0 0 10px ${fwRgba(hex, 0.72)})`,
      `drop-shadow(0 0 20px ${fwRgba(hex, 0.48)})`,
      `drop-shadow(0 0 32px ${fwRgba(hex, 0.28)})`,
    ].join(' ')
  }
  return `drop-shadow(0 0 2px ${fwRgba(hex, 0.95)}) drop-shadow(0 0 8px ${fwRgba(hex, 0.55)}) drop-shadow(0 0 16px ${fwRgba(hex, 0.22)})`
}
