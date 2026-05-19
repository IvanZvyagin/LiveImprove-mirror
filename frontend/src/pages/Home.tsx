import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import ProgressRing from '../components/ProgressRing'
import useDashboard from '../hooks/useDashboard'

const typeLabels = {
  habit: 'Привычка',
  task: 'Задача',
  study: 'Обучение',
} as const

export default function Home() {
  const { data: dashboard, toggleTask, addTask, trackAction } = useDashboard()

  return (
    <>
      <section className="cards">
        <Card className="progress-card">
          <div className="card-header">
            <h3>Прогресс за сегодня</h3>
            <span className="muted">⦿</span>
          </div>
          <div className="progress-body">
            <ProgressRing value={dashboard.progressToday} label="выполнено" />
            <div className="progress-metrics">
              {dashboard.progressMetrics.map((metric) => (
                <div className="metric" key={metric.label}>
                  <div className="metric-left">
                    <span className="metric-dot" style={{ backgroundColor: metric.color }} />
                    <span>{metric.label}</span>
                  </div>
                  <span>{metric.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="progress-footer">Отличный прогресс! 💪</div>
        </Card>

        <Card className="streak-card">
          <div className="card-header">
            <h3>Текущая серия</h3>
          </div>
          <div className="streak-body">
            <div className="streak-icon">🔥</div>
            <div>
              <div className="streak-value">{dashboard.streak.days}</div>
              <div className="streak-label">дней подряд</div>
            </div>
          </div>
          <div className="streak-days">
            {dashboard.streak.week.map((day) => (
              <div className={`day-pill${day.done ? ' active' : ''}`} key={day.label}>
                {day.label}
              </div>
            ))}
          </div>
        </Card>

        <Card className="interview-card">
          <div className="card-header">
            <h3>Ближайшее собеседование</h3>
          </div>
          <div className="interview-body">
            <div className="interview-role">{dashboard.nextInterview.role}</div>
            <div className="interview-company">{dashboard.nextInterview.company}</div>
            <div className="interview-meta">
              <div className="meta-item">{dashboard.nextInterview.time}</div>
              <div className="meta-item">{dashboard.nextInterview.location}</div>
            </div>
            <button
              className="button"
              type="button"
              onClick={() => trackAction('dashboard.open-prep')}
            >
              Открыть подготовку
            </button>
          </div>
        </Card>
      </section>

      <Card as="section" className="tasks-card">
        <div className="tasks-header">
          <div>
            <h3>Что делать сегодня</h3>
            <span className="tasks-count">{dashboard.todayTasks.length}</span>
          </div>
          <div className="filters">
            <button className="filter active" type="button" onClick={() => trackAction('dashboard.filter', 'all')}>
              Все
            </button>
            <button className="filter" type="button" onClick={() => trackAction('dashboard.filter', 'habits')}>
              Привычки
            </button>
            <button className="filter" type="button" onClick={() => trackAction('dashboard.filter', 'tasks')}>
              Задачи
            </button>
          </div>
        </div>
        <ul className="tasks-list">
          {dashboard.todayTasks.map((task) => (
            <li className="task-item" key={task.id ?? task.title}>
              <button
                className={`task-check${task.done ? ' done' : ''}`}
                type="button"
                onClick={() => toggleTask(task)}
              >
                {task.done ? '✓' : ''}
              </button>
              <div>
                <div className="task-title">{task.title}</div>
                <div className="task-subtitle">{task.subtitle}</div>
              </div>
              <div className="task-meta">
                <Badge variant={task.type}>{typeLabels[task.type]}</Badge>
                <span>{task.time}</span>
              </div>
            </li>
          ))}
        </ul>
        <button className="add-task" type="button" onClick={addTask}>
          ＋ Добавить задачу
        </button>
      </Card>
    </>
  )
}
