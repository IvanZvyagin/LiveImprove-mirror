import Card from '../components/ui/Card'
import useAnalytics from '../hooks/useAnalytics'
import type { MetricIconKind } from '../types/analytics'

const RING_STROKE = 14

function HalfGauge({ value, max = 100 }: { value: number; max?: number }) {
  const w = 220
  const h = 130
  const r = 90
  const cx = w / 2
  const cy = h - 12
  const startX = cx - r
  const startY = cy
  const endX = cx + r
  const endY = cy
  const arcLength = Math.PI * r
  const clamped = Math.max(0, Math.min(max, value))
  const offset = arcLength - (clamped / max) * arcLength

  return (
    <div className="gauge-wrap">
      <svg
        className="gauge-svg"
        viewBox={`0 0 ${w} ${h}`}
        width="100%"
        aria-hidden
      >
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#a78bfa" />
            <stop offset="50%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#f472b6" />
          </linearGradient>
          <filter id="gaugeGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="#1f2937"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
        />
        <path
          d={`M ${startX} ${startY} A ${r} ${r} 0 0 1 ${endX} ${endY}`}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth={RING_STROKE}
          strokeLinecap="round"
          strokeDasharray={arcLength}
          strokeDashoffset={offset}
          filter="url(#gaugeGlow)"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <div className="gauge-value">
        <span className="gauge-number">{clamped}</span>
        <span className="gauge-slash">/{max}</span>
      </div>
    </div>
  )
}

function buildAreaPath(
  values: readonly number[],
  width: number,
  height: number,
  padX = 6,
  padY = 10,
  fixedMin?: number,
  fixedMax?: number,
) {
  const resolved = values.length >= 2 ? [...values] : [values[0] ?? 0, values[0] ?? 0]
  const min = fixedMin ?? Math.min(...resolved)
  const max = fixedMax ?? Math.max(...resolved)
  const range = max - min || 1
  const step = (width - padX * 2) / (resolved.length - 1)
  const points = resolved.map((v, i) => {
    const x = padX + i * step
    const y = height - padY - ((v - min) / range) * (height - padY * 2)
    return { x, y }
  })
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  const area = `${line} L ${points[points.length - 1].x} ${height - padY} L ${points[0].x} ${
    height - padY
  } Z`
  return { points, line, area, width, height }
}

