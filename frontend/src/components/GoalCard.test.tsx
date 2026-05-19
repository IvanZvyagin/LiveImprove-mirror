import { render, screen } from '@testing-library/react'
import type { CSSProperties } from 'react'
import { describe, expect, it } from 'vitest'
import GoalCard from './GoalCard'
import type { Goal } from '../types/goals'

const goal: Goal = {
  id: 'goal-1',
  title: 'Подготовка к собеседованию',
  category: 'Обучение',
  progress: 58,
  timeLeft: '10 дней',
  targetDate: '1 июля 2025',
  accent: 'blue',
  icon: '⎈',
  iconType: 'k8s',
  items: [
    { title: 'Подцель 1', done: true, date: '10 мая' },
    { title: 'Подцель 2', done: false, date: '12 мая' },
  ],
}

describe('GoalCard', () => {
  it('renders goal details and progress', () => {
    render(<GoalCard goal={goal} accentStyle={{ '--accent-color': '#4f8cff' } as CSSProperties} />)

    expect(screen.getByText('Подготовка к собеседованию')).toBeInTheDocument()
    expect(screen.getByText('58%')).toBeInTheDocument()
    expect(screen.getByText('1 из 2 завершено')).toBeInTheDocument()
  })
})
