import type { InterviewStage } from '../types/analytics'

type FunnelBarProps = {
  stage: InterviewStage
}

export default function FunnelBar({ stage }: FunnelBarProps) {
  return (
    <div className="funnel-row">
      <div className="funnel-pill" style={{ width: `${stage.percent}%`, background: stage.gradient }}>
        <span className="funnel-label">{stage.label}</span>
        <span className="funnel-count">{stage.value}</span>
        <span className="funnel-percent">{stage.percent}%</span>
      </div>
    </div>
  )
}