function MetricIcon({ kind }: { kind?: MetricIconKind }) {
  const S = 1.6
  const stroke = 'currentColor'
  switch (kind) {
    case 'tasks':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <rect x="4" y="4" width="16" height="16" rx="3" stroke={stroke} strokeWidth={S} />
          <path d="m8 12 3 3 5-6" stroke={stroke} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'velocity':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <path d="M5 19V9M12 19V5M19 19v-7" stroke={stroke} strokeWidth={S} strokeLinecap="round" />
        </svg>
      )
    case 'coverage':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6l-8-3Z" stroke={stroke} strokeWidth={S} strokeLinejoin="round" />
          <path d="m8.5 12 2.5 2.5 4.5-5" stroke={stroke} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'review':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <rect x="3" y="5" width="18" height="13" rx="2" stroke={stroke} strokeWidth={S} />
          <path d="m9 11-2 2 2 2M15 11l2 2-2 2" stroke={stroke} strokeWidth={S} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'debt':
      return (
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
          <path d="M4 19h16M6 19V9m4 10V5m4 14v-8m4 8v-5" stroke={stroke} strokeWidth={S} strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}

function Sparkline({
  points,
  color = '#60a5fa',
  width = 96,
  height = 28,
}: {
  points: readonly number[]
  color?: string
  width?: number
  height?: number
}) {
  const chart = buildAreaPath(points, width, height, 2, 4)
  const id = `spark-${color.replace('#', '')}`
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.4} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={chart.area} fill={`url(#${id})`} />
      <path d={chart.line} fill="none" stroke={color} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function extractGradientColors(gradient: string): [string, string] {
  const matches = gradient.match(/#[0-9a-fA-F]{3,8}/g) ?? []
  const first = matches[0] ?? '#a855f7'
  const second = matches[1] ?? first
  return [first, second]
}

function FunnelTrapezoid({
  topW,
  bottomW,
  gradient,
  radius = 4,
  idSeed,
}: {
  topW: number
  bottomW: number
  gradient: string
  radius?: number
  idSeed: string
}) {
  const W = 100
  const H = 40
  const tLx = (W - topW) / 2
  const tRx = W - tLx
  const bLx = (W - bottomW) / 2
  const bRx = W - bLx
  const r = radius
  const [from, to] = extractGradientColors(gradient)
  const gid = `fnl-${idSeed}`
  const path = [
    `M ${tLx + r} 0`,
    `L ${tRx - r} 0`,
    `Q ${tRx} 0 ${tRx} ${r}`,
    `L ${bRx} ${H - r}`,
    `Q ${bRx} ${H} ${bRx - r} ${H}`,
    `L ${bLx + r} ${H}`,
    `Q ${bLx} ${H} ${bLx} ${H - r}`,
    `L ${tLx} ${r}`,
    `Q ${tLx} 0 ${tLx + r} 0`,
    'Z',
  ].join(' ')
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      width="100%"
      height="100%"
      style={{ display: 'block' }}
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
      </defs>
      <path d={path} fill={`url(#${gid})`} />
    </svg>
  )
}

function HelpDot() {
  return (
    <span className="an-help" aria-hidden>
      <svg viewBox="0 0 16 16" width="14" height="14" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 6.6c0-.9.8-1.6 1.7-1.4.7.2 1.1.9.9 1.6-.2.6-.9.8-1.3 1.1-.3.3-.4.6-.4.9M8 11h.01" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    </span>
  )
}

function Chevron({ down = true }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden style={{ transform: down ? undefined : 'rotate(-90deg)' }}>
      <path d="m3 4.5 3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function Analytics() {
  const { data: analytics, trackAction } = useAnalytics()

  const bugMax = analytics.bugRate.gridMax ?? Math.max(...analytics.bugRate.points)
  const bugStep = analytics.bugRate.gridStep ?? bugMax / 3
  const bugChart = buildAreaPath(analytics.bugRate.points, 280, 130, 28, 10, 0, bugMax)

  const incomePts = analytics.income.points
  const incomeChart = buildAreaPath(incomePts, 640, 180, 14, 16)
  const incomeMin = Math.min(...incomePts)
  const incomeMax = Math.max(...incomePts)
  const incomeRange = incomeMax - incomeMin || 1
  const incomeGridLines = [80, 120, 160, 200, 240].filter((v) => v >= incomeMin - 20 && v <= incomeMax + 20)

  return (
    <div className="page analytics-page">
      <header className="page-topbar">
        <div className="page-title">
          <h2>Аналитика</h2>
          <p className="page-subtitle">Отслеживайте прогресс и рост как разработчика.</p>
        </div>
        <div className="page-actions">
          <div className="an-tabs">
            {analytics.tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`an-tab${index === 1 ? ' is-active' : ''}`}
                onClick={() => trackAction('analytics.tab', tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="an-icon-btn"
            onClick={() => trackAction('analytics.download')}
            aria-label="Календарь"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden>
              <rect x="4" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </header>

      <section className="analytics-top">
        <Card className="analytics-score">
          <div className="an-card-head">
            <div className="an-card-title">
              Output Score <HelpDot />
            </div>
          </div>
          <HalfGauge value={analytics.outputScore.value} />
          <div className="score-delta-row">
            <span className="score-delta">↑ {analytics.outputScore.delta}</span>
          </div>
          <div className="score-status">{analytics.outputScore.status}</div>
          {analytics.outputScore.description ? (
            <p className="score-desc">{analytics.outputScore.description}</p>
          ) : null}
          <div className="score-meta-grid">
            {analytics.outputMeta.map((m) => (
              <div className="meta-cell" key={m.label}>
                <div className="meta-label">{m.label}</div>
                <div className="meta-value-row">
                  <span className="meta-value">{m.value}</span>
                  <span className="meta-delta">↑ {m.delta.replace(/^[+\-↑↓]\s*/, '')}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="analytics-bug">
          <div className="an-card-head">
            <div className="an-card-title">
              Bug Rate <HelpDot />
            </div>
            <button type="button" className="an-pill-select">
              На 1К строк кода <Chevron />
            </button>
          </div>
          <div className="bug-head-row">
            <span className="bug-value">{analytics.bugRate.value}</span>
            <span className="bug-delta">↓ {analytics.bugRate.delta.replace(/^[+\-↑↓]\s*/, '')}</span>
          </div>
          <p className="bug-caption">меньше багов, чем в прошлом периоде</p>

          <div className="grid-chart">
            <div className="grid-y-axis">
              {Array.from({ length: Math.round(bugMax / bugStep) + 1 }, (_, i) => bugMax - i * bugStep).map(
                (v) => (
                  <span key={v}>{v.toFixed(1)}</span>
                ),
              )}
            </div>
            <svg viewBox={`0 0 ${bugChart.width} ${bugChart.height}`} role="presentation" className="grid-chart-svg">
              <defs>
                <linearGradient id="bugArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0.55)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                </linearGradient>
                <filter id="bugGlow" x="-10%" y="-10%" width="120%" height="120%">
                  <feGaussianBlur stdDeviation="1" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {Array.from({ length: Math.round(bugMax / bugStep) + 1 }, (_, i) => {
                const y = 10 + (i * (bugChart.height - 20)) / Math.round(bugMax / bugStep)
                return (
                  <line
                    key={i}
                    x1={28}
                    x2={bugChart.width - 6}
                    y1={y}
                    y2={y}
                    stroke="rgba(148,163,184,0.12)"
                    strokeDasharray="2 4"
                  />
                )
              })}
              <path d={bugChart.area} fill="url(#bugArea)" />
              <path
                d={bugChart.line}
                stroke="#c084fc"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#bugGlow)"
              />
              {bugChart.points.map((p, i) => {
                const isLast = i === bugChart.points.length - 1
                return (
                  <circle
                    key={`${p.x}-${p.y}`}
                    cx={p.x}
                    cy={p.y}
                    r={isLast ? 4.5 : 3}
                    fill={isLast ? '#ec4899' : '#c084fc'}
                    stroke={isLast ? 'rgba(236,72,153,0.35)' : 'transparent'}
                    strokeWidth={isLast ? 5 : 0}
                    filter="url(#bugGlow)"
                  />
                )
              })}
            </svg>
          </div>
          <div className="chart-x-axis">
            {analytics.bugRate.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          {analytics.bugRate.footer ? (
            <div className="card-footer-note">
              <span className="cfn-icon" aria-hidden>🏆</span>
              {analytics.bugRate.footer}
            </div>
          ) : null}
        </Card>

        <Card className="analytics-funnel">
          <div className="an-card-head">
            <div className="an-card-title">
              Собеседования <HelpDot />
            </div>
            <button type="button" className="an-pill-select">
              За 90 дней <Chevron />
            </button>
          </div>
          <div className="funnel-pyramid">
            {(() => {
              const widthSteps = [100, 87, 74, 61, 48]
              const minBottom = 40
              return analytics.interviews.map((stage, i) => {
                const topW = widthSteps[i] ?? Math.max(minBottom, 100 - i * 13)
                const bottomW =
                  widthSteps[i + 1] ?? Math.max(minBottom, topW - 13)
                const topPad = (100 - topW) / 2
                const botPad = (100 - bottomW) / 2
                const innerPad = Math.max(topPad, botPad) + 2
                return (
                  <div className="fp-row" key={stage.label}>
                    <div className="fp-bg">
                      <FunnelTrapezoid
                        topW={topW}
                        bottomW={bottomW}
                        gradient={stage.gradient}
                        idSeed={`${i}-${stage.label}`}
                      />
                    </div>
                    <div
                      className="fp-content"
                      style={{
                        paddingLeft: `${innerPad}%`,
                        paddingRight: `${innerPad}%`,
                      }}
                    >
                      <span className="fp-label">{stage.label}</span>
                      <span className="fp-value">{stage.value}</span>
                      <span className="fp-percent">{stage.percent}%</span>
                    </div>
                  </div>
                )
              })
            })()}
          </div>
          {analytics.interviewsMeta ? (
            <div className="funnel-foot-row">
              <div>
                <div className="ff-label">{analytics.interviewsMeta.conversionLabel}</div>
                <div className="ff-value ff-pink">{analytics.interviewsMeta.conversionValue}</div>
              </div>
              <div>
                <div className="ff-label">{analytics.interviewsMeta.bestLabel}</div>
                <div className="ff-value ff-green">{analytics.interviewsMeta.bestValue}</div>
              </div>
            </div>
          ) : null}
        </Card>
      </section>

      <section className="analytics-middle">
        <Card className="income-card">
          <div className="an-card-head">
            <div className="an-card-title">
              Доход / Зарплата <HelpDot />
            </div>
            <button type="button" className="an-pill-select">
              За 12 месяцев <Chevron />
            </button>
          </div>
          <div className="income-head-row">
            <span className="income-value">{analytics.income.current}</span>
            <span className="income-delta">↑ {analytics.income.delta.replace(/^[+\-↑↓]\s*/, '')}</span>
          </div>
          {analytics.income.subtitle ? (
            <p className="income-sub">{analytics.income.subtitle}</p>
          ) : null}

          <div className="income-chart-wrap">
            <span className="forecast-badge">
              Прогноз
              <strong>{analytics.income.forecast}</strong>
            </span>
            <svg viewBox={`0 0 ${incomeChart.width} ${incomeChart.height}`} role="presentation" className="income-svg">
              <defs>
                <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(168, 85, 247, 0.55)" />
                  <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                </linearGradient>
                <filter id="incomeGlow" x="-6%" y="-12%" width="112%" height="124%">
                  <feGaussianBlur stdDeviation="1.2" result="blur" />
                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {incomeGridLines.map((v) => {
                const y =
                  incomeChart.height -
                  16 -
                  ((v - incomeMin) / incomeRange) * (incomeChart.height - 32)
                return (
                  <g key={v}>
                    <line
                      x1={14}
                      x2={incomeChart.width - 6}
                      y1={y}
                      y2={y}
                      stroke="rgba(148,163,184,0.1)"
                      strokeDasharray="2 4"
                    />
                    <text x={4} y={y + 3} fontSize="9" fill="rgba(148,163,184,0.65)">
                      {v}К
                    </text>
                  </g>
                )
              })}
              <path d={incomeChart.area} fill="url(#incomeArea)" />
              <path
                d={incomeChart.line}
                stroke="#c084fc"
                strokeWidth="3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#incomeGlow)"
              />
              {incomeChart.points.map((p, i) => {
                const isLast = i === incomeChart.points.length - 1
                return (
                  <circle
                    key={`${p.x}-${p.y}`}
                    cx={p.x}
                    cy={p.y}
                    r={isLast ? 5 : 3.2}
                    fill={isLast ? '#ec4899' : '#c084fc'}
                    stroke={isLast ? 'rgba(236,72,153,0.4)' : 'rgba(192,132,252,0.32)'}
                    strokeWidth={isLast ? 5 : 3}
                    filter="url(#incomeGlow)"
                  />
                )
              })}
            </svg>
          </div>
          <div className="chart-x-axis income-x-axis">
            {analytics.income.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          {analytics.income.meta ? (
            <div className="income-meta-row">
              {analytics.income.meta.map((m) => (
                <div className="meta-cell income-meta-cell" key={m.label}>
                  <div className="meta-label">{m.label}</div>
                  <div className="meta-value income-meta-value">
                    {m.value}
                    {m.arrow ? <span className="meta-arrow">›</span> : null}
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </Card>

        <Card className="metrics-card">
          <div className="an-card-head">
            <div className="an-card-title">
              Ключевые метрики <HelpDot />
            </div>
          </div>
          <ul className="metric-list">
            {analytics.metrics.map((m) => (
              <li className="metric-row" key={m.label}>
                <span className="metric-ico" style={{ color: m.color }}>
                  <MetricIcon kind={m.iconKind} />
                </span>
                <span className="metric-label">{m.label}</span>
                <span className="metric-value">{m.value}</span>
                <span className={`metric-delta${m.trend === 'down' ? ' is-neg' : ''}`}>
                  {m.trend === 'down' ? '↓' : '↑'} {m.delta.replace(/^[+\-↑↓]\s*/, '')}
                </span>
                <span className="metric-spark">
                  {m.points ? <Sparkline points={m.points} color={m.color ?? '#60a5fa'} /> : null}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="analytics-bottom">
        {analytics.insights.map((item) => (
          <Card className="insight-card" key={item.title}>
            <span className={`insight-ico${item.kind === 'recommendation' ? ' is-rec' : ''}`} aria-hidden>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none">
                <path
                  d="M12 3 13.4 9 19 10.5 13.4 12 12 18 10.6 12 5 10.5 10.6 9 12 3Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  fill="currentColor"
                  fillOpacity="0.15"
                />
                <path d="M19 4l.5 1.5L21 6l-1.5.5L19 8l-.5-1.5L17 6l1.5-.5L19 4Z" fill="currentColor" />
              </svg>
            </span>
            <div className="insight-body">
              <div className="insight-title">{item.title}</div>
              <p>{item.text}</p>
            </div>
            <span className="insight-chev" aria-hidden>›</span>
          </Card>
        ))}
      </section>
    </div>
  )
}
