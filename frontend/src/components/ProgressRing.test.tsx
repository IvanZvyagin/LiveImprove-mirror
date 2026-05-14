import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import ProgressRing from './ProgressRing'

describe('ProgressRing', () => {
  it('renders value and label', () => {
    render(<ProgressRing value={72} label="прогресс" />)

    expect(screen.getByText('72%')).toBeInTheDocument()
    expect(screen.getByText('прогресс')).toBeInTheDocument()
  })
})
