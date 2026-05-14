import Card from '../components/ui/Card'
import Chip from '../components/ui/Chip'
import IconButton from '../components/ui/IconButton'
import useCalendar from '../hooks/useCalendar'

const eventLabels = {
  task: 'Задача',
  habit: 'Привычка',
  interview: 'Собеседование',
} as const

export default function Calendar() {
  const { data: calendar, trackAction } = useCalendar()

  return (
    <div className="page calendar-page">
      <header className="page-topbar">
        <div className="page-title">
          <h2>Календарь</h2>
          <div className="tab-row">
            {calendar.tabs.map((tab, index) => (
              <button
                className={`tab${index === 0 ? ' active' : ''}`}
                key={tab}
                type="button"
                onClick={() => trackAction('calendar.tab', tab)}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="page-actions">
          <Chip type="button" onClick={() => trackAction('calendar.today')}>
            Сегодня
          </Chip>
          <div className="icon-group">
            <IconButton type="button" onClick={() => trackAction('calendar.prev')}>
              ◀
            </IconButton>
            <IconButton type="button" onClick={() => trackAction('calendar.next')}>
              ▶
            </IconButton>
            <IconButton type="button" onClick={() => trackAction('calendar.settings')}>
              ⚙
            </IconButton>
          </div>
        </div>
      </header>

      <section className="calendar-layout">
        <Card className="schedule-card">
          <div className="section-title">Предстоящие дни</div>
          <div className="schedule-list">
            {calendar.days.map((day) => (
              <div
                className={`schedule-day${day.label === 'Сегодня' ? ' active' : ''}`}
                key={day.id}
              >
                <span className="schedule-count">{day.events.length}</span>
                <div className="schedule-date">
                  <div className="schedule-label">{day.label}</div>
                  <div className="schedule-number">{day.date}</div>
                  <div className="schedule-month">{day.month}</div>
                </div>
                <div className="schedule-events">
                  {day.events.map((event) => (
                    <div className="schedule-event" key={`${day.id}-${event.title}`}>
                      <span className={`event-dot ${event.type}`} />
                      <div>
                        <div className="event-title">{event.title}</div>
                        <div className="event-type">{eventLabels[event.type]}</div>
                      </div>
                      <span className="event-time">{event.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="calendar-sidebar">
          <Card className="month-card">
            <div className="month-header">
              <span>{calendar.month}</span>
              <div className="icon-group">
                <IconButton type="button" onClick={() => trackAction('calendar.month.prev')}>
                  ◀
                </IconButton>
                <IconButton type="button" onClick={() => trackAction('calendar.month.next')}>
                  ▶
                </IconButton>
              </div>
            </div>
            <div className="month-weekdays">
              {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>
            <div className="month-grid">
              {calendar.monthDays.map((day, index) => (
                <span
                  key={`${day}-${index}`}
                  className={`month-cell${day === 20 ? ' active' : ''}`}
                >
                  {day}
                </span>
              ))}
            </div>
            <div className="month-legend">
              <span>
                <i className="legend-dot task" /> Задачи
              </span>
              <span>
                <i className="legend-dot habit" /> Привычки
              </span>
              <span>
                <i className="legend-dot interview" /> Собеседования
              </span>
            </div>
          </Card>

          <Card className="week-card">
            <div className="week-header">{calendar.weekStats.range}</div>
            <div className="week-list">
              <div>
                <span className="legend-dot task" /> Задачи
                <span className="week-count">{calendar.weekStats.tasks}</span>
              </div>
              <div>
                <span className="legend-dot habit" /> Привычки
                <span className="week-count">{calendar.weekStats.habits}</span>
              </div>
              <div>
                <span className="legend-dot interview" /> Собеседования
                <span className="week-count">{calendar.weekStats.interviews}</span>
              </div>
            </div>
            <div className="week-focus">
              <div className="week-focus-title">{calendar.weekStats.focusTitle}</div>
              <div className="week-focus-text">{calendar.weekStats.focusText}</div>
            </div>
            <div className="week-progress">
              <div className="week-progress-row">
                <span>Прогресс недели</span>
                <span>{calendar.weekStats.progress}%</span>
              </div>
              <div className="week-progress-bar">
                <div style={{ width: `${calendar.weekStats.progress}%` }} />
              </div>
              <div className="week-progress-footer">{calendar.weekStats.completed}</div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}
