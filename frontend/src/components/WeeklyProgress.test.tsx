import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import WeeklyProgress from './WeeklyProgress'

describe('WeeklyProgress', () => {
  it('renders labels and summary', () => {
    render(
      <WeeklyProgress
        total="12 из 21 выполнено"
        items={[
          { label: 'Пн', value: 0.7, color: '#34d399' },
          { label: 'Вт', value: 0.5, color: '#60a5fa' },
          { label: 'Ср', value: 0.8, color: '#a855f7' },
          { label: 'Чт', value: 0.4, color: '#34d399' },
          { label: 'Пт', value: 0.9, color: '#60a5fa' },
          { label: 'Сб', value: 0.2, color: '#a855f7' },
          { label: 'Вс', value: 0.3, color: '#94a3b8' },
        ]}
      />,
    )

    expect(screen.getByText('Общий прогресс за неделю')).toBeInTheDocument()
    expect(screen.getByText('12 из 21 выполнено')).toBeInTheDocument()
    expect(screen.getByText('Пн')).toBeInTheDocument()
    expect(screen.getByText('Вс')).toBeInTheDocument()
  })
})
