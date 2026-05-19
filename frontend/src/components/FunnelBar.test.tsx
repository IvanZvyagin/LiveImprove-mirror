import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import FunnelBar from './FunnelBar'

describe('FunnelBar', () => {
  it('renders stage label and values', () => {
    render(
      <FunnelBar
        stage={{
          label: 'Скрининг',
          value: 24,
          percent: 100,
          gradient: 'linear-gradient(90deg, #8b5cf6, #a855f7)',
        }}
      />,
    )

    expect(screen.getByText('Скрининг')).toBeInTheDocument()
    expect(screen.getByText('24')).toBeInTheDocument()
    expect(screen.getByText('100%')).toBeInTheDocument()
  })
})
