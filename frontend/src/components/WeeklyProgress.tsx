import { FW } from '../icons/focusWayPalette'
import { IconSidebarAnalytics, NeonWrap } from '../icons/FocusWayIcons'
import type { WeeklyProgressItem } from '../types/habits'
import Card from './ui/Card'

type WeeklyProgressProps = {
  total: string
  items: WeeklyProgressItem[]
}

export default function WeeklyProgress({ total, items }: WeeklyProgressProps) {
  return (
    <Card as="section" className="weekly-card">
      <div className="weekly-row">
        <div className="weekly-summary">
          <div className="weekly-icon">
            <NeonWrap color={FW.pink} strength="soft" size={24}>
              <IconSidebarAnalytics size={22} />
            </NeonWrap>
          </div>
          <div>
            <div className="weekly-title">Общий прогресс за неделю</div>
            <div className="weekly-subtitle">{total}</div>
          </div>
        </div>
        <div className="weekly-progress">
          <div className="weekly-track">
            {items.map((day) => (
              <div className="weekly-segment" key={day.label}>
                <div
                  className="weekly-segment-fill"
                  style={{ width: `${day.value * 100}%`, background: day.color }}
                />
              </div>
            ))}
          </div>
          <div className="weekly-labels">
            {items.map((day) => (
              <span key={`${day.label}-label`}>{day.label}</span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}
