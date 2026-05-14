import FunnelBar from '../components/FunnelBar'
import ProgressRing from '../components/ProgressRing'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import useAnalytics from '../hooks/useAnalytics'

export default function Analytics() {
  const { data: analytics, trackAction } = useAnalytics()
  const buildChart = (values: readonly number[], width: number, height: number) => {
    const resolvedValues =
      values.length >= 2 ? values : [values[0] ?? 0, values[0] ?? 0]
    const padding = 6
    const max = Math.max(...resolvedValues)
    const min = Math.min(...resolvedValues)
    const range = max - min || 1
    const step = (width - padding * 2) / (resolvedValues.length - 1)

    const points = resolvedValues.map((value, index) => {
      const x = padding + index * step
      const y = height - padding - ((value - min) / range) * (height - padding * 2)
      return { x, y }
    })

    const linePath = points
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ')
    const areaPath = `${linePath} L ${padding + (values.length - 1) * step} ${height - padding} L ${padding} ${
      height - padding
    } Z`

    return { width, height, points, linePath, areaPath }
  }

  const bugChart = buildChart(analytics.bugRate.points, 180, 70)
  const incomeChart = buildChart(analytics.income.points, 320, 140)

  return (
    <div className="page analytics-page">
      <header className="page-topbar">
        <div className="page-title">
          <h2>Аналитика</h2>
          <p className="page-subtitle">Отслеживайте прогресс и рост как разработчика.</p>
        </div>
        <div className="page-actions">
          <div className="tab-row compact">
            {analytics.tabs.map((tab, index) => (
              <Chip
                active={index === 1}
                key={tab}
                type="button"
                onClick={() => trackAction('analytics.tab', tab)}
              >
                {tab}
              </Chip>
            ))}
          </div>
          <button className="button ghost" type="button" onClick={() => trackAction('analytics.download')}>
            Скачать отчёт
          </button>
        </div>
      </header>

      <section className="analytics-top">
        <Card className="analytics-score">
          <div className="analytics-title">Output Score</div>
          <ProgressRing
            value={analytics.outputScore.value}
            label="/100"
            valueSuffix=""
            className="score-ring"
          />
          <div className="score-summary">
            <div className="score-status">{analytics.outputScore.status}</div>
            <div className="score-delta">{analytics.outputScore.delta}</div>
          </div>
          <div className="score-meta">
            {analytics.outputMeta.map((item) => (
              <div key={item.label}>
                <div className="meta-label">{item.label}</div>
                <div className="meta-value">
                  {item.value} <span>{item.delta}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="analytics-bug">
          <div className="analytics-title">
            Bug Rate <Badge variant="outline">На 1к строк кода</Badge>
          </div>
          <div className="bug-header">
            <div className="bug-value">{analytics.bugRate.value}</div>
            <div className="bug-delta">{analytics.bugRate.delta}</div>
            <div className="bug-caption">меньше бага чем в прошлом периоде</div>
          </div>
          <div className="line-chart">
            <svg viewBox={`0 0 ${bugChart.width} ${bugChart.height}`} role="presentation">
              <defs>
                <linearGradient id="bugArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                  <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                </linearGradient>
              </defs>
              <path className="chart-area" d={bugChart.areaPath} fill="url(#bugArea)" />
              <path className="chart-line" d={bugChart.linePath} />
              {bugChart.points.map((point, index) => {
                const isActive = index === bugChart.points.length - 1
                return (
                  <circle
                    key={`${point.x}-${point.y}`}
                    className={`chart-dot${isActive ? ' active' : ''}`}
                    cx={point.x}
                    cy={point.y}
                    r={isActive ? 4 : 2.5}
                  />
                )
              })}
            </svg>
          </div>
          <div className="chart-axis">
            {analytics.bugRate.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </Card>

        <Card className="analytics-funnel">
          <div className="analytics-title">
            Собеседования <Badge variant="outline">За 90 дней</Badge>
          </div>
          <div className="funnel-list">
            {analytics.interviews.map((stage) => (
              <FunnelBar key={stage.label} stage={stage} />
            ))}
          </div>
          <div className="funnel-meta">
            <div>
              Конверсия в оффер
              <strong> 12.5%</strong>
            </div>
            <div>
              Лучший результат
              <strong> +4.3%</strong>
            </div>
          </div>
        </Card>
      </section>

      <section className="analytics-middle">
        <Card className="income-card">
          <div className="analytics-title">Доход / Зарплата</div>
          <div className="income-header">
            <div className="income-value">{analytics.income.current}</div>
            <div className="income-delta">{analytics.income.delta}</div>
          </div>
          <div className="line-chart large">
            <svg viewBox={`0 0 ${incomeChart.width} ${incomeChart.height}`} role="presentation">
              <defs>
                <linearGradient id="incomeArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(124, 58, 237, 0.45)" />
                  <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
                </linearGradient>
              </defs>
              <path className="chart-area" d={incomeChart.areaPath} fill="url(#incomeArea)" />
              <path className="chart-line" d={incomeChart.linePath} />
            </svg>
          </div>
          <div className="chart-axis spaced">
            {analytics.income.labels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div className="income-footer">
            <div>Рост за 12 мес: +47%</div>
            <div>Прогноз: {analytics.income.forecast}</div>
          </div>
        </Card>

        <Card className="metrics-card">
          <div className="analytics-title">Ключевые метрики</div>
          <ul>
            {analytics.metrics.map((metric) => (
              <li key={metric.label}>
                <span>{metric.label}</span>
                <div>
                  <strong>{metric.value}</strong>
                  <span className="metric-delta">{metric.delta}</span>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </section>

      <section className="analytics-bottom">
        {analytics.insights.map((item) => (
          <Card className="insight-card" key={item.title}>
            <div className="insight-title">{item.title}</div>
            <p>{item.text}</p>
          </Card>
        ))}
      </section>
    </div>
  )
}
