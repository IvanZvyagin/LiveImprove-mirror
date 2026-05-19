import type { CSSProperties } from 'react'
import type { CompletedGoal } from '../types/goals'
import Card from './ui/Card'

type CompletedGoalRowProps = {
  goal: CompletedGoal
  accentStyle: CSSProperties
}

export default function CompletedGoalRow({ goal, accentStyle }: CompletedGoalRowProps) {
  return (
    <Card className="completed-card" key={goal.id} style={accentStyle}>
      <div className="completed-icon">{goal.icon}</div>
      <div className="completed-body">
        <div className="completed-title">{goal.title}</div>
        <div className="completed-meta">{goal.category}</div>
      </div>
      <div className="completed-progress">
        <div className="completed-date">Завершено {goal.completedDate}</div>
        <span className="completed-pill">{goal.progress}%</span>
      </div>
    </Card>
  )
}
